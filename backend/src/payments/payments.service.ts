import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
import { Course } from '../entities/course.entity';
import { CourseUser } from '../entities/course-user.entity';
const paypal = require('@paypal/checkout-server-sdk');

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        @InjectRepository(Course)
        private courseRepo: Repository<Course>,
        @InjectRepository(CourseUser)
        private courseUserRepo: Repository<CourseUser>
    ) {}

    private environment() {
        const clientId = process.env.PAYPAL_CLIENT_ID || 'test';
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'test';
        return new paypal.core.SandboxEnvironment(clientId, clientSecret);
    }

    private client() {
        return new paypal.core.PayPalHttpClient(this.environment());
    }

    async createPaypalOrder(slug: string, userId: number) {
        // 1. Resolve pricing and course metadata directly from Database
        const course = await this.courseRepo.findOne({ where: { slug } });
        if (!course) throw new NotFoundException('Course not found');

        // 2. Prevent double enrollment
        const existingEnrollment = await this.courseUserRepo.findOne({
            where: { user_id: userId, course_id: course.id }
        });
        if (existingEnrollment) {
            throw new BadRequestException('You are already enrolled in this course.');
        }

        const price = course.discount_price ? Number(course.discount_price) : Number(course.price);
        const orderNumber = `ET-ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. Generate granular, traceable Order row
        const newOrder = this.orderRepo.create({
            order_number: orderNumber,
            user_id: userId,
            course_id: course.id,
            course_name: course.course_name,
            course_slug: course.slug,
            total_amount: price,
            currency: 'USD',
            payment_method: 'paypal',
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
        });
        const savedOrder = await this.orderRepo.save(newOrder);

        // 4. Command PayPal order creation with item details
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: orderNumber,
                description: `Course Enrollment: ${course.course_name}`.substring(0, 127),
                custom_id: JSON.stringify({
                    order_id: savedOrder.id,
                    course_id: course.id,
                    user_id: userId
                }),
                amount: {
                    currency_code: 'USD',
                    value: price.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: price.toFixed(2)
                        }
                    }
                },
                items: [{
                    name: course.course_name.substring(0, 127),
                    description: (course.short_description || course.course_name).substring(0, 127),
                    sku: `ET-CRS-${course.id}-${course.slug}`.substring(0, 64),
                    unit_amount: {
                        currency_code: 'USD',
                        value: price.toFixed(2)
                    },
                    quantity: '1',
                    category: 'DIGITAL_GOODS'
                }]
            }]
        } as any);

        try {
            const response = await this.client().execute(request);
            
            // 5. Generate granular Payment tracker
            const newPayment = this.paymentRepo.create({
                order_id: savedOrder.id,
                payment_id: response.result.id,
                amount: price,
                currency: 'USD',
                status: 'pending',
                created_at: new Date(),
                updated_at: new Date()
            });
            await this.paymentRepo.save(newPayment);

            return { id: response.result.id, orderNumber: savedOrder.order_number };
        } catch (e: any) {
            console.error('PayPal create order error:', e);
            savedOrder.status = 'failed';
            savedOrder.updated_at = new Date();
            await this.orderRepo.save(savedOrder);
            throw new InternalServerErrorException(e?.message || 'Error creating paypal order');
        }
    }

    async capturePaypalOrder(orderID: string) {
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({} as any);
        
        const payment = await this.paymentRepo.findOne({ where: { payment_id: orderID } });
        
        try {
            const capture = await this.client().execute(request);
            
            if (payment) {
                // Update table with exact payer IDs and payloads
                payment.status = 'paid';
                payment.payer_id = capture.result.payer?.payer_id;
                payment.payment_response = JSON.stringify(capture.result);
                payment.updated_at = new Date();
                await this.paymentRepo.save(payment);
                
                // Finalize primary order status
                await this.orderRepo.update(payment.order_id, { status: 'paid', updated_at: new Date() });

                // Securely enroll student into course_user
                const order = await this.orderRepo.findOne({ where: { id: payment.order_id } });
                if (order && order.user_id && order.course_id) {
                    const alreadyEnrolled = await this.courseUserRepo.findOne({
                        where: { user_id: order.user_id, course_id: order.course_id }
                    });
                    if (!alreadyEnrolled) {
                        const enrollment = this.courseUserRepo.create({
                            user_id: order.user_id,
                            course_id: order.course_id,
                            order_id: order.id,
                            created_at: new Date(),
                            updated_at: new Date()
                        });
                        await this.courseUserRepo.save(enrollment);
                    }
                }
            }
            
            return { success: true, captureID: capture.result.id };
        } catch (e) {
            console.error('PayPal capture error:', e);
            if (payment) {
                payment.status = 'failed';
                payment.updated_at = new Date();
                await this.paymentRepo.save(payment);
                await this.orderRepo.update(payment.order_id, { status: 'failed', updated_at: new Date() });
            }
            return { success: false };
        }
    }

    async getStudentCourses(userId: number) {
        const enrollments = await this.courseUserRepo.find({
            where: { user_id: userId },
            relations: ['course', 'order'],
            order: { created_at: 'DESC' }
        });

        return enrollments.map(en => ({
            enrollment_id: en.id,
            enrolled_at: en.created_at,
            order_number: en.order?.order_number || null,
            course: en.course ? {
                id: en.course.id,
                course_name: en.course.course_name,
                slug: en.course.slug,
                thumbnail: en.course.thumbnail,
                short_description: en.course.short_description,
                course_duration: en.course.course_duration,
                course_type: en.course.course_type,
                course_mode: en.course.course_mode,
                price: en.course.price,
                discount_price: en.course.discount_price,
                is_featured: en.course.is_featured
            } : null
        })).filter(e => e.course !== null);
    }

    async checkEnrollment(userId: number, slug: string) {
        const course = await this.courseRepo.findOne({ where: { slug } });
        if (!course) return { enrolled: false };
        const enrollment = await this.courseUserRepo.findOne({
            where: { user_id: userId, course_id: course.id }
        });
        return { enrolled: !!enrollment, course_id: course.id };
    }
}

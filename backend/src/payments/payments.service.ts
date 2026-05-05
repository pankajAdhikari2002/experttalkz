import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
import { Course } from '../entities/course.entity';
const paypal = require('@paypal/checkout-server-sdk');

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        @InjectRepository(Course)
        private courseRepo: Repository<Course>
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
        // 1. Resolve pricing from Database
        const course = await this.courseRepo.findOne({ where: { slug } });
        if (!course) throw new NotFoundException('Course not found');
        const price = course.discount_price ? Number(course.discount_price) : Number(course.price);

        // 2. Generate generic Order row
        const newOrder = this.orderRepo.create({
            user_id: userId,
            total_amount: price,
            currency: 'USD',
            payment_method: 'paypal',
            status: 'pending'
        });
        const savedOrder = await this.orderRepo.save(newOrder);

        // 3. Command PayPal integration
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: savedOrder.id.toString(), // Hard link to DB Order
                amount: {
                    currency_code: 'USD',
                    value: price.toFixed(2)
                }
            }]
        } as any);

        try {
            const response = await this.client().execute(request);
            
            // 4. Generate granular Payment tracker
            const newPayment = this.paymentRepo.create({
                order_id: savedOrder.id,
                payment_id: response.result.id,
                amount: price,
                currency: 'USD',
                status: 'pending'
            });
            await this.paymentRepo.save(newPayment);

            return { id: response.result.id };
        } catch (e) {
            console.error(e);
            savedOrder.status = 'failed';
            await this.orderRepo.save(savedOrder);
            throw new InternalServerErrorException('Error creating paypal order');
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
                await this.paymentRepo.save(payment);
                
                // Finalize primary order status
                await this.orderRepo.update(payment.order_id, { status: 'paid' });
            }
            
            return { success: true, captureID: capture.result.id };
        } catch (e) {
            console.error(e);
            if (payment) {
                payment.status = 'failed';
                await this.paymentRepo.save(payment);
                await this.orderRepo.update(payment.order_id, { status: 'failed' });
            }
            return { success: false };
        }
    }
}

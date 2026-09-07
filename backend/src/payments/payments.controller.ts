import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@Controller('api/payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('create-paypal-order')
    async createOrder(@Body('slug') slug: string, @Req() req: any) {
        const userId = req.user.id || req.user.userId;
        return this.paymentsService.createPaypalOrder(slug, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('capture-paypal-order')
    async captureOrder(@Body('orderID') orderID: string) {
        return this.paymentsService.capturePaypalOrder(orderID);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my-courses')
    async getMyCourses(@Req() req: any) {
        const userId = req.user.id || req.user.userId;
        return this.paymentsService.getStudentCourses(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('check-enrollment/:slug')
    async checkEnrollment(@Param('slug') slug: string, @Req() req: any) {
        const userId = req.user.id || req.user.userId;
        return this.paymentsService.checkEnrollment(userId, slug);
    }
}

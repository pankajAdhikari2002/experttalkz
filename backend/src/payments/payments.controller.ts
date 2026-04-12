import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@Controller('api/payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('create-paypal-order')
    async createOrder(@Body('slug') slug: string, @Req() req: any) {
        return this.paymentsService.createPaypalOrder(slug, req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('capture-paypal-order')
    async captureOrder(@Body('orderID') orderID: string) {
        return this.paymentsService.capturePaypalOrder(orderID);
    }
}

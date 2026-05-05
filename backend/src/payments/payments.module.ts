import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Order } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
import { Course } from '../entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Payment, Course])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

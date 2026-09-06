import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RazorpayPaymentProvider } from './razorpay.provider';
import { OrdersModule } from '../orders/orders.module';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayPaymentProvider, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RazorpayPaymentProvider } from './razorpay.provider';
import { PartnerMatchingService } from '../orders/partner-matching.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private paymentProvider: RazorpayPaymentProvider,
    private partnerMatchingService: PartnerMatchingService,
  ) {}

  async createPayment(orderId: string, customerId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, customerId },
      include: {
        customer: { include: { user: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(`Order cannot be paid in current status: ${order.status}`);
    }

    const providerResult = await this.paymentProvider.createPayment({
      orderId: order.id,
      amount: order.finalTotal,
      currency: 'INR',
      receipt: order.orderNumber,
      customer: {
        name: order.customer.user.name,
        email: order.customer.user.email,
        mobile: order.customer.user.mobile,
      },
    });

    // Record or update payment entity
    const payment = await this.prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        amount: order.finalTotal,
        status: PaymentStatus.PENDING,
        gatewayOrderId: providerResult.gatewayOrderId,
        provider: providerResult.provider,
      },
      create: {
        orderId: order.id,
        amount: order.finalTotal,
        currency: 'INR',
        status: PaymentStatus.PENDING,
        gatewayOrderId: providerResult.gatewayOrderId,
        provider: providerResult.provider,
      },
    });

    return {
      paymentId: payment.id,
      gatewayOrderId: providerResult.gatewayOrderId,
      amount: order.finalTotal,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
      orderNumber: order.orderNumber,
    };
  }

  async verifyPayment(data: {
    orderId: string;
    gatewayOrderId: string;
    gatewayPaymentId: string;
    gatewaySignature: string;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        items: true,
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const isValid = await this.paymentProvider.verifyPayment({
      gatewayOrderId: data.gatewayOrderId,
      gatewayPaymentId: data.gatewayPaymentId,
      gatewaySignature: data.gatewaySignature,
    });

    if (!isValid) {
      throw new BadRequestException('Payment signature verification failed');
    }

    // Process confirmation in transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Mark payment CAPTURED
      await tx.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.CAPTURED,
          gatewayPaymentId: data.gatewayPaymentId,
          gatewaySignature: data.gatewaySignature,
        },
      });

      // 2. Transition Order to CONFIRMED
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CONFIRMED },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          oldStatus: OrderStatus.PENDING_PAYMENT,
          newStatus: OrderStatus.CONFIRMED,
          changedBy: 'SYSTEM_PAYMENT',
          reason: `Payment captured successfully via ${data.gatewayPaymentId}`,
        },
      });

      // 3. Generate Tax Invoice
      const invoiceCount = await tx.invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`;

      await tx.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber,
          totalAmount: order.finalTotal,
          taxAmount: order.taxTotal,
        },
      });

      // 4. Partner auto-matching
      if (order.items.length > 0) {
        const primaryServiceId = order.items[0].serviceId;
        const matchedPartner = await this.partnerMatchingService.findBestPartner(
          primaryServiceId,
          order.address.city,
        );

        if (matchedPartner) {
          await tx.order.update({
            where: { id: order.id },
            data: {
              partnerId: matchedPartner.id,
              status: OrderStatus.ASSIGNED,
            },
          });

          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              oldStatus: OrderStatus.CONFIRMED,
              newStatus: OrderStatus.ASSIGNED,
              changedBy: 'SYSTEM_DISPATCH',
              reason: `Matched partner ${matchedPartner.businessName || matchedPartner.id}`,
            },
          });
        }
      }

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: OrderStatus.CONFIRMED,
      };
    });
  }

  async getPaymentByOrderId(orderId: string) {
    return this.prisma.payment.findUnique({
      where: { orderId },
      include: { transactions: true, refunds: true },
    });
  }
}

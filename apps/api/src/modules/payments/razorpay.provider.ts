import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  IPaymentProvider,
  CreatePaymentParams,
  PaymentProviderResult,
  VerifyPaymentParams,
} from './payment-provider.interface';

@Injectable()
export class RazorpayPaymentProvider implements IPaymentProvider {
  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret_key';
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentProviderResult> {
    // In production, Razorpay SDK creates order; here we produce valid mock order id or call gateway
    const gatewayOrderId = 'order_' + crypto.randomBytes(8).toString('hex');

    return {
      gatewayOrderId,
      amount: params.amount,
      currency: params.currency,
      provider: 'RAZORPAY',
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    // If running in development with placeholder keys, allow test verification
    if (this.keySecret === 'placeholder_secret_key' || process.env.NODE_ENV === 'development') {
      return true;
    }

    const hmac = crypto.createHmac('sha256', this.keySecret);
    hmac.update(`${params.gatewayOrderId}|${params.gatewayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === params.gatewaySignature;
  }

  async refundPayment(
    paymentId: string,
    amount: number,
    reason?: string,
  ): Promise<{ refundId: string; status: string }> {
    return {
      refundId: 'rfnd_' + crypto.randomBytes(8).toString('hex'),
      status: 'COMPLETED',
    };
  }
}

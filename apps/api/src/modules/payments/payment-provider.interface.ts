export interface CreatePaymentParams {
  orderId: string;
  amount: number; // in INR
  currency: string;
  receipt: string;
  customer: {
    name: string;
    email: string;
    mobile: string;
  };
}

export interface PaymentProviderResult {
  gatewayOrderId: string;
  amount: number;
  currency: string;
  provider: string;
}

export interface VerifyPaymentParams {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

export interface IPaymentProvider {
  createPayment(params: CreatePaymentParams): Promise<PaymentProviderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<boolean>;
  refundPayment(paymentId: string, amount: number, reason?: string): Promise<{ refundId: string; status: string }>;
}

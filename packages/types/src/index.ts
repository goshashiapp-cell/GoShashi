// Roles & Permissions
export enum UserRoleType {
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE',
  SUPPORT = 'SUPPORT',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
}

// Booking Lifecycle
export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  SEARCHING_PARTNER = 'SEARCHING_PARTNER',
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  ON_THE_WAY = 'ON_THE_WAY',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

// Partner KYC Status
export enum KycStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

// Address Types
export enum AddressType {
  HOME = 'HOME',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

// Product Types
export enum ProductType {
  SERVICE = 'SERVICE',
  LEAD_GENERATION = 'LEAD_GENERATION',
  PRODUCT = 'PRODUCT',
}

// Payment Status
export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Refund Status
export enum RefundStatus {
  REQUESTED = 'REQUESTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Support Ticket Status
export enum TicketStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// Coupon Discount Type
export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

// Commission Type
export enum CommissionType {
  GLOBAL = 'GLOBAL',
  CATEGORY = 'CATEGORY',
  SERVICE = 'SERVICE',
  PARTNER = 'PARTNER',
  CITY = 'CITY',
}

// Notification Channel
export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  PUSH = 'PUSH',
}

// API Standard Responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Core User Token Claims
export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRoleType[];
  customerId?: string;
  partnerId?: string;
}

// Pricing Calculation Breakdown
export interface PriceBreakdown {
  basePrice: number;
  addonsTotal: number;
  discountTotal: number;
  taxTotal: number;
  platformFee: number;
  finalTotal: number;
}

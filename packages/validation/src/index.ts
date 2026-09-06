import { z } from 'zod';

// Phone regex: 10 digits Indian mobile format
export const phoneRegex = /^[6-9]\d{9}$/;
export const pincodeRegex = /^\d{6}$/;

// Customer Registration Schema
export const RegisterCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  mobile: z.string().regex(phoneRegex, 'Invalid 10-digit mobile number'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  referralCode: z.string().optional(),
});

export type RegisterCustomerDto = z.infer<typeof RegisterCustomerSchema>;

// Login Schema (Email or Mobile)
export const LoginSchema = z.object({
  identifier: z.string().min(3, 'Email or mobile number is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginSchema>;

// OTP Verification Schema
export const VerifyOtpSchema = z.object({
  mobile: z.string().regex(phoneRegex, 'Invalid 10-digit mobile number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;

// Customer Address Schema
export const AddressSchema = z.object({
  name: z.string().min(2, 'Recipient name required'),
  mobile: z.string().regex(phoneRegex, 'Invalid 10-digit mobile number'),
  house: z.string().min(1, 'Flat / House / Building details required'),
  street: z.string().min(2, 'Street or lane name required'),
  area: z.string().min(2, 'Area or locality required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(pincodeRegex, 'Valid 6-digit PIN code required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  addressType: z.enum(['HOME', 'OFFICE', 'OTHER']).default('HOME'),
});

export type AddressDto = z.infer<typeof AddressSchema>;

// Cart Item Schema
export const AddToCartSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  quantity: z.number().int().min(1).default(1),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format YYYY-MM-DD required').optional(),
  scheduledTime: z.string().optional(),
  addressId: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
  addonIds: z.array(z.string().uuid()).optional(),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>;

// Partner Registration Schema
export const PartnerRegisterSchema = z.object({
  name: z.string().min(2),
  mobile: z.string().regex(phoneRegex),
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().optional(),
  businessType: z.string().default('INDIVIDUAL'),
  experienceYears: z.number().min(0).max(50).default(1),
  categoryIds: z.array(z.string().uuid()).min(1, 'Select at least one category'),
  serviceRadiusKm: z.number().min(1).max(50).default(10),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(pincodeRegex),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  bankAccountNumber: z.string().min(9).max(18),
  bankIfsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
});

export type PartnerRegisterDto = z.infer<typeof PartnerRegisterSchema>;

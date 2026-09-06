# GoShashi — Security Architecture & Guidelines

## 1. Authentication & Session Management
- **Password Hashing**: Uses `argon2id` with high memory and iteration cost params to withstand modern GPU cracking.
- **JWT Architecture**:
  - Access Token: Short-lived (15 minutes).
  - Refresh Token: Long-lived (7 days), stored hashed in database with rotation upon each token issuance.
  - Revocation: `POST /auth/logout` clears the stored refresh token hash.
- **Mobile OTP**:
  - Expiration: 5 minutes.
  - Rate Limiting: Maximum 3 attempts per 15 minutes per phone number.

## 2. Authorization & RBAC
- Explicit server-side authorization guards on all protected API endpoints (`RolesGuard`).
- Roles: `CUSTOMER`, `PARTNER`, `ADMIN`, `SUPER_ADMIN`, `OPERATIONS`, `FINANCE`, `SUPPORT`, `CONTENT_MANAGER`.
- Frontend route protection is treated only as a UX convenience; the backend API rejects unauthorized requests with `403 Forbidden`.

## 3. Financial Integrity & Zero-Trust Pricing
- The frontend never submits price values. Prices are looked up strictly server-side from the active service catalog and applicable city pricing rules.
- Coupons are validated against database minimum order requirements, category applicability, expiration dates, and user usage counts.
- Webhooks from Razorpay require cryptographic HMAC SHA256 signature verification before any order status transition to `CONFIRMED`.
- Webhook events are processed idempotently using database transactions.

## 4. Input Validation & Defenses
- Strict DTO validation with class-validator/Zod whitelist stripping.
- Helmet security headers: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options.
- CORS restricted to configured frontend domains.
- Throttler rate limiting applied across sensitive endpoints (`/auth/*`, `/payments/*`, `/orders/*`).

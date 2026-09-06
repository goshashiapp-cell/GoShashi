# GoShashi — REST API Specification (v1)

Base URL: `/api/v1`

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "mobile",
      "message": "Invalid 10-digit mobile number"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "message": "Items retrieved",
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

---

## Endpoint Matrix

### 1. Health & Diagnostics
- `GET /api/v1/health`: Basic uptime status `{ "status": "ok" }`.
- `GET /api/v1/health/database`: Database connectivity check (Admin/Internal).

### 2. Authentication (`/auth`)
- `POST /auth/register`: Register new customer with name, email, mobile, password, optional referral code.
- `POST /auth/verify-otp`: Verify 6-digit OTP sent to mobile.
- `POST /auth/login`: Authenticate with email/mobile and password. Returns JWT access token (15m) + refresh token (7d).
- `POST /auth/login-otp`: Request OTP for passwordless login.
- `POST /auth/refresh`: Issue fresh access token using HTTP-only refresh token.
- `POST /auth/logout`: Revoke active refresh token.
- `POST /auth/forgot-password`: Request password reset token.
- `POST /auth/reset-password`: Reset password using verified token.
- `GET /auth/me`: Get active user profile, roles, and identity.

### 3. Categories & Catalog (`/categories`, `/services`)
- `GET /categories`: List active categories with icons, images, and sort orders.
- `GET /categories/:slug`: Retrieve category by slug with subcategories.
- `GET /services`: Search/filter services by category, keyword, price range, city, rating.
- `GET /services/:slug`: Detailed service view with inclusions, exclusions, add-ons, FAQs, and reviews.
- `POST /admin/services`: (Admin) Create service.
- `PUT /admin/services/:id`: (Admin) Update service details.
- `DELETE /admin/services/:id`: (Admin) Soft delete or disable service.

### 4. Cart (`/cart`)
- `GET /cart`: Fetch active customer cart with items, scheduled slots, and calculated totals.
- `POST /cart/items`: Add service item with quantity, addons, and scheduling notes.
- `PUT /cart/items/:id`: Update item quantity or selected addons.
- `DELETE /cart/items/:id`: Remove item from cart.
- `DELETE /cart`: Clear all cart items.

### 5. Addresses (`/addresses`)
- `GET /addresses`: List saved addresses for authenticated customer.
- `POST /addresses`: Create new address (house, street, area, city, pincode, lat/lng).
- `PUT /addresses/:id`: Update address.
- `DELETE /addresses/:id`: Remove address.

### 6. Orders & Booking Lifecycle (`/orders`)
- `POST /orders`: Checkout and initialize order from cart or direct booking.
- `GET /orders`: List customer bookings with status filter.
- `GET /orders/:id`: Full booking details, status history, assigned partner, and invoice.
- `POST /orders/:id/cancel`: Cancel order according to cancellation policy.
- `POST /orders/:id/reschedule`: Request reschedule for date/time slot.

### 7. Payments (`/payments`)
- `POST /payments/create`: Create Razorpay payment order for booking.
- `POST /payments/verify`: Cryptographically verify Razorpay signature (`order_id`, `payment_id`, `signature`).
- `GET /payments/:id`: Get payment transaction status.
- `POST /payments/:id/refund`: (Admin/Ops) Initiate refund.
- `POST /payments/webhook`: Idempotent payment webhook receiver verifying Razorpay HMAC secret.

### 8. Partner (`/partner`)
- `POST /partner/register`: Partner onboarding submission with business details and KYC.
- `GET /partner/profile`: Get partner profile, operational status, rating, and service radius.
- `PUT /partner/profile`: Update availability or service radius.
- `GET /partner/jobs`: List available or active jobs.
- `GET /partner/jobs/:id`: Job details (customer address, scheduling window, earnings).
- `POST /partner/jobs/:id/accept`: Accept dispatched job.
- `POST /partner/jobs/:id/reject`: Reject dispatched job with reason.
- `POST /partner/jobs/:id/arrived`: Mark arrived at customer location.
- `POST /partner/jobs/:id/start`: Begin service execution.
- `POST /partner/jobs/:id/complete`: Complete service (upload before/after photos and notes).
- `GET /partner/earnings`: Partner earnings ledger, platform commission breakdown, and net withdrawable balance.
- `GET /partner/payouts`: Historical payout requests and settlement statuses.

### 9. Admin (`/admin`)
- `GET /admin/dashboard`: Real-time KPI summaries (revenue, bookings, partner status, pending KYC, tickets).
- `GET /admin/customers`: Customer directory with search, filter, and block controls.
- `GET /admin/partners`: Partner directory with KYC review and commission rate overrides.
- `GET /admin/orders`: Order registry with state transition overrides.
- `GET /admin/payments`: Financial audit ledger.
- `GET /admin/reports`: Export data reports in CSV format.

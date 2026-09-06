# GoShashi — Product Requirements Document (PRD)

## 1. Product Overview
**GoShashi** is an on-demand services marketplace designed to connect homeowners and commercial clients with verified, skilled local service professionals (cleaning, appliance repair, plumbing, electrical, carpentry, painting, pest control, photography, and more).

The platform provides:
1. **Customers**: Frictionless discovery, transparent upfront pricing, flexible scheduling, secure checkout (Razorpay), real-time booking tracking, partner communication, digital invoicing, and verifiable rating/reviews.
2. **Service Partners**: Seamless onboarding & KYC verification, localized service area selection, availability calendar, instant job dispatch & acceptance, route guidance, milestone tracking (On the way, Arrived, Started, Completed with Before/After photos), earnings ledger, and automated payout tracking.
3. **Administrators / Operators**: Complete multi-role administration (Super Admin, Ops, Finance, Support, Content Manager) for catalog management, dynamic multi-city pricing rules, partner KYC verification, commission calculations, order management, dispute resolution, refund processing, promotional coupons, CMS/banners, and audit trails.

---

## 2. Key Personas & User Journeys

### 2.1 Customer Journey
1. **Discovery & Search**: Browse curated categories or use the debounced global search with multi-faceted filtering (category, price, rating, availability, location).
2. **Service Details**: Explore rich service information including high-res gallery, detailed inclusions/exclusions, warranty, add-ons, FAQs, and authentic customer reviews.
3. **Cart & Scheduling**: Add service items with optional add-ons, select service address (Home, Office, Other), pick date and morning/afternoon/evening time slots.
4. **Checkout & Payment**: Review transparent price breakdown (base price, add-ons, taxes, platform fee, coupon discount). Pay securely via Razorpay (card, UPI, net banking) or choose COD/Pay after service where permitted.
5. **Fulfillment Tracking**: Real-time status updates: `CONFIRMED` -> `SEARCHING_PARTNER` -> `ASSIGNED` -> `ACCEPTED` -> `ON_THE_WAY` -> `ARRIVED` -> `IN_PROGRESS` -> `COMPLETED`.
6. **Post-Service**: Download itemized tax invoice (PDF), rate and review partner with optional photo upload, initiate support ticket if issues arise.

### 2.2 Service Partner Journey
1. **Onboarding & Registration**: Submit personal info, business details, service categories, operational radius (in km), bank account details, and KYC documents (PAN, Government ID, Address proof).
2. **KYC Verification**: Partner account remains restricted from production job dispatch until Admin verifies and approves KYC documents.
3. **Job Dispatch & Acceptance**: Receive localized job notifications matching skills and service radius. Review service details, customer address, scheduled time, and estimated earnings before accepting/rejecting.
4. **Job Execution**: Mark status milestones (`ON_THE_WAY`, `ARRIVED`, `IN_PROGRESS`, `COMPLETED`), upload required Before & After verification photos, and record final customer confirmation.
5. **Financials**: Real-time earnings dashboard displaying gross amount, platform commissions, tax withholding, withdrawable balance, and historical payout status.

### 2.3 Administrator Journey
1. **Operations Dashboard**: Real-time KPI monitoring: revenue, active orders, partner dispatch status, pending KYC requests, refund requests, and open support tickets.
2. **Catalog & Pricing Engine**: Dynamic category/service management with multi-tier pricing, add-ons, city-specific pricing rules, and platform commission tiers.
3. **Partner & KYC Governance**: Review partner applications, inspect documents, approve/reject/request resubmissions, and adjust partner commission rates or operational status.
4. **Financial Oversight**: Audit payments, monitor webhook captures, process refunds via payment provider abstraction, reconcile partner payout ledgers, and export CSV reports.
5. **CMS & Marketing**: Manage homepage banners, SEO metadata, promotional coupons (fixed/percentage with min/max caps), FAQs, and legal/policy pages.

---

## 3. Core Business & Domain Rules
1. **Zero Client Trust on Pricing**: All prices, taxes, discounts, coupon validations, platform fees, and partner earnings are calculated strictly on the backend. The frontend is purely a presentation layer.
2. **Auditability & Financial Safety**: Financial records (Orders, Payments, Refunds, Payouts, Invoices, Commissions) are completely immutable. Soft transitions and audit logs are enforced; permanent deletion is prohibited.
3. **Partner Matching Algorithm**:
   - Skill Match: 30%
   - Distance / Proximity: 25%
   - Partner Rating: 20%
   - Availability: 15%
   - Completion Rate: 10%
4. **Cancellation Policy**:
   - Cancellation > 2 hours prior to scheduled slot: Free cancellation.
   - Cancellation < 2 hours prior: Standard cancellation fee.
   - Cancellation after partner arrives: Visit fee applies.
5. **Review Integrity**: Customers can submit reviews only for orders in `COMPLETED` status. Duplicate reviews per order are prevented, and admin moderation is available.
6. **Multi-City Scalability**: Primary initial launch in Gurugram (NCR), with native support for multi-city expansion (City, State, Pincode, localized catalog and pricing).

---

## 4. Technical Non-Negotiables
- **Monorepo Architecture**: Clean separation (`apps/web`, `apps/api`, `packages/types`, `packages/config`).
- **Frameworks**: Next.js (React, TypeScript, Tailwind CSS, Lucide Icons) & NestJS (TypeScript, Prisma ORM, MySQL 8+).
- **Deployment Target**: 100% Hostinger Node.js hosting compatible. No mandatory reliance on AWS, Docker, Kubernetes, or proprietary serverless runtimes in production.
- **Security**: Argon2 password hashing, JWT access + refresh token rotation, strict RBAC, rate-limiting on sensitive endpoints (OTP, Auth, Checkout), signature-verified payment webhooks, and secure file handling.
- **Code Quality**: Strict TypeScript, ESLint, Prettier, unit tests, integration tests, E2E validation, and zero production build warnings.

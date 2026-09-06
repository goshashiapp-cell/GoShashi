# GoShashi — System Architecture

## 1. System Topology & Monorepo Structure
GoShashi is organized as a modular TypeScript monorepo designed for maintainability, unified typing, and Hostinger Node.js deployment.

```
goshashi/
│
├── apps/
│   ├── web/                    # Next.js customer, partner & admin frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router (Customer, /partner, /admin routes)
│   │   │   ├── components/     # Design system & shared UI components
│   │   │   ├── hooks/          # React hooks & TanStack Query hooks
│   │   │   ├── lib/            # API client, utilities, formatting
│   │   │   └── types/          # Frontend-specific state types
│   │   ├── public/             # Static assets, PWA manifest, service worker
│   │   └── package.json
│   │
│   └── api/                    # NestJS REST API application
│       ├── src/
│       │   ├── modules/        # Domain modules (auth, users, catalog, cart,
│       │   │                   # orders, payments, partners, admin, notifications)
│       │   ├── common/         # Guards, interceptors, filters, decorators
│       │   ├── config/         # Environment configuration & validation
│       │   ├── database/       # Prisma service & database utilities
│       │   └── main.ts         # NestJS bootstrap & global middleware
│       ├── test/               # Unit and e2e tests
│       └── package.json
│
├── packages/
│   ├── types/                  # Shared domain types, DTOs & enums
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── validation/             # Shared Zod validation schemas
│   │   ├── src/
│   │   └── package.json
│   │
│   └── config/                 # Shared constants, business rule defaults
│       ├── src/
│       └── package.json
│
├── prisma/
│   ├── schema.prisma           # Complete normalized schema (MySQL 8+)
│   ├── seed.ts                 # Realistic development seed dataset
│   └── migrations/             # Tracked schema migrations
│
├── docs/                       # Architecture, PRD, API, Security, Deployment specs
├── .github/workflows/          # CI pipeline (lint, typecheck, test, build)
├── .env.example                # Canonical environment template
├── package.json                # Monorepo root scripts & workspace configuration
└── README.md
```

---

## 2. Technology Stack & Hostinger Compatibility

| Layer | Technology | Rationale & Hostinger Considerations |
| :--- | :--- | :--- |
| **Monorepo Engine** | npm workspaces | Zero native dependencies, standard across Node.js runtimes |
| **Frontend** | Next.js 15+ (App Router), React, Tailwind CSS, Lucide | Standalone Node.js server or standalone output for Hostinger Node.js app |
| **Backend** | NestJS (Fastify/Express), TypeScript | Enterprise modular architecture with Dependency Injection, easily run via Hostinger Node.js manager |
| **Database** | MySQL 8.0+ | Native Hostinger MySQL database support with standard connection pooling |
| **ORM** | Prisma | Strongly typed database queries, migration tracking, and seed engine |
| **Authentication** | JWT + Refresh Token Rotation, Argon2id | Stateless auth, secure cookie/bearer support, RBAC with DB verification |
| **Payment Provider** | Provider Abstraction (Razorpay initially) | Decoupled adapter pattern allowing Stripe/PayU/Cash addition without schema redesign |
| **Map/Location** | Geolocation & Google Maps API abstraction | Address autocomplete, geocoding, and distance matrix for partner dispatch |
| **Realtime / Chat**| REST Polling (Initial) -> WebSocket ready | REST polling avoids Hostinger WebSocket proxy complications; clean upgrade path |

---

## 3. Database Architecture & Schema Domains
The database is structured in MySQL 8 via Prisma:
1. **Identity & RBAC**:
   - `User`: Base identity (email, mobile, passwordHash, status, roles)
   - `Role`, `UserRole`: Role-based access control (`CUSTOMER`, `PARTNER`, `ADMIN`, `SUPER_ADMIN`, `OPERATIONS`, `FINANCE`, `SUPPORT`)
   - `Customer`: Customer profile, referral code, preferences
   - `Partner`: Partner profile, business info, verification status, rating, completion metrics
   - `PartnerDocument`: KYC documents (PAN, Aadhaar/Govt ID, Bank passbook, status)
   - `PartnerService`, `PartnerServiceArea`, `PartnerAvailability`: Partner operational coverage
2. **Catalog & Pricing**:
   - `Category`, `Subcategory`: Hierarchy, SEO slugs, icons, status
   - `Service`: Base price, sale price, duration, warranty, ratings, tax rates
   - `ServiceImage`, `ServiceIncludedItem`, `ServiceExcludedItem`, `ServiceAddon`, `ServiceFAQ`
   - `City`, `CityPricingRule`: Multi-city pricing adjustments
3. **Cart, Address & Order Lifecycle**:
   - `Address`: User saved addresses with geolocation (lat/lng), house/street/area
   - `Cart`, `CartItem`, `CartItemAddon`: Server-side persisted carts
   - `Order`, `OrderItem`, `OrderItemAddon`: Booking records with exact price snapshots
   - `OrderStatusHistory`: Immutable state machine tracking every transition
4. **Payments, Invoices & Commissions**:
   - `Payment`: Gateway transaction records (Razorpay order ID, payment ID, signature, status)
   - `PaymentTransaction`: Transaction logs with raw webhook payloads
   - `Refund`: Refund requests, gateway refund ID, amount, reason, status
   - `CommissionRule`: Global, category, or partner-level commission configuration
   - `Payout`, `PartnerLedger`: Partner earnings, withholdings, and payout settlements
   - `Invoice`: Itemized PDF tax invoice generation metadata
5. **Marketing, Engagement & Governance**:
   - `Coupon`, `CouponUsage`: Percentage and fixed discounts with strict redemption constraints
   - `Review`, `ReviewImage`: Verified post-service ratings with moderation
   - `Notification`, `NotificationTemplate`, `NotificationPreference`: Multi-channel alerts
   - `SupportTicket`, `TicketMessage`: Customer & partner support ticketing
   - `Banner`, `CMSPage`: Dynamic marketing banners and rich policy pages
   - `AuditLog`: Security audit trails for all administrative actions

---

## 4. Security & Compliance Architecture
1. **Strict Server-Side Valuation**:
   - Client sends service IDs, addons, and coupon codes.
   - Backend queries database pricing, applies city rules, verifies coupon constraints, computes taxes, and generates the immutable order amount.
2. **Payment & Webhook Idempotency**:
   - Webhook endpoints verify cryptographic HMAC signatures (Razorpay).
   - Duplicate webhook delivery is handled idempotently via unique transaction references and database transactions.
3. **Defense in Depth**:
   - Argon2id password hashing with custom salt.
   - Helmet HTTP security headers, CORS origin whitelisting, and DTO validation with strict whitelist stripping (`class-validator` / `zod`).
   - Rate limiting via NestJS Throttler on sensitive routes (auth, OTP, checkout, payment).
   - Role-based route guards verifying claims and live database user status.

---

## 5. Hostinger Node.js Deployment Workflow
1. **Build Step**:
   - Unified workspace build: compile packages (`types`, `validation`, `config`), build NestJS API (`dist/`), and build Next.js Web (`.next/`).
2. **Process Management**:
   - Hostinger Node.js app runner configured to execute the entrypoint (`apps/api/dist/main.js` and `apps/web` via custom server or Next.js runner).
3. **Environment Isolation**:
   - Single source of truth environment configuration via `.env` loaded securely by NestJS ConfigModule.

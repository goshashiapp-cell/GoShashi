# GoShashi — On-demand Services Marketplace Platform

GoShashi is an enterprise-grade on-demand services marketplace connecting homeowners and businesses with verified, skilled service professionals.

## Tech Stack
- **Frontend**: Next.js 15+ (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, React Hook Form, Zod, TanStack Query
- **Backend**: Node.js, TypeScript, NestJS, REST API v1, Prisma ORM, MySQL 8+
- **Security**: Argon2id password hashing, JWT + Refresh tokens, RBAC, Helmet, rate-limiting, audit logs
- **Payments**: Razorpay provider abstraction (with webhook HMAC verification)
- **Deployment**: 100% Hostinger Node.js hosting compatible

## Repository Structure
```
goshashi/
├── apps/
│   ├── web/            # Next.js App Router frontend (Customer, /partner, /admin)
│   └── api/            # NestJS backend API
├── packages/
│   ├── types/          # Shared domain types, DTO contracts, enums
│   ├── validation/     # Shared Zod validation schemas
│   └── config/         # Shared business constants & rules
├── prisma/
│   ├── schema.prisma   # Normalized MySQL schema (40+ models)
│   └── seed.ts         # Realistic seed dataset
└── docs/               # PRD, Architecture, Deployment, Testing documentation
```

## Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Generate Prisma Client
npm run db:generate

# 4. Run database migrations
npm run db:migrate

# 5. Seed database with realistic initial data
npm run db:seed

# 6. Run development servers
npm run dev
```

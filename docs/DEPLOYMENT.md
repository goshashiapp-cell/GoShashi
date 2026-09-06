# GoShashi — Hostinger Deployment Guide

This guide outlines how to deploy the GoShashi monorepo to Hostinger Node.js Hosting and Hostinger MySQL.

## 1. Prerequisites on Hostinger
1. **Hostinger Cloud or Web Hosting Plan** with Node.js support (Node.js 22 LTS enabled).
2. **Hostinger MySQL Database**:
   - Create database: `u123456789_goshashi`
   - Create database user: `u123456789_admin` with a strong password.
   - Note down Hostinger MySQL host (usually `localhost` or `127.0.0.1`).
3. **GitHub Repository**:
   - Repository connected to Hostinger via Git Deploy or Webhooks.

---

## 2. Directory Structure on Hostinger
```
public_html/
├── .env                    # Hostinger production secrets
├── package.json            # Root monorepo package.json
├── apps/
│   ├── api/dist/           # Built NestJS server
│   └── web/.next/          # Built Next.js application
└── prisma/
    └── schema.prisma       # Prisma schema for migrations
```

---

## 3. Node.js Application Configuration in hPanel
1. Navigate to **hPanel -> Advanced -> Node.js**.
2. Click **Create Application**:
   - **Node.js Version**: `22.x`
   - **Application Mode**: `Production`
   - **Application Root**: `/home/u123456789/domains/goshashi.com/public_html`
   - **Application URL**: `api.goshashi.com` or `web.goshashi.com`
   - **Application Startup File**:
     - For API: `apps/api/dist/main.js`
     - For Web: `node_modules/next/dist/bin/next` with argument `start` (or custom server wrapper)
3. Set **Environment Variables** in hPanel:
   - `NODE_ENV=production`
   - `PORT=3000` (or assigned port)
   - `DATABASE_URL="mysql://u123456789_admin:STRONG_PASSWORD@localhost:3306/u123456789_goshashi"`
   - `JWT_SECRET=...`
   - `JWT_REFRESH_SECRET=...`
   - `RAZORPAY_KEY_ID=...`
   - `RAZORPAY_KEY_SECRET=...`
   - `RAZORPAY_WEBHOOK_SECRET=...`

---

## 4. Build & Deployment Commands
In Hostinger SSH console or via deployment script:
```bash
# 1. Install dependencies
npm ci

# 2. Generate Prisma client & apply migrations
npm run db:generate
npx prisma migrate deploy

# 3. Seed production initial categories (first time only)
npm run db:seed

# 4. Build all packages and applications
npm run build

# 5. Restart Node.js application from hPanel
```

---

## 5. Verification & Health Check
After starting the application, verify:
1. `GET https://api.goshashi.com/api/v1/health`
   - Expected response: `{ "status": "ok" }`
2. `GET https://api.goshashi.com/api/v1/health/database`
   - Expected response: `{ "status": "ok", "database": "connected" }`
3. Visit `https://web.goshashi.com` to verify customer storefront.

# GoShashi — Database Architecture & Migrations

Database Engine: **MySQL 8.0+**
ORM: **Prisma ORM**

## 1. Relational Design Highlights
- **Normalized Data Model**: Eliminates data anomalies while maintaining strict relational foreign key constraints.
- **Financial Immutability**: `Order`, `OrderItem`, `Payment`, `PaymentTransaction`, `Refund`, and `Invoice` records are strictly non-destructible. No cascading deletes are permitted on financial tables.
- **Audit Trails**: `OrderStatusHistory` tracks every state transition (`PENDING_PAYMENT` -> `CONFIRMED` -> `COMPLETED`, etc.) with `changedBy` and timestamp. `AuditLog` captures sensitive administrative actions.
- **Multi-City Architecture**: `City` and `CityPricingRule` enable dynamic pricing adjustments per municipality without requiring schema changes.

## 2. Migration Workflow
```bash
# Development: Create and apply local migration
npm run db:migrate

# Production (Hostinger): Apply pending migrations safely
npx prisma migrate deploy

# Introspect or inspect database visually
npm run db:studio
```

## 3. Indexes & Query Performance
- Indexed fields on high-throughput lookup tables:
  - `User(email)`, `User(mobile)`, `User(status)`
  - `Partner(kycStatus)`, `Partner(city)`, `Partner(rating)`
  - `Service(categoryId)`, `Service(slug)`, `Service(featured)`, `Service(status)`
  - `Order(customerId)`, `Order(partnerId)`, `Order(status)`, `Order(scheduledDate)`
  - `Payment(gatewayOrderId)`, `Payment(gatewayPaymentId)`, `Payment(status)`

# GoShashi — Testing Strategy & QA Guidelines

## 1. Test Pyramid
- **Unit Tests**:
  - Pricing and invoice calculations.
  - Coupon application rules and boundary limits.
  - Commission engine calculations.
  - Partner matching scoring formula.
- **Integration Tests**:
  - Auth workflows (Register, Login, Token Refresh, OTP).
  - Cart operations and order creation state machine.
  - Payment webhook signature verification and idempotency.
- **End-to-End (E2E) Tests**:
  - Customer booking flow from service search to checkout.
  - Partner acceptance, status progression, and completion.
  - Admin catalog creation, KYC approval, and order monitoring.

## 2. Test Execution
```bash
# Run unit tests across workspaces
npm test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

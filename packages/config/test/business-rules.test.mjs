import { test, describe } from 'node:test';
import assert from 'node:assert';
import { BUSINESS_CONFIG } from '../dist/index.js';

describe('GoShashi Business Logic & Pricing Engine', () => {
  test('partner matching weights sum to 100%', () => {
    const weights = BUSINESS_CONFIG.PARTNER_MATCHING_WEIGHTS;
    const sum =
      weights.SKILL +
      weights.DISTANCE +
      weights.RATING +
      weights.AVAILABILITY +
      weights.COMPLETION_RATE;

    assert.strictEqual(sum, 100);
    assert.strictEqual(weights.SKILL, 30);
    assert.strictEqual(weights.DISTANCE, 25);
    assert.strictEqual(weights.RATING, 20);
    assert.strictEqual(weights.AVAILABILITY, 15);
    assert.strictEqual(weights.COMPLETION_RATE, 10);
  });

  test('calculates GST and platform fees correctly', () => {
    const basePrice = 2799;
    const quantity = 1;
    const discount = 150;

    const subtotal = basePrice * quantity;
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxRate = BUSINESS_CONFIG.DEFAULT_TAX_RATE / 100;
    const tax = Number((taxableAmount * taxRate).toFixed(2));
    const platformFee = BUSINESS_CONFIG.DEFAULT_PLATFORM_FEE;
    const finalTotal = taxableAmount + tax + platformFee;

    assert.strictEqual(subtotal, 2799);
    assert.strictEqual(taxableAmount, 2649);
    assert.strictEqual(tax, 476.82);
    assert.strictEqual(platformFee, 49);
    assert.strictEqual(finalTotal, 3174.82);
  });

  test('enforces cancellation fee rules', () => {
    const rules = BUSINESS_CONFIG.CANCELLATION_RULES;
    assert.strictEqual(rules.FREE_CANCELLATION_HOURS_BEFORE, 2);
    assert.strictEqual(rules.LATE_CANCELLATION_FEE, 149);
    assert.strictEqual(rules.VISIT_FEE_AFTER_ARRIVAL, 199);
  });

  test('verifies partner earnings and 15% platform commission', () => {
    const finalTotal = 3174.82;
    const taxTotal = 476.82;
    const platformFee = 49;

    const grossServiceAmount = finalTotal - taxTotal - platformFee;
    assert.strictEqual(grossServiceAmount, 2649);

    const commissionRate = BUSINESS_CONFIG.DEFAULT_COMMISSION_PERCENTAGE;
    const platformCommission = (grossServiceAmount * commissionRate) / 100;
    const netPartnerEarnings = grossServiceAmount - platformCommission;

    assert.strictEqual(platformCommission, 397.35);
    assert.strictEqual(netPartnerEarnings, 2251.65);
  });
});

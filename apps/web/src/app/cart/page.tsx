'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
];

export default function CartPage() {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [scheduledDate, setScheduledDate] = useState('2026-09-08');
  const [scheduledTime, setScheduledTime] = useState(TIME_SLOTS[0]);
  const [addressType, setAddressType] = useState<'HOME' | 'OFFICE' | 'OTHER'>('HOME');
  const [addressText, setAddressText] = useState('Flat 1202, Tower 4, DLF Phase 5, Golf Course Road, Gurugram');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const basePrice = 2799;
  const subtotal = basePrice * quantity;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.18).toFixed(2));
  const platformFee = 49;
  const finalTotal = taxableAmount + tax + platformFee;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'SHASHI150') {
      setAppliedCoupon({ code: 'SHASHI150', discount: 150 });
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      const disc = Math.min(300, (subtotal * 20) / 100);
      setAppliedCoupon({ code: 'WELCOME20', discount: disc });
    } else {
      setCouponError('Invalid coupon code. Try SHASHI150');
    }
  };

  const handleProceedToCheckout = () => {
    const bookingDetails = {
      serviceName: 'Complete Deep Home Cleaning',
      quantity,
      scheduledDate,
      scheduledTime,
      address: {
        type: addressType,
        text: addressText,
        city: 'Gurugram',
      },
      couponCode: appliedCoupon?.code,
      pricing: {
        subtotal,
        discount,
        tax,
        platformFee,
        finalTotal,
      },
    };
    localStorage.setItem('gs_checkout_booking', JSON.stringify(bookingDetails));
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Service Cart & Schedule</h1>
        <p className="text-sm text-slate-500 mt-1">Review your booking, pick date & slot, and select service address.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 7 cols: Service items & Schedule */}
        <div className="lg:col-span-7 space-y-8">
          {/* Cart Item */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">1. Selected Service</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Home Cleaning</span>
                <h4 className="font-bold text-base text-slate-900 mt-0.5">Complete Deep Home Cleaning</h4>
                <p className="text-xs text-slate-500 mt-1">Single-disc floor buffing + bathroom descaling + kitchen degreasing</p>
                <span className="text-base font-black text-slate-900 block mt-2">₹{basePrice}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-slate-200 shadow-inner">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Picker */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              2. Select Service Date & Arrival Window
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min="2026-09-07"
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Arrival Slot</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setScheduledTime(slot)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                      scheduledTime === slot
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{slot}</span>
                    {scheduledTime === slot && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              3. Service Delivery Address
            </h3>

            <div className="flex gap-2">
              {(['HOME', 'OFFICE', 'OTHER'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAddressType(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    addressType === type
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <textarea
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-500 shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Right 5 cols: Coupon & Price Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              Apply Promotional Coupon
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter e.g. SHASHI150"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none focus:border-brand-500 shadow-inner"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-rose-600 font-semibold">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Coupon &apos;{appliedCoupon.code}&apos; applied! Saved ₹{appliedCoupon.discount}
              </p>
            )}
          </div>

          {/* Price Summary Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
            <h3 className="font-black text-lg text-slate-900">Price Breakdown</h3>

            <div className="space-y-3 text-xs text-slate-600 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Item Subtotal ({quantity}x)</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Government GST (18%)</span>
                <span className="font-semibold text-slate-900">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Safety & Platform Fee</span>
                <span className="font-semibold text-slate-900">₹{platformFee}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-base font-black text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-brand-600">₹{finalTotal}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-md shadow-brand-600/30 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Proceed to Payment <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Razorpay 256-bit encrypted checkout with satisfaction guarantee.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

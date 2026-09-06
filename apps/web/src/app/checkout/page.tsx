'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Banknote,
  QrCode,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'COD'>('RAZORPAY_UPI');
  const [processing, setProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gs_checkout_booking');
    if (saved) {
      try {
        setBooking(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const handlePay = () => {
    setProcessing(true);

    // Simulate verified gateway transaction
    setTimeout(() => {
      const orderId = 'GS-2026-' + Math.floor(10000 + Math.random() * 90000);
      setSuccessOrder(orderId);
      setProcessing(false);

      // Store in bookings history
      const existingBookings = JSON.parse(localStorage.getItem('gs_customer_bookings') || '[]');
      existingBookings.unshift({
        id: orderId,
        serviceName: booking?.serviceName || 'Complete Deep Home Cleaning',
        date: booking?.scheduledDate || '2026-09-08',
        time: booking?.scheduledTime || '09:00 AM - 11:00 AM',
        status: 'CONFIRMED',
        amount: booking?.pricing?.finalTotal || 3200,
        address: booking?.address?.text || 'Sector 54, Gurugram',
        partner: {
          name: 'Rajesh Sharma',
          rating: 4.9,
          mobile: '+91 98999 88877',
        },
      });
      localStorage.setItem('gs_customer_bookings', JSON.stringify(existingBookings));
    }, 1500);
  };

  if (successOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Booking & Payment Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Service Booked Successfully!
          </h1>
          <p className="text-sm text-slate-600">
            Booking Reference ID: <span className="font-mono font-bold text-slate-900">{successOrder}</span>
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 text-left space-y-3 shadow-sm text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Service</span>
            <span className="font-bold text-slate-900">{booking?.serviceName || 'Deep Home Cleaning'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Scheduled Window</span>
            <span className="font-bold text-slate-900">{booking?.scheduledDate} ({booking?.scheduledTime})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Service Location</span>
            <span className="font-bold text-slate-900 truncate max-w-xs">{booking?.address?.text}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-black text-slate-900 text-sm">₹{booking?.pricing?.finalTotal}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/bookings"
            className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
          >
            Track Booking Status
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Secure Payment & Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">Select payment method to lock your professional service slot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Payment Methods */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Choose Payment Method</h3>

            <div className="space-y-3">
              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'RAZORPAY_UPI'
                    ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">UPI Instant Pay</h4>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                {paymentMethod === 'RAZORPAY_UPI' && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </div>

              {/* Cards */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'RAZORPAY_CARD'
                    ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Credit / Debit Card / Net Banking</h4>
                    <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
                {paymentMethod === 'RAZORPAY_CARD' && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </div>

              {/* COD */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pay After Service</h4>
                    <p className="text-[11px] text-slate-500">Pay cash or UPI directly to partner upon completion</p>
                  </div>
                </div>
                {paymentMethod === 'COD' && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Pay Button */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
            <h3 className="font-black text-base text-slate-900">Booking Summary</h3>

            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex justify-between">
                <span>Total Payable</span>
                <span className="text-lg font-black text-slate-900">₹{booking?.pricing?.finalTotal || 3200}</span>
              </div>
              <p className="text-[11px] text-slate-400">Date: {booking?.scheduledDate || '2026-09-08'}</p>
              <p className="text-[11px] text-slate-400">Slot: {booking?.scheduledTime || '09:00 AM - 11:00 AM'}</p>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <span>Confirming Transaction...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay & Confirm Booking
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Razorpay certified PCI-DSS Level 1 payment gateway.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

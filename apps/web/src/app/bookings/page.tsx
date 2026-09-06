'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  FileText,
  AlertCircle,
  XCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface BookingRecord {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  amount: number;
  address: string;
  partner?: {
    name: string;
    rating: number;
    mobile: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gs_customer_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBookings(parsed);
        if (parsed.length > 0) {
          setSelectedBooking(parsed[0]);
        }
      } catch {
        // ignore
      }
    } else {
      // Default demo booking
      const defaultDemo: BookingRecord = {
        id: 'GS-2026-10492',
        serviceName: 'Complete Deep Home Cleaning',
        date: '2026-09-08',
        time: '09:00 AM - 11:00 AM',
        status: 'ASSIGNED',
        amount: 3200,
        address: 'Tower 4, Flat 1202, DLF Phase 5, Golf Course Road, Gurugram',
        partner: {
          name: 'Rajesh Sharma',
          rating: 4.9,
          mobile: '+91 98999 88877',
        },
      };
      setBookings([defaultDemo]);
      setSelectedBooking(defaultDemo);
    }
  }, []);

  const handleStatusProgression = (newStatus: string) => {
    if (!selectedBooking) return;
    const updated = { ...selectedBooking, status: newStatus };
    setSelectedBooking(updated);
    const updatedList = bookings.map((b) => (b.id === updated.id ? updated : b));
    setBookings(updatedList);
    localStorage.setItem('gs_customer_bookings', JSON.stringify(updatedList));
  };

  const submitReview = () => {
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">Track partner arrival status, manage reservations, and download invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bookings List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active & Past Bookings</h3>
          {bookings.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBooking(b)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                selectedBooking?.id === b.id
                  ? 'border-brand-600 bg-white shadow-md ring-2 ring-brand-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">{b.id}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                  {b.status}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-slate-900">{b.serviceName}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" /> {b.date}
                  </span>
                  <span>•</span>
                  <span>{b.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Paid Amount</span>
                <span className="font-black text-slate-900 text-sm">₹{b.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Booking Detail & Timeline (7 cols) */}
        {selectedBooking && (
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Booking Details</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">{selectedBooking.serviceName}</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">ID: {selectedBooking.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Paid</span>
                  <span className="text-2xl font-black text-slate-900">₹{selectedBooking.amount}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Fulfillment Progression</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { label: 'Confirmed', status: 'CONFIRMED' },
                    { label: 'Assigned', status: 'ASSIGNED' },
                    { label: 'In Progress', status: 'IN_PROGRESS' },
                    { label: 'Completed', status: 'COMPLETED' },
                  ].map((step, idx) => {
                    const statusOrder = ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
                    const currentIndex = statusOrder.indexOf(selectedBooking.status);
                    const isDone = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-100 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-brand-200' : ''}`}
                        >
                          {idx + 1}
                        </div>
                        <span className={`text-[11px] font-bold mt-1.5 ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Partner Card */}
              {selectedBooking.partner && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-black text-lg flex items-center justify-center">
                      RS
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Assigned Professional</span>
                      <h4 className="font-extrabold text-sm text-slate-900">{selectedBooking.partner.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 inline mr-1" />
                          {selectedBooking.partner.rating}
                        </span>
                        <span>•</span>
                        <span>Background Verified Pro</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${selectedBooking.partner.mobile}`}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-600" />
                    <span>Call Partner</span>
                  </a>
                </div>
              )}

              {/* Service Address */}
              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Service Location:</span>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  {selectedBooking.address}
                </p>
              </div>

              {/* Progression Demo Simulator (for testing all states) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                <span className="font-bold text-amber-900 block">Interactive State Simulator (Testing Control):</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusProgression('CONFIRMED')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    Set Confirmed
                  </button>
                  <button
                    onClick={() => handleStatusProgression('ASSIGNED')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    Set Assigned
                  </button>
                  <button
                    onClick={() => handleStatusProgression('IN_PROGRESS')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    Set In-Progress
                  </button>
                  <button
                    onClick={() => handleStatusProgression('COMPLETED')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    Set Completed
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                {selectedBooking.status === 'COMPLETED' ? (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-4 h-4 fill-white" /> Rate & Review Partner
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusProgression('CANCELLED')}
                    className="flex-1 py-3 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Booking
                  </button>
                )}

                <button
                  onClick={() => alert(`Tax Invoice downloaded for order ${selectedBooking.id} (GSTIN: 06AABCG1234F1Z9)`)}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Tax Invoice PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-3xl bg-white p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-xl font-black text-slate-900">Rate Your Service Experience</h3>
              <p className="text-xs text-slate-500 mt-1">Your verified feedback helps maintain highest marketplace quality.</p>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 ${
                      reviewRating >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share details about the partner's punctuality, work quality, and behavior..."
              className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500 shadow-inner"
            />

            {reviewSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
                Review submitted successfully! Thank you.
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReview}
                  className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

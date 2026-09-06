'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  TrendingUp,
  Award,
  AlertCircle,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Camera,
  Check,
} from 'lucide-react';

export default function PartnerPortalPage() {
  const [activeTab, setActiveTab] = useState<'JOBS' | 'EARNINGS' | 'ONBOARDING'>('JOBS');
  const [isOnline, setIsOnline] = useState(true);

  // Demo Jobs State
  const [jobs, setJobs] = useState([
    {
      id: 'JOB-9482',
      serviceName: 'Complete Deep Home Cleaning',
      customerName: 'Shashi Kumar',
      address: 'Tower 4, Flat 1202, DLF Phase 5, Golf Course Road, Gurugram',
      date: 'Today, 2026-09-08',
      time: '09:00 AM - 11:00 AM',
      earnings: 2380, // After 15% platform commission
      status: 'ASSIGNED', // ASSIGNED -> ACCEPTED -> ARRIVED -> IN_PROGRESS -> COMPLETED
    },
    {
      id: 'JOB-9480',
      serviceName: 'Split AC Jet Foam Wash',
      customerName: 'Amit Verma',
      address: 'Villa 14, Nirvana Country, Sector 50, Gurugram',
      date: 'Yesterday',
      time: '02:00 PM',
      earnings: 424,
      status: 'COMPLETED',
    },
  ]);

  const handleJobAction = (jobId: string, nextStatus: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus } : j)),
    );
  };

  // Onboarding Form State
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    mobile: '',
    city: 'Gurugram',
    category: 'Home Cleaning',
    panNumber: '',
    bankAccount: '',
    ifsc: '',
  });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Partner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Rajesh Sharma</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> KYC Approved
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Sharma Home Solutions • Gurugram Hub • Rating: 4.9 ★</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
          <span className="text-xs font-bold text-slate-300">Duty Status:</span>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-500 text-slate-900'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-slate-900 animate-pulse' : 'bg-slate-500'}`} />
            {isOnline ? 'Online (Receiving Jobs)' : 'Offline'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('JOBS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'JOBS'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          Dispatched Jobs ({jobs.filter((j) => j.status !== 'COMPLETED').length})
        </button>

        <button
          onClick={() => setActiveTab('EARNINGS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'EARNINGS'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          Earnings & Payouts
        </button>

        <button
          onClick={() => setActiveTab('ONBOARDING')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'ONBOARDING'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          Register New Partner (KYC)
        </button>
      </div>

      {/* TAB 1: JOBS FLOW */}
      {activeTab === 'JOBS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">{job.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      job.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : job.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{job.serviceName}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      {job.date} • {job.time}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <p className="font-bold text-slate-800">Customer: {job.customerName}</p>
                    <p className="text-slate-500 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                      {job.address}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Estimated Net Payout:</span>
                    <span className="text-base font-black text-emerald-600">₹{job.earnings}</span>
                  </div>

                  {/* Progressive action buttons */}
                  {job.status === 'ASSIGNED' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleJobAction(job.id, 'ACCEPTED')}
                        className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        Accept Job
                      </button>
                      <button
                        onClick={() => handleJobAction(job.id, 'REJECTED')}
                        className="px-4 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {job.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleJobAction(job.id, 'ARRIVED')}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Mark Arrived at Location
                    </button>
                  )}

                  {job.status === 'ARRIVED' && (
                    <button
                      onClick={() => handleJobAction(job.id, 'IN_PROGRESS')}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Start Service
                    </button>
                  )}

                  {job.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleJobAction(job.id, 'COMPLETED')}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Upload Verification & Complete Job
                    </button>
                  )}

                  {job.status === 'COMPLETED' && (
                    <p className="text-xs text-emerald-600 font-bold text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Service Completed & Earnings Credited
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EARNINGS LEDGER */}
      {activeTab === 'EARNINGS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Bookings</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹14,800</h3>
              <p className="text-[11px] text-slate-400 mt-1">Past 30 days total</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Commission (15%)</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹2,220</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">Standard partner tier</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Earned</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">₹12,580</h3>
              <p className="text-[11px] text-slate-400 mt-1">Direct partner profit</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Withdrawable Balance</span>
              <h3 className="text-2xl font-black text-brand-600 mt-1">₹3,450</h3>
              <button
                onClick={() => alert('Payout request for ₹3,450 submitted to bank account ending in 4102')}
                className="mt-2 w-full py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs"
              >
                Request Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PARTNER ONBOARDING FORM */}
      {activeTab === 'ONBOARDING' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Partner KYC & Registration</h3>
            <p className="text-xs text-slate-500 mt-1">Join the GoShashi professional network with verified documents.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
              <h4 className="font-bold text-base">KYC Application Submitted</h4>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">Our Gurugram operations team will review your PAN and bank credentials within 24 hours.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.name}
                    onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                    placeholder="As per PAN card"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={onboardForm.mobile}
                    onChange={(e) => setOnboardForm({ ...onboardForm, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Service Category</label>
                  <select
                    value={onboardForm.category}
                    onChange={(e) => setOnboardForm({ ...onboardForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
                  >
                    <option>Home Cleaning</option>
                    <option>Appliance Repair</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Carpentry</option>
                    <option>Painting</option>
                    <option>Pest Control</option>
                    <option>Photography</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.panNumber}
                    onChange={(e) => setOnboardForm({ ...onboardForm, panNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Bank Account Number</label>
                  <input
                    type="password"
                    required
                    value={onboardForm.bankAccount}
                    onChange={(e) => setOnboardForm({ ...onboardForm, bankAccount: e.target.value })}
                    placeholder="Account number"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.ifsc}
                    onChange={(e) => setOnboardForm({ ...onboardForm, ifsc: e.target.value.toUpperCase() })}
                    placeholder="e.g. HDFC0000123"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all mt-4"
              >
                Submit Partner Registration for Verification
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

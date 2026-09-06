'use client';

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Check,
  X,
  TrendingUp,
  Tag,
  Settings,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'PARTNERS' | 'ORDERS' | 'COUPONS'>('METRICS');

  // KYC Review Queue State
  const [partnerQueue, setPartnerQueue] = useState([
    {
      id: 'PTR-501',
      name: 'Vikas Kumar',
      category: 'Plumbing',
      city: 'Gurugram',
      pan: 'ABCDE1234F',
      status: 'PENDING',
      submittedDate: 'Today, 10:15 AM',
    },
    {
      id: 'PTR-502',
      name: 'Sunil Yadav',
      category: 'Electrical',
      city: 'Gurugram',
      pan: 'WXYZP5678Q',
      status: 'PENDING',
      submittedDate: 'Today, 11:30 AM',
    },
    {
      id: 'PTR-480',
      name: 'Rajesh Sharma',
      category: 'Home Cleaning',
      city: 'Gurugram',
      pan: 'SHARJ9876R',
      status: 'APPROVED',
      submittedDate: 'Yesterday',
    },
  ]);

  const handleKycDecision = (partnerId: string, decision: 'APPROVED' | 'REJECTED') => {
    setPartnerQueue((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status: decision } : p)),
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketplace Operations</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
              Super Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Live metrics, partner verification queue, and order governance.</p>
        </div>

        <div className="flex gap-2">
          {(['METRICS', 'PARTNERS', 'ORDERS', 'COUPONS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'METRICS'
                ? 'Overview & KPIs'
                : tab === 'PARTNERS'
                ? `KYC Queue (${partnerQueue.filter((p) => p.status === 'PENDING').length})`
                : tab === 'ORDERS'
                ? 'Orders & Revenue'
                : 'Coupons'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'METRICS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total GMV (Gross)</span>
                <DollarSign className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-2">₹1,84,500</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this week
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Platform Cut</span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-black text-emerald-600 mt-2">₹27,675</h3>
              <p className="text-[11px] text-slate-400 mt-1">15% commission + platform fees</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending KYC Approvals</span>
                <ShieldAlert className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-3xl font-black text-amber-600 mt-2">
                {partnerQueue.filter((p) => p.status === 'PENDING').length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Requires immediate ops review</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Verified Pros</span>
                <Briefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-2">48</h3>
              <p className="text-[11px] text-slate-400 mt-1">Across 8 categories in Gurugram</p>
            </div>
          </div>

          {/* Quick actions & category distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">City Performance</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Gurugram (DLF Phase 1-5, Golf Course Rd)</span>
                  <span className="font-mono font-bold text-emerald-600">68% bookings</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Sohna Road & Sector 47-50</span>
                  <span className="font-mono font-bold text-emerald-600">22% bookings</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold text-slate-800">New Gurugram (Sector 82-90)</span>
                  <span className="font-mono font-bold text-emerald-600">10% bookings</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">Top In-Demand Categories</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Home Deep Cleaning</span>
                  <span className="font-bold text-slate-900">₹78,400</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full w-[45%]" />
                </div>

                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Appliance & AC Repair</span>
                  <span className="font-bold text-slate-900">₹52,200</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[30%]" />
                </div>

                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Plumbing & Electrical</span>
                  <span className="font-bold text-slate-900">₹36,100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KYC QUEUE */}
      {activeTab === 'PARTNERS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900">Partner KYC Verification Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Approve government identification and bank records before partners receive live bookings.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Partner ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">PAN Number</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partnerQueue.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-4 font-mono font-bold text-slate-500">{p.id}</td>
                    <td className="py-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-4 text-slate-600">{p.category}</td>
                    <td className="py-4 font-mono text-slate-600">{p.pan}</td>
                    <td className="py-4 text-slate-400">{p.submittedDate}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {p.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleKycDecision(p.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleKycDecision(p.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-1 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Action Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Recent Marketplace Bookings</h3>
          <div className="space-y-3">
            {[
              { id: 'GS-2026-10492', service: 'Complete Deep Home Cleaning', customer: 'Shashi Kumar', partner: 'Rajesh Sharma', amount: 3200, status: 'CONFIRMED' },
              { id: 'GS-2026-10491', service: 'Split AC Power Jet Deep Service', customer: 'Amit Verma', partner: 'Rajesh Sharma', amount: 538, status: 'COMPLETED' },
              { id: 'GS-2026-10490', service: 'Water Leakage & Pipe Joint Repair', customer: 'Pooja Gupta', partner: 'Auto-Dispatching', amount: 399, status: 'SEARCHING_PARTNER' },
            ].map((o) => (
              <div key={o.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-400">{o.id}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{o.service}</h4>
                  <p className="text-slate-500 mt-0.5">Customer: {o.customer} • Partner: {o.partner}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-black text-slate-900 text-sm block">₹{o.amount}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeTab === 'COUPONS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900">Active Promotional Coupons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-black text-slate-900">SHASHI150</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
              </div>
              <p className="text-slate-600">Flat ₹150 OFF on orders above ₹499. First-time booking promotion.</p>
              <span className="text-[11px] text-slate-400 block">Valid until Dec 31, 2026</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-black text-slate-900">WELCOME20</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
              </div>
              <p className="text-slate-600">20% discount up to ₹300 on orders above ₹799.</p>
              <span className="text-[11px] text-slate-400 block">Valid until Dec 31, 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

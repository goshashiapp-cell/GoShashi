'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Tv,
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  ShieldAlert,
  Camera,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  BadgePercent,
  HelpCircle,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Home Cleaning', slug: 'home-cleaning', icon: Sparkles, color: 'from-blue-500 to-sky-400', count: '12+ Services' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: Tv, color: 'from-amber-500 to-orange-400', count: '18+ Services' },
  { name: 'Plumbing', slug: 'plumbing', icon: Wrench, color: 'from-cyan-500 to-blue-500', count: '15+ Services' },
  { name: 'Electrical', slug: 'electrical', icon: Zap, color: 'from-yellow-500 to-amber-500', count: '20+ Services' },
  { name: 'Carpentry', slug: 'carpentry', icon: Hammer, color: 'from-emerald-500 to-teal-500', count: '10+ Services' },
  { name: 'Painting', slug: 'painting', icon: Paintbrush, color: 'from-violet-500 to-purple-400', count: '8+ Services' },
  { name: 'Pest Control', slug: 'pest-control', icon: ShieldAlert, color: 'from-rose-500 to-pink-500', count: '6+ Services' },
  { name: 'Photography', slug: 'photography', icon: Camera, color: 'from-indigo-500 to-blue-500', count: '5+ Services' },
];

const POPULAR_SERVICES = [
  {
    name: 'Complete Deep Home Cleaning',
    slug: 'complete-deep-home-cleaning',
    category: 'Home Cleaning',
    categorySlug: 'home-cleaning',
    price: 2799,
    originalPrice: 3499,
    rating: 4.9,
    reviews: 320,
    duration: '240 mins',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    tag: 'Bestseller',
  },
  {
    name: 'Split AC Power Jet Deep Service',
    slug: 'split-ac-power-jet-service',
    category: 'Appliance Repair',
    categorySlug: 'appliance-repair',
    price: 499,
    originalPrice: 699,
    rating: 4.85,
    reviews: 412,
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    tag: 'Trending',
  },
  {
    name: 'Water Leakage & Pipe Joint Repair',
    slug: 'water-leakage-pipe-repair',
    category: 'Plumbing',
    categorySlug: 'plumbing',
    price: 299,
    originalPrice: 399,
    rating: 4.88,
    reviews: 185,
    duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80',
    tag: 'Quick 60m Dispatch',
  },
  {
    name: 'Electrical Short Circuit & MCB Diagnostic',
    slug: 'short-circuit-mcb-repair',
    category: 'Electrical',
    categorySlug: 'electrical',
    price: 399,
    originalPrice: 499,
    rating: 4.92,
    reviews: 219,
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    tag: 'Emergency',
  },
];

const FAQS = [
  {
    q: 'How are GoShashi service professionals verified?',
    a: 'Every partner on GoShashi undergoes strict background checks, including official government identity verification (Aadhaar & PAN) and practical trade skill assessments before ever visiting a client home.',
  },
  {
    q: 'What is the GoShashi 30-Day Service Warranty?',
    a: 'If you encounter any issues related to the service provided within 30 days, we will dispatch a senior partner for a free rework with zero inspection or visit fees.',
  },
  {
    q: 'Can I reschedule or cancel my booking?',
    a: 'Yes, you can easily reschedule or cancel your service directly from your Bookings dashboard. Cancellation is completely free up to 2 hours before the scheduled time slot.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), credit/debit cards, Net Banking via Razorpay, as well as Cash / Pay after Service options where applicable.',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-slate-50 pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Gurugram’s #1 Home Care Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Your Personal Home Care{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-sky-500">
                  Supercharged.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Book background-verified electricians, plumbers, deep cleaners, and appliance technicians. Transparent pricing, 60-minute dispatch, and guaranteed satisfaction.
              </p>

              {/* Search Box */}
              <div className="max-w-xl mx-auto lg:mx-0 p-2 rounded-2xl bg-white shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 w-full px-3 py-2">
                  <Search className="w-5 h-5 text-brand-600 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search e.g. 'AC repair', 'Deep cleaning'..."
                    className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                <Link
                  href={`/services${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm text-center shadow-md shadow-brand-600/30 transition-all shrink-0"
                >
                  Find Service
                </Link>
              </div>

              {/* Quick stats / trust chips */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  4.85/5 Customer Rating
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  100% KYC Verified Pros
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  30-Day Service Warranty
                </span>
              </div>
            </div>

            {/* Right Interactive Hero Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl p-6 bg-gradient-to-tr from-brand-900 to-slate-900 text-white shadow-2xl border border-slate-700 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                      Instant Booking
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">Popular Today in Gurugram</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Partners Online
                  </span>
                </div>

                <div className="space-y-4 my-6">
                  {POPULAR_SERVICES.slice(0, 3).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/services/${item.categorySlug}/${item.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-1">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="flex items-center text-amber-400 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                              {item.rating}
                            </span>
                            <span>•</span>
                            <span className="text-slate-300 font-bold">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </Link>
                  ))}
                </div>

                <Link
                  href="/services"
                  className="w-full block py-3 rounded-xl bg-gradient-to-r from-brand-500 to-sky-400 text-center text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity"
                >
                  Explore All 35+ Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONAL BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-blue-900 to-brand-800 text-white shadow-lg flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                <BadgePercent className="w-3.5 h-3.5 text-amber-300" /> Flat ₹150 OFF
              </span>
              <h3 className="text-2xl font-black text-white">First-Time Booking Deal</h3>
              <p className="text-xs text-blue-100 mt-1 max-w-sm">Use coupon code <span className="font-mono font-bold text-amber-300">SHASHI150</span> at checkout for instant savings.</p>
            </div>
            <div className="mt-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-900 font-bold text-xs hover:bg-blue-50 transition-colors shadow"
              >
                Claim Discount <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                <Tv className="w-3.5 h-3.5 text-sky-400" /> Seasonal Special
              </span>
              <h3 className="text-2xl font-black text-white">Split AC 2X Cooling Jet Wash</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">Includes high-pressure foam sanitization and gas pressure check starting at just ₹499.</p>
            </div>
            <div className="mt-4">
              <Link
                href="/services/appliance-repair/split-ac-power-jet-service"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-400 transition-colors shadow"
              >
                Book AC Wash <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Browse Catalog</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular Service Categories
            </h2>
          </div>
          <Link
            href="/services"
            className="mt-2 sm:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View all categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/services?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/10 transition-all text-center flex flex-col items-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. POPULAR SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Customer Favorites</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Top Rated Services
            </h2>
          </div>
          <Link
            href="/services"
            className="mt-2 sm:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Explore all services <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_SERVICES.map((s) => (
            <div
              key={s.slug}
              className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase">
                    {s.tag}
                  </span>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {s.rating}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider">
                    {s.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                    {s.name}
                  </h3>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {s.duration}
                    </span>
                    <span>•</span>
                    <span>{s.reviews} ratings</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through mr-1.5">₹{s.originalPrice}</span>
                  <span className="text-xl font-black text-slate-900">₹{s.price}</span>
                </div>
                <Link
                  href={`/services/${s.categorySlug}/${s.slug}`}
                  className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-bold text-xs transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW GOSHASHI WORKS */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Seamless 3-Step Experience</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              How GoShashi Works
            </h2>
            <p className="text-slate-400 text-sm mt-3">From booking to completion in just a few taps on your mobile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 relative">
              <span className="w-10 h-10 rounded-xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-6">1</span>
              <h3 className="text-xl font-bold text-white mb-2">Select Service & Slot</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose your required home service, select your preferred date and convenient 2-hour window. Upfront transparent pricing with no hidden charges.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 relative">
              <span className="w-10 h-10 rounded-xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-6">2</span>
              <h3 className="text-xl font-bold text-white mb-2">Verified Partner Dispatched</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our smart partner matching algorithm assigns a background-verified expert closest to your Gurugram location. Track their real-time arrival status.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 relative">
              <span className="w-10 h-10 rounded-xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-6">3</span>
              <h3 className="text-xl font-bold text-white mb-2">Relax with 30-Day Warranty</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Service is completed with before/after photos and digital tax invoice. Covered under our 30-day rework warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BECOME A PARTNER PROMOTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Earn with Dignity & Flexibility
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Are You a Skilled Professional?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Join GoShashi&apos;s network of verified service partners in Gurugram. Get direct bookings, instant automated payouts, and keep up to 85% of your earnings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/partner"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-900 font-extrabold text-sm text-center shadow-lg hover:opacity-95 transition-opacity"
            >
              Register as Partner
            </Link>
            <Link
              href="/partner"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-white/20 transition-colors"
            >
              Partner Login
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Got Questions?</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-brand-600 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-mono text-xl">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

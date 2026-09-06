import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Verified Professionals</h4>
              <p className="text-xs text-slate-400 mt-0.5">Strict Aadhaar & PAN KYC verification on every partner.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">30-Day Service Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free rework if you are not 100% satisfied with service quality.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">On-Time Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Punctual arrival at your selected slot in Gurugram.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
                GS
              </div>
              <span className="text-xl font-black text-white">GoShashi</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your personal home care supercharged. Booking skilled and trusted local professionals has never been simpler.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> Sector 54, Golf Course Road, Gurugram
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> care@goshashi.com
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Services</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services/home-cleaning" className="hover:text-white transition-colors">Home Deep Cleaning</Link></li>
              <li><Link href="/services/appliance-repair" className="hover:text-white transition-colors">AC Jet Service</Link></li>
              <li><Link href="/services/plumbing" className="hover:text-white transition-colors">Water Leakage Repair</Link></li>
              <li><Link href="/services/electrical" className="hover:text-white transition-colors">Electrical MCB Diagnostic</Link></li>
              <li><Link href="/services/carpentry" className="hover:text-white transition-colors">Furniture Assembly</Link></li>
              <li><Link href="/services/pest-control" className="hover:text-white transition-colors">Cockroach & Pest Control</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company & Partners</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/partner" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">Become a Service Partner</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">Partner Portal</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Marketplace Operations</Link></li>
              <li><Link href="/bookings" className="hover:text-white transition-colors">Track Booking</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal & Policies</h3>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Cancellation & Refund Rules</span></li>
              <li><span className="hover:text-white cursor-pointer">Warranty Guidelines</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GoShashi Marketplace Technologies. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Crafted with precision for modern Indian homes.</p>
        </div>
      </div>
    </footer>
  );
}

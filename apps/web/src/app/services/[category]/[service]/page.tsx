'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Check,
  ShoppingCart,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const SERVICE_DATA = {
  name: 'Complete Deep Home Cleaning',
  category: 'Home Cleaning',
  categorySlug: 'home-cleaning',
  price: 2799,
  originalPrice: 3499,
  discountPercentage: 20,
  rating: 4.9,
  reviewCount: 320,
  duration: '240 mins (4 hours)',
  warranty: '30-Day GoShashi Quality Warranty',
  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  description:
    'Comprehensive top-to-bottom sanitization and deep scrubbing for your entire apartment or villa. Our certified team utilizes hospital-grade disinfectant chemicals, single-disc rotary floor scrubbers, and industrial vacuum units to restore pristine freshness to your living spaces.',
  included: [
    'Single-disc machine floor buffing and scrubbing for all tile/marble floors',
    'Heavy-duty tile grout descaling and hard water stain eradication in all bathrooms',
    'Kitchen degreasing of chimney filters, stove hob, backsplashes, and cabinet faces',
    'Balcony pressure water washing and drain unblocking',
    'Streak-free glass polishing for all windows, sliders, and mirrors',
    'Ceiling fan, exhaust fan, and switchboard wipe-down',
  ],
  excluded: [
    'Repainting wall patches or plastering',
    'Cleaning inside locked personal wardrobes without supervision',
    'Heavy exterior building façade rope cleaning',
  ],
  addons: [
    { id: 'ad-1', name: 'Sofa Deep Shampooing (3-Seater)', price: 699, duration: '+30 mins' },
    { id: 'ad-2', name: 'Balcony Jet Pressure Wash Add-on', price: 399, duration: '+20 mins' },
    { id: 'ad-3', name: 'Refrigerator Interior Steam Disinfection', price: 299, duration: '+20 mins' },
  ],
  faqs: [
    {
      q: 'Do I need to supply any cleaning equipment or chemicals?',
      a: 'No, GoShashi professionals arrive completely self-sufficient with industrial cleaning machines, steam guns, microfiber wipers, and certified Diversey eco-friendly chemicals.',
    },
    {
      q: 'How many cleaners will be dispatched?',
      a: 'Depending on your house size, a team of 2 to 3 uniformed and background-verified cleaning experts will be assigned.',
    },
    {
      q: 'What if I am not satisfied with the deep clean?',
      a: 'We offer a 100% satisfaction guarantee. We will send our quality supervisor for a complimentary inspection and re-clean within our warranty period.',
    },
  ],
};

export default function ServiceDetailPage() {
  const router = useRouter();
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = SERVICE_DATA.addons.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const calculatedTotal = SERVICE_DATA.price + addonsTotal;

  const handleAddToCart = () => {
    const cartItem = {
      serviceName: SERVICE_DATA.name,
      basePrice: SERVICE_DATA.price,
      selectedAddons: selectedAddons.map((id) =>
        SERVICE_DATA.addons.find((a) => a.id === id),
      ),
      totalPrice: calculatedTotal,
      quantity: 1,
    };
    localStorage.setItem('gs_cart_item', JSON.stringify(cartItem));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBookNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/services" className="hover:text-slate-900">Services</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900">{SERVICE_DATA.name}</span>
      </nav>

      {/* Main Grid: Gallery & Details on left, Pricing Sidebar on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-10">
          {/* Main Image Header */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 relative h-72 sm:h-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SERVICE_DATA.image}
              alt={SERVICE_DATA.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider w-max mb-2">
                {SERVICE_DATA.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {SERVICE_DATA.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-200 font-semibold">
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" />
                  {SERVICE_DATA.rating} ({SERVICE_DATA.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-300" />
                  {SERVICE_DATA.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  {SERVICE_DATA.warranty}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-900">Service Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {SERVICE_DATA.description}
            </p>
          </section>

          {/* What's Included & Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Included */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {SERVICE_DATA.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Excluded */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-rose-500" />
                What&apos;s Excluded
              </h3>
              <ul className="space-y-3">
                {SERVICE_DATA.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-500 leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Add-ons */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Customizable Add-ons</h3>
              <p className="text-xs text-slate-500 mt-0.5">Upgrade your service package with extra care options.</p>
            </div>

            <div className="space-y-3">
              {SERVICE_DATA.addons.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{addon.name}</h4>
                      <span className="text-[11px] text-slate-500">{addon.duration}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-900">+₹{addon.price}</span>
                      <button
                        type="button"
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {SERVICE_DATA.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 4 Cols: Sticky Pricing & Action Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                Save {SERVICE_DATA.discountPercentage}% Today
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">₹{calculatedTotal}</span>
                <span className="text-sm text-slate-400 line-through">₹{SERVICE_DATA.originalPrice}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Inclusive of all taxes & warranty</p>
            </div>

            {/* Selected Addon summary if any */}
            {selectedAddons.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">Selected Add-ons:</span>
                {selectedAddons.map((id) => {
                  const ad = SERVICE_DATA.addons.find((a) => a.id === id);
                  return (
                    <div key={id} className="flex justify-between text-slate-500">
                      <span>{ad?.name}</span>
                      <span className="font-semibold">+₹{ad?.price}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-md shadow-brand-600/30 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Now
              </button>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  addedToCart
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-risk cancellation up to 2 hrs before slot</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>30-Day GoShashi satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Standard 60-min partner arrival window</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

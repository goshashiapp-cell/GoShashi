'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Star, Clock, Sparkles, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'All Categories', slug: 'all' },
  { name: 'Home Cleaning', slug: 'home-cleaning' },
  { name: 'Appliance Repair', slug: 'appliance-repair' },
  { name: 'Plumbing', slug: 'plumbing' },
  { name: 'Electrical', slug: 'electrical' },
  { name: 'Carpentry', slug: 'carpentry' },
  { name: 'Painting', slug: 'painting' },
  { name: 'Pest Control', slug: 'pest-control' },
  { name: 'Photography', slug: 'photography' },
];

const ALL_SERVICES = [
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
    shortDesc: 'Comprehensive top-to-bottom sanitization and deep scrubbing for your entire home.',
  },
  {
    name: 'Intense Bathroom Descaling & Cleaning',
    slug: 'intense-bathroom-cleaning',
    category: 'Home Cleaning',
    categorySlug: 'home-cleaning',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 142,
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Spotless bathroom tiles, grout restoration, and hard water stain removal.',
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
    shortDesc: 'High-pressure foam wash for indoor and outdoor AC units with 2X cooling boost.',
  },
  {
    name: 'Washing Machine Repair & Diagnostic',
    slug: 'washing-machine-repair',
    category: 'Appliance Repair',
    categorySlug: 'appliance-repair',
    price: 349,
    originalPrice: 499,
    rating: 4.75,
    reviews: 98,
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Fix drum spin issues, drain errors, loud noise, and electronic PCB faults.',
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
    shortDesc: 'Fast solution for concealed pipeline drips, valve seepage, and joint leaks.',
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
    shortDesc: 'Emergency isolation of electrical leakage, tripping breakers, and neutral wire faults.',
  },
  {
    name: 'Furniture Assembly (Bed / Wardrobe)',
    slug: 'furniture-assembly',
    category: 'Carpentry',
    categorySlug: 'carpentry',
    price: 599,
    originalPrice: 799,
    rating: 4.84,
    reviews: 110,
    duration: '90 mins',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Professional assembly of flat-pack beds, tables, bookcases, and wardrobes.',
  },
  {
    name: 'Herbal Cockroach & Ant Control (Odorless Gel)',
    slug: 'herbal-cockroach-ant-control',
    category: 'Pest Control',
    categorySlug: 'pest-control',
    price: 699,
    originalPrice: 899,
    rating: 4.91,
    reviews: 164,
    duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Non-toxic, food-safe gel dots in cabinet hinges, drawers, and under-sink nooks.',
  },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category')!);
    }
  }, [searchParams]);

  const filteredServices = ALL_SERVICES.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.categorySlug === selectedCategory;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore All Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing verified professional services available in Gurugram
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-brand-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.slug
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No services found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search query or filter by a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s.slug}
              className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm flex items-center gap-1">
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
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {s.shortDesc}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {s.duration}
                    </span>
                    <span>•</span>
                    <span>{s.reviews} reviews</span>
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
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm font-semibold text-slate-500">
          Loading service catalog...
        </div>
      }
    >
      <ServicesContent />
    </React.Suspense>
  );
}

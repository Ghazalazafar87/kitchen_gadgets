import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, Play } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatPKR, STORE_CONFIG } from '../config';

interface HeroProps {
  onExploreClick: () => void;
  onWatchTutorials: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onWatchTutorials }) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Call-To-Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#2D5A46]">
              <span className="w-2 h-2 rounded-full bg-[#2D5A46]" />
              <span>Modern Pakistani Kitchens</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-500">Heirloom Quality & Smart Tech</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] text-balance">
              Everyday Cookware & Smart Culinary Gadgets Crafted for Passionate Cooks.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
              From heavy-gauge tri-ply kadai and pre-seasoned cast iron to gravity spice mills and wireless mini choppers. Delivered with Cash on Delivery nationwide.
            </p>

            {/* Proof Metric Adjacency */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-500 pt-1">
              <div className="flex items-center text-amber-500 font-semibold">
                ★★★★★ <span className="ml-1 text-stone-800 font-bold">4.9 / 5</span>
              </div>
              <span>·</span>
              <span>12,000+ Happy Desi Kitchens</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">100+ Cities Across Pakistan</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#2D5A46] text-white text-sm font-semibold hover:bg-[#244838] transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Browse Kitchen Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onWatchTutorials}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 text-sm font-semibold hover:bg-stone-100 hover:border-stone-400 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#2D5A46] fill-[#2D5A46]" />
                <span>See Gadgets in Action</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100 aspect-4/3 sm:aspect-16/10 lg:aspect-square">
              <SafeImage
                src="/src/assets/images/hero_kitchen_storefront_1792607832945.jpg"
                alt="Modern kitchen aesthetic with organized spices, cast iron pans, and cutting boards"
                fallbackText="Premium Kitchen Essentials"
                className="w-full h-full object-cover"
              />
              
              {/* Subtle floating feature badge inside container */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/80 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-stone-900">Seasoned Cast Iron & Tri-Ply</p>
                  <p className="text-[11px] text-stone-500">Heirloom durability with zero toxic coatings</p>
                </div>
                <span className="text-xs font-bold text-[#2D5A46] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/60 tabular-nums">
                  From {formatPKR(2450)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width 4-Column Trust Strip below hero */}
        <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#2D5A46] flex items-center justify-center shrink-0 border border-emerald-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Free Express Delivery</p>
              <p className="text-[11px] text-stone-500">Orders over {formatPKR(STORE_CONFIG.freeShippingThreshold)} anywhere in PK</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#2D5A46] flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Cash on Delivery</p>
              <p className="text-[11px] text-stone-500">Pay cash upon parcel inspection at door</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#2D5A46] flex items-center justify-center shrink-0 border border-emerald-100">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">7-Day Guarantee</p>
              <p className="text-[11px] text-stone-500">Hassle-free replacement for damages</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#2D5A46] flex items-center justify-center shrink-0 border border-emerald-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">100% Food-Grade Safe</p>
              <p className="text-[11px] text-stone-500">BPA-free & certified non-toxic materials</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

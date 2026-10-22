import React, { useState } from 'react';
import { STORE_CONFIG, formatPKR, PAKISTAN_CITIES } from '../config';
import { Phone, Mail, MapPin, Truck, ShieldCheck, Heart, Send, Check } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (categoryName: string) => void;
  onOpenOrders: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenOrders }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="why-khaalis" className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800">
          
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#2D5A46] text-white flex items-center justify-center font-bold text-base">
                K
              </span>
              <span className="font-serif font-bold text-xl text-white">Khaalis Kitchen</span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Pakistan's dedicated storefront for chef-grade cooking essentials, tri-ply cookware, and smart modern culinary gadgets. Crafted to elevate daily home cooking with zero compromise on food safety and build durability.
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2D5A46] shrink-0" />
                <span>Helpline / WhatsApp: <strong className="text-white">{STORE_CONFIG.rawPhone}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2D5A46] shrink-0" />
                <span>Email: <strong className="text-white">{STORE_CONFIG.email}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2D5A46] shrink-0" />
                <span>Central Distribution Hub: Lahore & Karachi, Pakistan</span>
              </p>
            </div>
          </div>

          {/* Department Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kitchen Departments
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Kitchen Appliances',
                'Cooking Essentials',
                'Modern Kitchen Gadgets',
                'Food Storage and Organization',
                'Kitchen Tools and Accessories',
                'Cleaning and Dishwashing',
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="text-stone-400 hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={onOpenOrders} className="hover:text-white transition-colors">
                  Track Demo Orders
                </button>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  Cash on Delivery Guide
                </a>
              </li>
              <li>
                <a href="#tutorials" className="hover:text-white transition-colors">
                  Video Tutorials
                </a>
              </li>
              <li>
                <span className="text-stone-400">{STORE_CONFIG.returnPolicyDays}-Day Replacement Policy</span>
              </li>
              <li>
                <span className="text-stone-400">Free Shipping over {formatPKR(STORE_CONFIG.freeShippingThreshold)}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Recipes (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Join Khaalis Culinary Circle
            </h4>
            <p className="text-xs text-stone-400">
              Receive secret weekend recipe guides, cookware seasoning tips, and exclusive discount codes directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:border-[#2D5A46]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-[#2D5A46] text-white text-xs font-semibold hover:bg-[#244838] transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Subscribed! Check your inbox for code KHAALIS10.</span>
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Nationwide City Delivery Tag Strip */}
        <div className="py-6 border-b border-stone-800 text-[11px] text-stone-500">
          <p className="mb-2 font-medium text-stone-400">Express Delivery Across Pakistan:</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {PAKISTAN_CITIES.slice(0, 15).map((city) => (
              <span key={city} className="hover:text-stone-300 transition-colors">
                {city}
              </span>
            ))}
            <span>and all surrounding districts nationwide.</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Khaalis Kitchen Essentials. All rights reserved.</p>
          <p className="flex items-center gap-1 text-stone-400">
            <span>Crafted for culinary enthusiasts across Pakistan</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

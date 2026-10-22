import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Phone, Truck, ShieldCheck } from 'lucide-react';
import { STORE_CONFIG, formatPKR } from '../config';

interface HeaderProps {
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onNavigateCategory: (categoryName: string) => void;
  onOpenOrders: () => void;
  activeCategory: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartSubtotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onNavigateCategory,
  onOpenOrders,
  activeCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Slim Dismissible Announcement Banner */}
      {showBanner && (
        <div className="bg-[#2D5A46] text-white text-xs py-2 px-4 flex items-center justify-between border-b border-[#244838]">
          <div className="flex-1 text-center font-medium flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Free Delivery over {formatPKR(STORE_CONFIG.freeShippingThreshold)}</span>
            </span>
            <span className="hidden sm:inline text-emerald-300/60">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Cash on Delivery Across Pakistan</span>
            </span>
            <span className="hidden md:inline text-emerald-300/60">·</span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>WhatsApp Helpline: 0312-6687237</span>
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-emerald-200 hover:text-white transition-colors p-0.5 ml-2"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a 
            href="#top" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2.5 text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-[#2D5A46] text-white flex items-center justify-center font-sans font-bold text-base shadow-sm">
              K
            </span>
            <span>Khaalis Kitchen</span>
          </a>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigateCategory('All')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 ${
              activeCategory === 'All' ? 'text-[#2D5A46] font-semibold' : ''
            }`}
          >
            Shop All
          </button>
          <a
            href="#categories"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-stone-900"
          >
            Categories
          </a>
          <a
            href="#tutorials"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-stone-900"
          >
            Gadgets in Action
          </a>
          <a
            href="#why-khaalis"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-stone-900"
          >
            Why Khaalis
          </a>
          <button
            onClick={onOpenOrders}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 text-stone-600"
          >
            Track Orders
          </button>
        </nav>

        {/* Zone 3: Primary Utility & Cart Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-2"
            aria-label="Search catalog"
            title="Search products"
          >
            <Search className="w-5 h-5" />
            <span className="hidden xl:inline text-xs text-stone-500 font-normal">Search tools...</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Wishlist"
            title="View wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-[#B85D38] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
            aria-label="Shopping cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4.5 h-4.5 bg-[#2D5A46] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">
              {cartCount > 0 ? (
                <span className="tabular-nums">{formatPKR(cartSubtotal)}</span>
              ) : (
                'Cart'
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-[#2D5A46] text-white flex items-center justify-center font-bold text-sm">
                  K
                </span>
                <span className="font-serif font-bold text-lg text-stone-900">Khaalis Kitchen</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Shop by Department
                </p>
                <div className="space-y-1">
                  {[
                    'All',
                    'Kitchen Appliances',
                    'Cooking Essentials',
                    'Modern Kitchen Gadgets',
                    'Food Storage and Organization',
                    'Kitchen Tools and Accessories',
                    'Cleaning and Dishwashing',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onNavigateCategory(cat);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat
                          ? 'bg-[#2D5A46] text-white font-semibold'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {cat === 'All' ? 'All Products' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Account & Support
                </p>
                <button
                  onClick={() => {
                    onOpenOrders();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-lg flex items-center justify-between"
                >
                  <span>My Demo Orders</span>
                  <span className="text-xs text-stone-400">View History</span>
                </button>
                <a
                  href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Assalam%20o%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20Khaalis%20Kitchen%20products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 text-sm text-[#2D5A46] font-medium hover:bg-emerald-50 rounded-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: {STORE_CONFIG.rawPhone}</span>
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50">
              <p className="text-xs text-stone-500 text-center">
                Cash on Delivery Available Across Pakistan
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

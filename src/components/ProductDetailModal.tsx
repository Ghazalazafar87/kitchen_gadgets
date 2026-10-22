import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatPKR, getWhatsAppUrl, STORE_CONFIG } from '../config';
import { SafeImage } from './SafeImage';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Check, 
  Share2, 
  MessageCircle, 
  Play, 
  Layers, 
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  relatedProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  relatedProducts,
  onSelectRelated,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'tutorial' | 'shipping'>('specs');
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setActiveTab(product?.tutorial ? 'tutorial' : 'specs');
  }, [product?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const savings = product.originalPricePKR ? product.originalPricePKR - product.pricePKR : 0;
  const savingsPercent = product.originalPricePKR 
    ? Math.round((savings / product.originalPricePKR) * 100) 
    : 0;

  // WhatsApp Order message
  const whatsappOrderMessage = `Assalam-o-Alaikum Khaalis Kitchen!
I would like to order:
*Product:* ${product.name}
*Price:* ${formatPKR(product.pricePKR)}
*Quantity:* ${quantity}
*Total:* ${formatPKR(product.pricePKR * quantity)}

Please confirm stock and delivery timeline.`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 z-10">
          
          {/* Header Close & Share Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/60">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-medium text-stone-900">{product.category}</span>
              <span>/</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors text-xs flex items-center gap-1.5"
                title="Copy product link"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Modal Body */}
          <div className="p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Gallery & Media */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-4/3 sm:aspect-square rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    fallbackText={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-colors ${
                      isWishlisted
                        ? 'bg-[#B85D38] text-white'
                        : 'bg-white/90 text-stone-700 hover:text-stone-900 hover:bg-white'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Tags strip */}
                <div className="flex items-center gap-2 flex-wrap">
                  {product.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quick Trust badges */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#2D5A46] shrink-0" />
                    <span>Free Shipping on orders above {formatPKR(STORE_CONFIG.freeShippingThreshold)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2D5A46] shrink-0" />
                    <span>{STORE_CONFIG.returnPolicyDays}-Day Damaged/Defect Replacement Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#2D5A46] shrink-0" />
                    <span>Live WhatsApp Support: {STORE_CONFIG.rawPhone}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Contiguous Purchase Module */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-stone-500">
                    <span className="font-semibold text-[#2D5A46]">{product.category}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-stone-800">{product.rating}</span>
                      <span className="text-stone-400 font-normal">({product.reviewCount} customer reviews)</span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug mb-3">
                    {product.name}
                  </h2>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-3 mb-4 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                    <span className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                      {formatPKR(product.pricePKR)}
                    </span>
                    {product.originalPricePKR && (
                      <>
                        <span className="text-sm text-stone-400 line-through tabular-nums">
                          {formatPKR(product.originalPricePKR)}
                        </span>
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Save {formatPKR(savings)} ({savingsPercent}% OFF)
                        </span>
                      </>
                    )}
                  </div>

                  {/* Availability badge */}
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-emerald-800">
                      {product.inStock ? 'Ready for Immediate Dispatch' : 'Out of Stock'}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">Cash on Delivery Available</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-stone-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Quantity and Actions */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold text-stone-700">Quantity:</label>
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-sm"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-4 py-1.5 text-sm font-semibold text-stone-900 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                          className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-stone-400">
                        ({product.stockCount} units available)
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => {
                          onAddToCart(product, quantity);
                        }}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-stone-800 text-stone-900 font-semibold text-sm hover:bg-stone-100 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => {
                          onBuyNow(product, quantity);
                        }}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#2D5A46] text-white font-semibold text-sm hover:bg-[#244838] transition-all shadow-sm cursor-pointer"
                      >
                        <span>Buy Now (COD)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* WhatsApp Fast Order Button */}
                    <a
                      href={getWhatsAppUrl(whatsappOrderMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order Directly on WhatsApp ({STORE_CONFIG.rawPhone})</span>
                    </a>
                  </div>
                </div>

                {/* Tabs: Specs vs Tutorial vs Shipping */}
                <div className="border-t border-stone-200 pt-4">
                  <div className="flex items-center gap-4 border-b border-stone-200 text-xs font-semibold pb-2">
                    {product.tutorial && (
                      <button
                        onClick={() => setActiveTab('tutorial')}
                        className={`pb-1 transition-colors flex items-center gap-1.5 ${
                          activeTab === 'tutorial'
                            ? 'text-[#2D5A46] border-b-2 border-[#2D5A46]'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>How-To Tutorial</span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`pb-1 transition-colors ${
                        activeTab === 'specs'
                          ? 'text-[#2D5A46] border-b-2 border-[#2D5A46]'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Specifications
                    </button>

                    <button
                      onClick={() => setActiveTab('shipping')}
                      className={`pb-1 transition-colors ${
                        activeTab === 'shipping'
                          ? 'text-[#2D5A46] border-b-2 border-[#2D5A46]'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Delivery & Warranty
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="pt-3 text-xs text-stone-600">
                    {activeTab === 'tutorial' && product.tutorial && (
                      <div className="space-y-4">
                        <InteractiveVideoPlayer
                          tutorial={product.tutorial}
                          productName={product.name}
                          posterImage={product.image}
                        />

                        <div className="bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200/60 space-y-1.5">
                          <p className="font-semibold text-emerald-900">Key Chef Recommendations:</p>
                          <ul className="list-disc pl-4 space-y-1 text-emerald-800">
                            {product.tutorial.quickTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {product.tutorial.steps && (
                          <div className="space-y-1.5 pt-1">
                            <p className="font-semibold text-stone-900">Step-by-Step Instructions:</p>
                            <ol className="list-decimal pl-4 space-y-1 text-stone-600">
                              {product.tutorial.steps.map((st, idx) => (
                                <li key={idx}>{st}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'specs' && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-1">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Material</span>
                          <span className="font-medium text-stone-800">{product.specifications.material}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Dimensions</span>
                          <span className="font-medium text-stone-800">{product.specifications.dimensions}</span>
                        </div>
                        {product.specifications.capacity && (
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase">Capacity</span>
                            <span className="font-medium text-stone-800">{product.specifications.capacity}</span>
                          </div>
                        )}
                        {product.specifications.powerWatts && (
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase">Power / Voltage</span>
                            <span className="font-medium text-stone-800">{product.specifications.powerWatts}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Warranty</span>
                          <span className="font-medium text-stone-800">{product.specifications.warranty}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Care Guide</span>
                          <span className="font-medium text-stone-800">{product.specifications.careInstructions}</span>
                        </div>
                      </div>
                    )}

                    {activeTab === 'shipping' && (
                      <div className="space-y-2 py-1">
                        <p><strong>Courier Partners:</strong> TCS, Trax, Leopard, Call Courier nationwide.</p>
                        <p><strong>Timeline:</strong> 2-3 working days in Lahore, Karachi, Islamabad/Rawalpindi. 3-5 days for other cities and rural areas.</p>
                        <p><strong>Cash on Delivery:</strong> Pay cash to rider upon delivery. Inspect outer packaging before payment.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Customers Also Frequently Bought
                  </h3>
                  <span className="text-xs text-stone-500">Related {product.category}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedProducts.slice(0, 4).map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="group p-2 rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer bg-stone-50/50"
                    >
                      <div className="aspect-square rounded-md overflow-hidden bg-white mb-2">
                        <SafeImage
                          src={rel.image}
                          alt={rel.name}
                          fallbackText={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-xs font-semibold text-stone-800 line-clamp-1 group-hover:text-[#2D5A46]">
                        {rel.name}
                      </p>
                      <p className="text-xs font-bold text-stone-900 tabular-nums mt-0.5">
                        {formatPKR(rel.pricePKR)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

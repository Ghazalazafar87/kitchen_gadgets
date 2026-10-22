import React, { useState } from 'react';
import { Product } from '../types';
import { formatPKR } from '../config';
import { SafeImage } from './SafeImage';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import { Play, CheckCircle2, Clock, Sparkles, ShoppingBag, X } from 'lucide-react';

interface TutorialsSectionProps {
  productsWithTutorials: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const TutorialsSection: React.FC<TutorialsSectionProps> = ({
  productsWithTutorials,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeVideoModal, setActiveVideoModal] = useState<Product | null>(null);

  if (productsWithTutorials.length === 0) return null;

  return (
    <section id="tutorials" className="py-12 sm:py-16 bg-[#F4F0EA] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#2D5A46] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Culinary Masterclasses & Gadget Demos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Modern Gadgets in Action
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Watch real demonstration videos, learn essential maintenance habits, and discover how our smart kitchen tools cut prep time in half.
            </p>
          </div>
        </div>

        {/* Video Tutorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsWithTutorials.slice(0, 6).map((product) => {
            const tutorial = product.tutorial!;
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Video Thumbnail with Play Overlay */}
                  <div 
                    onClick={() => setActiveVideoModal(product)}
                    className="relative aspect-16/9 bg-stone-900 overflow-hidden cursor-pointer group"
                  >
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      fallbackText={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/95 text-[#2D5A46] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-medium backdrop-blur-xs">
                      <Clock className="w-3 h-3" />
                      <span>{tutorial.duration}</span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 text-[11px] font-medium text-white/90 truncate max-w-[70%]">
                      {product.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                      {tutorial.title}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    {/* Quick Tips Box */}
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/70 text-xs space-y-1.5">
                      <p className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider">
                        Pro Chef Tips:
                      </p>
                      <ul className="space-y-1 text-stone-600">
                        {tutorial.quickTips.slice(0, 2).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A46] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-400">Featured Tool</span>
                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      {formatPKR(product.pricePKR)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-100 transition-colors"
                    >
                      View Specs
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="p-1.5 rounded-lg bg-[#2D5A46] text-white hover:bg-[#244838] transition-colors"
                      title="Add to cart"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideoModal && activeVideoModal.tutorial && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity" 
            onClick={() => setActiveVideoModal(null)} 
          />

          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h4 className="text-sm font-serif font-bold text-stone-900">
                  {activeVideoModal.tutorial.title}
                </h4>
                <p className="text-xs text-stone-500">{activeVideoModal.name}</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <InteractiveVideoPlayer
                tutorial={activeVideoModal.tutorial}
                productName={activeVideoModal.name}
                posterImage={activeVideoModal.image}
              />

              {/* Written usage instructions */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Step-by-Step Usage Instructions:
                </h5>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-stone-600">
                  {activeVideoModal.tutorial.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-semibold mb-1">Key Recommendation:</p>
                  <p>{activeVideoModal.tutorial.quickTips[0]}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400">Price in Pakistan</span>
                  <p className="text-base font-bold text-stone-900 tabular-nums">
                    {formatPKR(activeVideoModal.pricePKR)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(activeVideoModal);
                    setActiveVideoModal(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#2D5A46] text-white text-xs font-semibold hover:bg-[#244838] transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({formatPKR(activeVideoModal.pricePKR)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

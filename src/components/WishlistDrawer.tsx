import React from 'react';
import { Product } from '../types';
import { formatPKR } from '../config';
import { SafeImage } from './SafeImage';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onRemoveFromWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 border-l border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#B85D38] fill-current" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Your Saved Wishlist
              </h2>
              <span className="text-xs text-stone-500 font-medium tabular-nums">
                ({products.length} items)
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {products.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">Your wishlist is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Tap the heart icon on any product to save kitchen essentials for later.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-[#2D5A46] text-white text-xs font-semibold hover:bg-[#244838] transition-colors"
                >
                  Explore Essentials
                </button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3.5">
                  <div 
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 cursor-pointer"
                  >
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      fallbackText={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="text-xs font-semibold text-stone-900 line-clamp-1 cursor-pointer hover:text-[#2D5A46]"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 tabular-nums">
                        {formatPKR(product.pricePKR)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-700 font-medium">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D5A46] text-white text-xs font-medium hover:bg-[#244838] transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {products.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-stone-50">
              <button
                onClick={() => {
                  products.forEach((p) => onAddToCart(p));
                  onClose();
                }}
                className="w-full py-2.5 rounded-lg bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors"
              >
                Add All Saved Items to Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

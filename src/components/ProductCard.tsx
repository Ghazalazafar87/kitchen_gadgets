import React from 'react';
import { Product } from '../types';
import { formatPKR } from '../config';
import { SafeImage } from './SafeImage';
import { Heart, ShoppingBag, Star, Play, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isInCart: boolean;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onWatchTutorial?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  isInCart,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  onWatchTutorial,
}) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:border-stone-300 cursor-pointer"
    >
      {/* Visual Image Container (65-75% visual weight) */}
      <div className="relative w-full aspect-4/3 bg-stone-100 overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackText={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Subtle Text Tag (Anti-slop: max 1 quiet tag, not pill badge sandwich) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="text-[11px] font-semibold text-stone-900 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs border border-stone-200">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="text-[11px] font-semibold text-[#2D5A46] bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs border border-emerald-200">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button (Always accessible on touch and hover) */}
        <button
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-[#B85D38] text-white shadow-sm'
              : 'bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-white shadow-2xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
          />
        </button>

        {/* Video Tutorial Badge if applicable */}
        {product.tutorial && (
          <button
            onClick={(e) => {
              if (onWatchTutorial) {
                onWatchTutorial(product, e);
              } else {
                e.stopPropagation();
                onSelect(product);
              }
            }}
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-1 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium rounded hover:bg-stone-900 transition-colors z-10"
            title="Watch video tutorial"
          >
            <Play className="w-3 h-3 fill-current text-emerald-400" />
            <span>Watch Demo</span>
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-medium text-stone-400 truncate max-w-[65%]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 shrink-0 font-medium text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums text-xs">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 group-hover:text-[#2D5A46] transition-colors leading-snug mb-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-500 line-clamp-1 mb-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Price and Cart Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-stone-900 tabular-nums">
                {formatPKR(product.pricePKR)}
              </span>
              {product.originalPricePKR && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  {formatPKR(product.originalPricePKR)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              {product.stockCount > 5 ? 'In Stock (Nationwide)' : `Only ${product.stockCount} left`}
            </span>
          </div>

          <button
            onClick={(e) => onAddToCart(product, e)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isInCart
                ? 'bg-emerald-50 text-[#2D5A46] border border-emerald-300'
                : 'bg-stone-900 text-white hover:bg-[#2D5A46]'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatPKR, STORE_CONFIG, PROMO_CODES, getWhatsAppUrl } from '../config';
import { SafeImage } from './SafeImage';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  Check, 
  MessageCircle,
  AlertCircle 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);

  // Delivery fee logic
  const isFreeDelivery = subtotal >= STORE_CONFIG.freeShippingThreshold || items.length === 0;
  const deliveryFee = items.length === 0 ? 0 : (isFreeDelivery ? 0 : STORE_CONFIG.standardShippingFee);

  // Discount logic
  const discountRate = appliedPromo ? (PROMO_CODES[appliedPromo] || 0) : 0;
  const discountAmount = Math.round(subtotal * discountRate);

  // Grand Total
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Free shipping remaining
  const neededForFreeShipping = Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100));

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const success = onApplyPromo(code);
    if (!success) {
      setPromoError('Invalid promo code. Try KHAALIS10 or COOKING2026');
    } else {
      setPromoInput('');
    }
  };

  // WhatsApp formatted cart message
  const generateWhatsAppCartSummary = () => {
    let msg = `Assalam-o-Alaikum Khaalis Kitchen!
I want to order the following items:

`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}*\n   Qty: ${item.quantity} x ${formatPKR(item.product.pricePKR)} = ${formatPKR(item.product.pricePKR * item.quantity)}\n`;
    });

    msg += `
*Subtotal:* ${formatPKR(subtotal)}
*Delivery:* ${isFreeDelivery ? 'FREE' : formatPKR(deliveryFee)}
${appliedPromo ? `*Discount (${appliedPromo}):* -${formatPKR(discountAmount)}\n` : ''}*Grand Total:* ${formatPKR(grandTotal)}

Please confirm order placement for Cash on Delivery.`;
    return msg;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 border-l border-stone-200">
          
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2D5A46]" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Your Kitchen Cart
              </h2>
              <span className="text-xs text-stone-500 font-medium tabular-nums">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors p-1"
                  title="Clear entire cart"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Tracker */}
          <div className="px-5 py-3 bg-emerald-50/50 border-b border-emerald-100 text-xs">
            {isFreeDelivery && items.length > 0 ? (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You unlocked FREE Express Delivery across Pakistan!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#2D5A46]" />
                    <span>Add {formatPKR(neededForFreeShipping)} more for FREE Delivery</span>
                  </span>
                  <span className="font-bold tabular-nums text-[#2D5A46]">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#2D5A46] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">Your cart is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our kitchen appliances, cookware essentials, and smart gadgets to start your order.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-[#2D5A46] text-white text-xs font-semibold hover:bg-[#244838] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3.5">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <SafeImage
                      src={item.product.image}
                      alt={item.product.name}
                      fallbackText={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 tabular-nums">
                        {formatPKR(item.product.pricePKR)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200/60 text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200/60 text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        {formatPKR(item.product.pricePKR * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout Controls */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromoCode} className="space-y-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{appliedPromo}</strong> applied ({Math.round(discountRate * 100)}% OFF)</span>
                    </span>
                    <button
                      type="button"
                      onClick={onRemovePromo}
                      className="text-stone-500 hover:text-stone-800 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. KHAALIS10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white uppercase placeholder:normal-case focus:outline-none focus:border-[#2D5A46]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 text-white hover:bg-stone-900"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{promoError}</span>
                  </p>
                )}
              </form>

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">{formatPKR(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatPKR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges (Pakistan)</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      formatPKR(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total (PKR)</span>
                  <span className="text-base tabular-nums text-[#2D5A46]">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#2D5A46] text-white font-semibold text-xs sm:text-sm hover:bg-[#244838] transition-all shadow-sm cursor-pointer"
                >
                  <span>Proceed to Checkout (Cash on Delivery)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppUrl(generateWhatsAppCartSummary())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-emerald-600 text-emerald-800 font-semibold text-xs hover:bg-emerald-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Send Cart & Order via WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

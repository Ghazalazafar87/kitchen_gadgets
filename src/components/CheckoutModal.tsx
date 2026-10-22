import React, { useState, useEffect } from 'react';
import { CartItem, Order, OrderCustomer } from '../types';
import { formatPKR, STORE_CONFIG, PAKISTAN_CITIES, getWhatsAppUrl } from '../config';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  MessageCircle, 
  Building,
  Smartphone,
  MapPin,
  User,
  ArrowRight
} from 'lucide-react';
import { getStoredCustomerInfo, saveStoredCustomerInfo, saveStoredOrder } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  deliveryFee,
  discount,
  total,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Lahore',
    area: '',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bank_transfer' | 'easypaisa_jazzcash'>('cash_on_delivery');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Load saved customer info if available
  useEffect(() => {
    const saved = getStoredCustomerInfo();
    if (saved) {
      setFormData((prev) => ({
        ...prev,
        fullName: saved.fullName || '',
        phone: saved.phone || '',
        email: saved.email || '',
        city: saved.city || 'Lahore',
        area: saved.area || '',
        address: saved.address || '',
      }));
    }
  }, []);

  if (!isOpen) return null;

  // Validate Pakistani Phone Number
  // Must start with 03 or +923 or 923 and have 10-11 digits
  const validatePhone = (num: string): boolean => {
    const clean = num.replace(/[\s-]/g, '');
    return /^(03[0-9]{9}|\+?923[0-9]{9})$/.test(clean);
  };

  const handleInputChange = (field: keyof OrderCustomer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name (at least 3 characters)';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required for delivery rider confirmation';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid Pakistani phone number format (e.g. 0300-1234567)';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please select your delivery city';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Town, sector, or neighborhood is required';
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Please provide complete house/street address (min 10 characters)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Save preferences
    saveStoredCustomerInfo(formData);

    // Generate Order
    setTimeout(() => {
      const orderNumber = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        customer: { ...formData },
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          pricePKR: i.product.pricePKR,
          quantity: i.quantity,
          image: i.product.image,
        })),
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod,
        status: 'Confirmed',
      };

      saveStoredOrder(newOrder);
      setConfirmedOrder(newOrder);
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  // WhatsApp Order Confirmation message
  const getConfirmationWhatsAppMessage = (order: Order) => {
    let msg = `*Order Confirmation - Khaalis Kitchen*
*Order ID:* ${order.orderNumber}
*Customer:* ${order.customer.fullName}
*Phone:* ${order.customer.phone}
*Address:* ${order.customer.address}, ${order.customer.area}, ${order.customer.city}
*Payment:* ${order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery (COD)' : order.paymentMethod}

*Items Ordered:*
`;
    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.productName} (x${item.quantity}) - ${formatPKR(item.pricePKR * item.quantity)}\n`;
    });

    msg += `
*Total Amount Payable:* ${formatPKR(order.total)}

Please confirm dispatch timeline. Thank you!`;
    return msg;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity" 
        onClick={() => {
          if (!confirmedOrder) onClose();
        }} 
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {confirmedOrder ? 'Order Confirmed!' : 'Cash on Delivery Checkout'}
              </h2>
              <p className="text-xs text-stone-500">
                {confirmedOrder
                  ? 'Your simulated demo order has been placed and saved'
                  : 'Fast nationwide delivery across 100+ cities in Pakistan'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50 transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {confirmedOrder ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Thank You, {confirmedOrder.customer.fullName}!
                </h3>
                <p className="text-xs text-stone-600">
                  Your order reference is <strong className="text-stone-900 font-mono text-sm">{confirmedOrder.orderNumber}</strong>
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium mt-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Estimated Delivery: {STORE_CONFIG.defaultDeliveryEstimate}</span>
                </div>
              </div>

              {/* Order Receipt Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-200 pb-2 font-medium text-stone-700">
                  <span>Delivery Address</span>
                  <span className="text-right text-stone-900 max-w-[220px]">
                    {confirmedOrder.customer.address}, {confirmedOrder.customer.area}, {confirmedOrder.customer.city}
                  </span>
                </div>

                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-600">Contact Number</span>
                  <span className="font-semibold text-stone-900 tabular-nums">{confirmedOrder.customer.phone}</span>
                </div>

                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-600">Payment Option</span>
                  <span className="font-semibold text-stone-900">
                    {confirmedOrder.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery (COD)' : confirmedOrder.paymentMethod}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="font-semibold text-stone-700">Items:</span>
                  {confirmedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-stone-600">
                      <span>{it.productName} x {it.quantity}</span>
                      <span className="tabular-nums font-medium text-stone-900">{formatPKR(it.pricePKR * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Total Amount Due on Delivery</span>
                  <span className="text-base text-[#2D5A46] tabular-nums">{formatPKR(confirmedOrder.total)}</span>
                </div>
              </div>

              {/* Local Storage Notice & WhatsApp Dispatch */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Simulated Order Notice:</strong> This demonstration order is stored safely in your browser’s LocalStorage under <em>My Orders</em>. To simulate forwarding your order to the warehouse support team, tap the WhatsApp confirmation button below!
              </div>

              <div className="space-y-2">
                <a
                  href={getWhatsAppUrl(getConfirmationWhatsAppMessage(confirmedOrder))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order Confirmation to WhatsApp ({STORE_CONFIG.rawPhone})</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-lg border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Order Total Quick Reminder */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500">Order Total ({items.length} item types)</span>
                  <p className="text-lg font-bold text-[#2D5A46] tabular-nums">
                    {formatPKR(total)}
                  </p>
                </div>
                <div className="text-right text-[11px] text-stone-500">
                  <span>Shipping: </span>
                  <strong className="text-stone-800">{deliveryFee === 0 ? 'FREE' : formatPKR(deliveryFee)}</strong>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#2D5A46]" />
                  <span>Customer & Delivery Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fatima Zahra"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:border-[#2D5A46] ${
                        errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number (for Courier Call & SMS) *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0300-1234567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg bg-white font-mono focus:outline-none focus:border-[#2D5A46] ${
                        errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                      }`}
                    />
                    {errors.phone ? (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>
                    ) : (
                      <p className="text-[10px] text-stone-400 mt-1">Pakistani format: 03xx-xxxxxxx</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#2D5A46]"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Town / Sector / Area *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gulberg III, DHA Phase 5, F-7"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:border-[#2D5A46] ${
                        errors.area ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                      }`}
                    />
                    {errors.area && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.area}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Complete Street Address (House #, Street, Landmark) *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. House #42, Street 8, Near Al-Fateh Mall"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:border-[#2D5A46] ${
                      errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please ring bell twice or call before arriving"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-[#2D5A46]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-[#2D5A46]" />
                  <span>Select Payment Method</span>
                </h3>

                <div className="space-y-2">
                  <label 
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-[#2D5A46] bg-emerald-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="mt-1 text-[#2D5A46] focus:ring-[#2D5A46]"
                    />
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">Cash on Delivery (COD)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                          Recommended
                        </span>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        Pay cash directly to the courier rider upon parcel delivery and verification.
                      </p>
                    </div>
                  </label>

                  <label 
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#2D5A46] bg-emerald-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 text-[#2D5A46] focus:ring-[#2D5A46]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900">Online Direct Bank Transfer</span>
                      <p className="text-stone-500 mt-0.5">
                        Transfer via Meezan, HBL, Bank Alfalah, or Nayapay. Receipt sent via WhatsApp.
                      </p>
                    </div>
                  </label>

                  <label 
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'easypaisa_jazzcash'
                        ? 'border-[#2D5A46] bg-emerald-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa_jazzcash"
                      checked={paymentMethod === 'easypaisa_jazzcash'}
                      onChange={() => setPaymentMethod('easypaisa_jazzcash')}
                      className="mt-1 text-[#2D5A46] focus:ring-[#2D5A46]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900">EasyPaisa / JazzCash Mobile Wallet</span>
                      <p className="text-stone-500 mt-0.5">
                        Pay quickly via mobile wallet account number: 0312-6687237.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-[#2D5A46] text-white font-semibold text-sm hover:bg-[#244838] transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Placing Your Demo Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order ({formatPKR(total)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  🔒 Safe & Secure Checkout · No online credit card credentials required for COD
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

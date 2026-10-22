import React from 'react';
import { Order } from '../types';
import { formatPKR, STORE_CONFIG, getWhatsAppUrl } from '../config';
import { X, Package, Clock, Truck, CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
            <Truck className="w-3 h-3" />
            <span>Dispatched</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#2D5A46]" />
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  My Orders & Tracking
                </h2>
                <p className="text-xs text-stone-500">
                  Demo order history saved in this browser's LocalStorage
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50 transition-colors"
              aria-label="Close orders modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orders List */}
          <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">No orders yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When you submit a demo order through our Cash on Delivery checkout, your receipt and tracking will be saved here automatically.
                </p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-xl border border-stone-200 p-4 bg-stone-50/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-stone-900">
                          {ord.orderNumber}
                        </span>
                        {getStatusBadge(ord.status)}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-xs text-stone-400 block">Total Due (COD)</span>
                      <span className="text-base font-bold text-[#2D5A46] tabular-nums">
                        {formatPKR(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-stone-700">
                        <span className="line-clamp-1 max-w-[70%]">
                          {it.productName} <span className="text-stone-400">x{it.quantity}</span>
                        </span>
                        <span className="font-medium tabular-nums">
                          {formatPKR(it.pricePKR * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Customer details & WhatsApp support */}
                  <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
                    <div>
                      <span>Ship to: </span>
                      <strong className="text-stone-800">{ord.customer.fullName}</strong> ({ord.customer.city})
                    </div>

                    <a
                      href={getWhatsAppUrl(`Assalam-o-Alaikum, I am inquiring about Order Status for ${ord.orderNumber} placed by ${ord.customer.fullName}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Inquire via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

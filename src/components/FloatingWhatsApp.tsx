import React, { useState } from 'react';
import { MessageCircle, X, Send, ShoppingBag, Truck, HelpCircle } from 'lucide-react';
import { STORE_CONFIG, getWhatsAppUrl } from '../config';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickMessages = [
    {
      title: 'Inquire About Products',
      msg: 'Assalam-o-Alaikum Khaalis Kitchen! I have a question about one of your kitchen products.',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'Track My Order',
      msg: 'Assalam-o-Alaikum! Could you please give me an update on my delivery status?',
      icon: <Truck className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'Cash on Delivery Help',
      msg: 'Assalam-o-Alaikum! How does Cash on Delivery parcel inspection work in my city?',
      icon: <HelpCircle className="w-4 h-4 text-emerald-600" />,
    },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 z-40 select-none">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="bg-[#2D5A46] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-xs">
                KK
              </div>
              <div>
                <p className="text-xs font-bold leading-none">Khaalis Kitchen Support</p>
                <p className="text-[10px] text-emerald-200 mt-0.5">Online via WhatsApp: {STORE_CONFIG.rawPhone}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-emerald-200 hover:text-white transition-colors"
              aria-label="Close WhatsApp chat card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3 bg-stone-50/70 space-y-2 text-xs">
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Assalam-o-Alaikum! How can we assist you with your kitchen shopping today? Choose a quick topic or chat directly:
            </p>

            <div className="space-y-1.5">
              {quickMessages.map((item, idx) => (
                <a
                  key={idx}
                  href={getWhatsAppUrl(item.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors text-stone-800 text-left font-medium"
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className="text-xs">{item.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer direct chat button */}
          <div className="p-3 bg-white border-t border-stone-100">
            <a
              href={getWhatsAppUrl('Assalam-o-Alaikum Khaalis Kitchen! I would like to chat with customer support.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        aria-label="Contact us on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold hidden sm:inline">WhatsApp Help</span>
      </button>
    </div>
  );
};

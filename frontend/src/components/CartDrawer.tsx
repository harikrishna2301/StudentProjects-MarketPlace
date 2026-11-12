import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { items, itemCount, totalAmount, totalSavings, removeItem, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (items.length > 0) {
      navigate(`/checkout/${items[0].id}`);
    } else {
      navigate('/projects');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#1A0D3D] border-l border-slate-200 dark:border-[#3A2074] h-full flex flex-col shadow-2xl transition-transform duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-[#3A2074]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F2E9FF]">Selected Project Kits</h2>
              <p className="text-[11px] text-slate-500 dark:text-[#C5B4E3] font-mono">
                {itemCount} {itemCount === 1 ? 'kit' : 'kits'} in cart
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#25134D] transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-900 dark:text-[#F2E9FF] text-sm">Your cart is empty</p>
                <p className="text-xs text-slate-500 dark:text-[#C5B4E3] max-w-xs leading-relaxed">
                  Explore verified B.Tech final-year project kits with source code, IEEE reports, and viva preparation.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/projects');
                }}
                className="pk-btn-primary px-5 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] text-white text-xs font-semibold rounded-xl shadow-xs transition-transform hover:scale-[1.03]"
              >
                Browse Projects
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 dark:bg-[#25134D]/60 rounded-2xl border border-slate-200/90 dark:border-[#3A2074] flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-semibold text-[#6A2FC8] dark:text-[#D1B8FF] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-[#F2E9FF] line-clamp-1">{item.title}</h3>
                  <div className="flex items-baseline gap-2 pt-1 font-mono">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-[#F2E9FF]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200/70 dark:hover:bg-[#0B0720] transition-colors"
                  aria-label={`Remove ${item.title} from cart`}
                  title="Remove kit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 dark:border-[#3A2074] space-y-4 bg-white dark:bg-[#1A0D3D]">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#C5B4E3]">
                <span>Deliverables:</span>
                <span className="font-medium text-slate-800 dark:text-[#F2E9FF]">Source ZIP + IEEE Doc + Viva Q&A</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Student Discount Savings:</span>
                  <span className="font-mono font-bold">-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-[#F2E9FF] pt-2 border-t border-slate-100 dark:border-[#3A2074]">
                <span>Total Amount:</span>
                <span className="text-lg font-mono text-[#6A2FC8] dark:text-[#D1B8FF]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full pk-btn-primary py-3 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-[9px] text-xs font-semibold shadow-md shadow-[#6A2FC8]/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-[#C5B4E3]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#D1B8FF]" />
              <span>Razorpay Verified Gateway · Instant ZIP Download</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

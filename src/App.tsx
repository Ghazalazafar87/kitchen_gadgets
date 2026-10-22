import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CategoryType, 
  CartItem, 
  Order, 
  FilterState, 
  SortOption 
} from './types';
import { PRODUCTS } from './data/products';
import { 
  getStoredCart, 
  saveStoredCart, 
  clearStoredCart, 
  getStoredWishlist, 
  saveStoredWishlist, 
  getStoredOrders 
} from './utils/storage';
import { PROMO_CODES, STORE_CONFIG, formatPKR } from './config';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { SearchFilterBar } from './components/SearchFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { TutorialsSection } from './components/TutorialsSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Sparkles, PackageX, Flame } from 'lucide-react';

export default function App() {
  // Client-side hydration safeguard
  const [isMounted, setIsMounted] = useState(false);

  // Application Data States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Modals & Drawers States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filtering & Sorting State
  const [filter, setFilter] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 25000,
    inStockOnly: false,
    minRating: 0,
    sortBy: 'featured',
  });

  // Load from LocalStorage once mounted on client to prevent SSR/Hydration mismatches
  useEffect(() => {
    setIsMounted(true);
    setCart(getStoredCart());
    setWishlist(getStoredWishlist());
    setOrders(getStoredOrders());
  }, []);

  // Save Cart to LocalStorage whenever updated
  useEffect(() => {
    if (isMounted) {
      saveStoredCart(cart);
    }
  }, [cart, isMounted]);

  // Save Wishlist to LocalStorage whenever updated
  useEffect(() => {
    if (isMounted) {
      saveStoredWishlist(wishlist);
    }
  }, [wishlist, isMounted]);

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(product.stockCount, next[existingIndex].quantity + quantity);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      } else {
        return [...prev, { product, quantity: Math.min(product.stockCount, quantity) }];
      }
    });
    addToast(`Added "${product.name}" to cart (${quantity})`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    clearStoredCart();
    addToast('Shopping cart emptied', 'info');
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        addToast(`Saved "${product.name}" to your wishlist`);
        return [...prev, product.id];
      }
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast('Removed item from wishlist', 'info');
  };

  // Promo Handlers
  const handleApplyPromo = (code: string): boolean => {
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      addToast(`Promo code "${code}" applied successfully!`);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    addToast('Promo discount removed', 'info');
  };

  // Checkout Handlers
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    clearStoredCart();
    setAppliedPromo(null);
    addToast(`Order ${newOrder.orderNumber} placed successfully!`);
  };

  // Category navigation helper
  const handleNavigateCategory = (cat: string) => {
    setFilter((prev) => ({ ...prev, category: cat as CategoryType | 'All' }));
    const section = document.getElementById('catalog-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilter({
      category: 'All',
      searchQuery: '',
      minPrice: 0,
      maxPrice: 25000,
      inStockOnly: false,
      minRating: 0,
      sortBy: 'featured',
    });
  };

  // Computed Cart Metrics
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Wishlisted Products list
  const wishlistedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (filter.category !== 'All' && product.category !== filter.category) {
        return false;
      }
      // Search query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesShort = product.shortDescription.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesShort && !matchesCategory && !matchesTags) {
          return false;
        }
      }
      // Price range
      if (product.pricePKR > filter.maxPrice) {
        return false;
      }
      // In stock
      if (filter.inStockOnly && !product.inStock) {
        return false;
      }
      // Min rating
      if (filter.minRating > 0 && product.rating < filter.minRating) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filter.sortBy) {
        case 'price-asc':
          return a.pricePKR - b.pricePKR;
        case 'price-desc':
          return b.pricePKR - a.pricePKR;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [filter]);

  // Products with tutorials
  const productsWithTutorials = useMemo(() => {
    return PRODUCTS.filter((p) => p.tutorial !== undefined);
  }, []);

  // Related products for selected PDP
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return PRODUCTS.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
    );
  }, [selectedProduct]);

  // Calculations for checkout
  const isFreeDelivery = cartSubtotal >= STORE_CONFIG.freeShippingThreshold || cart.length === 0;
  const deliveryFee = cart.length === 0 ? 0 : (isFreeDelivery ? 0 : STORE_CONFIG.standardShippingFee);
  const discountRate = appliedPromo ? (PROMO_CODES[appliedPromo] || 0) : 0;
  const discountAmount = Math.round(cartSubtotal * discountRate);
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans">
      
      {/* Top Header */}
      <Header
        cartCount={cartItemCount}
        cartSubtotal={cartSubtotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onNavigateCategory={handleNavigateCategory}
        onOpenOrders={() => setIsOrdersOpen(true)}
        activeCategory={filter.category}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            const catalog = document.getElementById('catalog-section');
            if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
          }}
          onWatchTutorials={() => {
            const tutorials = document.getElementById('tutorials');
            if (tutorials) tutorials.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Category Navigation Bar */}
        <CategoryNav
          activeCategory={filter.category}
          onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, category: cat }))}
          totalProductsCount={PRODUCTS.length}
        />

        {/* Search & Filter Toolbar */}
        <SearchFilterBar
          filter={filter}
          onFilterChange={setFilter}
          onResetFilters={handleResetFilters}
          resultCount={filteredProducts.length}
          totalCount={PRODUCTS.length}
        />

        {/* Main Product Catalog Section */}
        <section id="catalog-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header row with current state */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {filter.category === 'All' ? 'All Kitchen Essentials & Gadgets' : filter.category}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {filter.searchQuery
                  ? `Showing results matching "${filter.searchQuery}"`
                  : 'Everyday high-grade culinary equipment designed for Pakistani kitchens'}
              </p>
            </div>

            <div className="text-xs text-stone-500">
              <span className="font-semibold text-stone-900">{filteredProducts.length}</span> items found
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                No matching kitchen tools found
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                We couldn't find any products matching your specific filters. Try clearing your search keyword or increasing the maximum price limit.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-lg bg-[#2D5A46] text-white text-xs font-semibold hover:bg-[#244838] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  isInCart={cart.some((item) => item.product.id === product.id)}
                  onSelect={setSelectedProduct}
                  onAddToCart={(p, e) => {
                    e.stopPropagation();
                    handleAddToCart(p, 1);
                  }}
                  onToggleWishlist={handleToggleWishlist}
                  onWatchTutorial={(p, e) => {
                    e.stopPropagation();
                    setSelectedProduct(p);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Dedicated Modern Kitchen Gadgets & Video Tutorials Showcase */}
        <TutorialsSection
          productsWithTutorials={productsWithTutorials}
          onSelectProduct={setSelectedProduct}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />

      </main>

      {/* Floating WhatsApp Help */}
      <FloatingWhatsApp />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        relatedProducts={relatedProducts}
        onSelectRelated={setSelectedProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onSelectProduct={setSelectedProduct}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        discount={discountAmount}
        total={grandTotal}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* My Orders / Tracking Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={handleNavigateCategory}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

    </div>
  );
}

import { CartItem, WishlistItem, Order, OrderCustomer } from '../types';

const CART_STORAGE_KEY = 'khaalis_cart_v1';
const WISHLIST_STORAGE_KEY = 'khaalis_wishlist_v1';
const ORDERS_STORAGE_KEY = 'khaalis_orders_v1';
const CUSTOMER_INFO_KEY = 'khaalis_customer_v1';

/**
 * Safely check if window & localStorage are available
 */
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

// ---------------- CART STORAGE ---------------- //

export function getStoredCart(): CartItem[] {
  if (!isClient()) return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate each cart entry
    return parsed.filter(item => 
      item && 
      item.product && 
      typeof item.product.id === 'string' && 
      typeof item.quantity === 'number' && 
      item.quantity > 0
    );
  } catch (err) {
    console.error('Failed to load cart from localStorage:', err);
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): boolean {
  if (!isClient()) return false;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
    return false;
  }
}

export function clearStoredCart(): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear cart:', err);
  }
}

// ---------------- WISHLIST STORAGE ---------------- //

export function getStoredWishlist(): string[] {
  if (!isClient()) return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch (err) {
    console.error('Failed to load wishlist:', err);
    return [];
  }
}

export function saveStoredWishlist(productIds: string[]): boolean {
  if (!isClient()) return false;
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
    return true;
  } catch (err) {
    console.error('Failed to save wishlist:', err);
    return false;
  }
}

// ---------------- ORDERS STORAGE ---------------- //

export function getStoredOrders(): Order[] {
  if (!isClient()) return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error('Failed to load orders from localStorage:', err);
    return [];
  }
}

export function saveStoredOrder(order: Order): boolean {
  if (!isClient()) return false;
  try {
    const currentOrders = getStoredOrders();
    const updated = [order, ...currentOrders];
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
    return false;
  }
}

// ---------------- CUSTOMER PREFERENCES ---------------- //

export function getStoredCustomerInfo(): Partial<OrderCustomer> | null {
  if (!isClient()) return null;
  try {
    const raw = window.localStorage.getItem(CUSTOMER_INFO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredCustomerInfo(info: Partial<OrderCustomer>): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(CUSTOMER_INFO_KEY, JSON.stringify(info));
  } catch (err) {
    console.error('Failed to save customer info:', err);
  }
}

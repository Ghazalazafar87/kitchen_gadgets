export type CategoryType = 
  | 'Kitchen Appliances'
  | 'Cooking Essentials'
  | 'Modern Kitchen Gadgets'
  | 'Food Storage and Organization'
  | 'Kitchen Tools and Accessories'
  | 'Cleaning and Dishwashing';

export interface ProductSpecification {
  material: string;
  dimensions: string;
  capacity?: string;
  powerWatts?: string;
  warranty: string;
  careInstructions: string;
  origin?: string;
}

export interface ProductTutorial {
  title: string;
  videoUrl?: string; // YouTube embed or MP4
  duration: string;
  quickTips: string[];
  steps: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  pricePKR: number;
  originalPricePKR?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  image: string;
  galleryImages?: string[];
  description: string;
  shortDescription: string;
  specifications: ProductSpecification;
  tutorial?: ProductTutorial;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  area: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  pricePKR: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'bank_transfer' | 'easypaisa_jazzcash';
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered';
}

export type SortOption = 
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface FilterState {
  category: CategoryType | 'All';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  sortBy: SortOption;
}

export type CheckoutFlow = 'site_request' | 'telegram_redirect';

export interface Variant {
  id: string;
  name: string;
  price?: number;
  priceDisplay?: string;
}

export interface RequirementsProfile {
  needsAccountEmail?: boolean;
  needsRegion?: boolean;
  needsPlanTerm?: boolean;
  needsInviteLink?: boolean;
  needsAdditionalComment?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string; // category_id
  service: string;
  tags: string[];
  flow: CheckoutFlow;
  imageUrl: string;
  variants: Variant[];
  requirements: RequirementsProfile;
}

export interface CartItem {
  product: Product;
  selectedVariant: Variant;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
}

// New types for orders and settings
export interface OrderItem {
  productId: string;
  productTitle: string;
  variantId: string;
  variantName: string;
}

// Payment status for orders
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  email: string | null;
  telegram: string | null;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  totalAmount?: number;
  currency?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  telegramUsername: string;
  adminPassword: string;
  adminPasswordHash?: string; // SHA-256 hash of password
  bannerInterval?: number; // ms, default 3000
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string; // Right-side hero image (PNG with transparency)
  linkUrl: string;
  buttonText: string;
  sortOrder: number;
  active: boolean;
}
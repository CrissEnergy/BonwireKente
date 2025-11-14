
export interface ProductPrice {
  usd: number;
  ghs: number;
  eur: number;
}

export interface Product {
  id: string;
  name: string;
  patternName: string;
  price: ProductPrice; // Changed from number to ProductPrice object
  description: string;
  story: string;
  images: string[];
  imageUrl: string;
  category: 'Stoles & Sashes' | 'Full Cloths' | 'Accessories' | 'Ready-to-Wear';
  tags: ('Unisex' | 'For Men' | 'For Women' | 'Wedding' | 'Festival' | 'Everyday' | 'Traditional' | 'Naming Ceremony')[];
  featured?: boolean;
}

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1 }, // rate is now for reference, not calculation
  EUR: { symbol: '€', rate: 0.93 },
  GHS: { symbol: 'GH₵', rate: 14.80 },
};

export type Currency = keyof typeof CURRENCIES;

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number; // This will be the price in the currency at time of order
    imageUrl?: string;
}

export interface Order {
    id: string;
    userId: string;
    orderDate: string; // Should be ISO string
    totalAmount: number;
    shippingAddress: string; 
    paymentMethod: string;
    status: OrderStatus;
    items: OrderItem[];
}

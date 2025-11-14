
export interface Product {
  id: string;
  name: string;
  patternName: string;
  price: number; // Base price in USD
  description: string;
  story: string;
  images: string[]; // These are now URLs
  imageUrl: string; // The primary image URL
  category: 'Stoles & Sashes' | 'Full Cloths' | 'Accessories' | 'Ready-to-Wear';
  tags: ('Unisex' | 'For Men' | 'For Women' | 'Wedding' | 'Festival' | 'Everyday' | 'Traditional' | 'Naming Ceremony')[];
}

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.93 },
  GHS: { symbol: 'GH₵', rate: 14.80 },
};

export type Currency = keyof typeof CURRENCIES;

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
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

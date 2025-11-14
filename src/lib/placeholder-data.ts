
import type { Order, Product } from './types';

// This file is now deprecated for products, but we keep it for other mock data if needed.
// Product data is now fetched from Firestore.

export const products: Product[] = [];

export const orders: Order[] = [
  {
    id: "ORD001",
    userId: "user1",
    orderDate: "2024-05-20",
    totalAmount: 110,
    shippingAddress: "123 Test St",
    paymentMethod: "Card",
    status: "Shipped",
    items: [
      { id: "1", name: "Adwinasa Kente Stole", quantity: 1, price: 75, imageUrl: "" },
      { id: "3", name: "Sika Futoro Bow Tie", quantity: 1, price: 35, imageUrl: "" }
    ]
  },
  {
    id: "ORD002",
    userId: "user2",
    orderDate: "2024-05-22",
    totalAmount: 450,
    shippingAddress: "456 Test Ave",
    paymentMethod: "Card",
    status: "Processing",
    items: [
       { id: "2", name: "Obaakofoo Mmu Man Full Cloth", quantity: 1, price: 450, imageUrl: "" }
    ]
  },
];


export const getProductById = (id: string) => products.find(p => p.id === id);
export const getProductBySlug = (slug: string) => products.find(p => p.patternName.toLowerCase().replace(/ /g, '-') === slug);

export interface Product {
  id: string;
  name: string;
  patternName: string;
  price: number; // Base price in USD
  description: string;
  story: string;
  images: string[];
  category: 'Stoles & Sashes' | 'Full Cloths' | 'Accessories' | 'Ready-to-Wear';
  tags: ('Unisex' | 'For Men' | 'For Women' | 'Wedding' | 'Festival' | 'Everyday' | 'Traditional' | 'Naming Ceremony')[];
  colors: string[];
  customizationOptions?: { name: string; options: string[] }[];
}

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.93 },
  GHS: { symbol: 'GH₵', rate: 14.80 },
};

export type Currency = keyof typeof CURRENCIES;

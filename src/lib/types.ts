export interface Product {
  id: string;
  name: string;
  patternName: string;
  price: number;
  description: string;
  story: string;
  images: string[];
  category: 'Stoles & Sashes' | 'Full Cloths' | 'Accessories' | 'Ready-to-Wear';
  tags: ('Unisex' | 'For Men' | 'For Women' | 'Wedding' | 'Festival' | 'Everyday')[];
  colors: string[];
  customizationOptions?: { name: string; options: string[] }[];
}

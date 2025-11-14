import type { Order, Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Adwinasa Kente Stole',
    patternName: 'Adwinasa',
    price: 75.00,
    description: 'A masterpiece of Kente weaving, the Adwinasa pattern symbolizes greatness, excellence, and royalty. This stole is perfect for graduations, weddings, and other momentous occasions.',
    story: 'The name "Adwinasa" translates to "all motifs are used up," signifying the weaver has exhausted their repertoire of patterns in creating this complex design. It represents the pinnacle of skill and creativity.',
    images: ['kente-stole-1', 'kente-stole-2'],
    category: 'Stoles & Sashes',
    tags: ['Unisex', 'Wedding', 'Festival', 'Traditional'],
    colors: ['Gold', 'Red', 'Black', 'Green'],
    customizationOptions: [
      {
        name: "Embroidery",
        options: ["None", "Initials (+$10.00)", "Full Name (+$20.00)"],
      },
    ],
  },
  {
    id: '2',
    name: 'Obaakofoo Mmu Man Full Cloth',
    patternName: 'Obaakofoo Mmu Man',
    price: 450.00,
    description: 'This full cloth carries a profound message of unity and democracy. Woven with deep indigo and gold threads, it is a statement piece for community leaders and those who value collective responsibility.',
    story: 'Meaning "one person does not rule a nation," this pattern is a visual representation of the Akan proverb about participatory democracy. It celebrates the idea that leadership requires counsel and community involvement.',
    images: ['full-cloth-1', 'full-cloth-2'],
    category: 'Full Cloths',
    tags: ['For Men', 'For Women', 'Festival', 'Traditional'],
    colors: ['Blue', 'Gold', 'White'],
  },
  {
    id: '3',
    name: 'Sika Futoro Bow Tie',
    patternName: 'Sika Futoro',
    price: 35.00,
    description: 'Add a touch of heritage to your formal wear with this elegant bow tie. The Sika Futoro pattern, representing wealth and prosperity, makes it a perfect accessory for celebrations and professional settings.',
    story: '"Sika Futoro" means "gold dust" and is associated with wealth, abundance, and prosperity. It was historically worn by the wealthy and powerful to signify their status.',
    images: ['accessory-bow-tie'],
    category: 'Accessories',
    tags: ['For Men', 'Unisex', 'Wedding', 'Everyday'],
    colors: ['Gold', 'Black'],
  },
  {
    id: '4',
    name: 'Nkyinkyim Flare Dress',
    patternName: 'Nkyinkyim',
    price: 180.00,
    description: 'A modern, ready-to-wear dress featuring the classic Nkyinkyim pattern. This dress combines contemporary fashion with deep cultural meaning, perfect for the modern woman who honors her roots.',
    story: 'The zigzag Nkyinkyim pattern represents the twists and turns of life\'s journey. It is a symbol of dynamism, adaptability, and the ability to overcome challenges.',
    images: ['ready-to-wear-dress'],
    category: 'Ready-to-Wear',
    tags: ['For Women', 'Everyday'],
    colors: ['Red', 'Yellow', 'Black'],
  },
  {
    id: '5',
    name: 'Fathia Fata Nkrumah Stole',
    patternName: 'Fathia Fata Nkrumah',
    price: 85.00,
    description: 'A historically significant pattern celebrating unity and love. This elegant stole is perfect for special occasions, embodying a story of pan-African connection.',
    story: 'This pattern was designed in honor of the marriage between Ghana\'s first president, Kwame Nkrumah, and his Egyptian wife, Fathia. It symbolizes the bridging of cultures and the spirit of pan-Africanism.',
    images: ['kente-stole-2', 'kente-stole-1'],
    category: 'Stoles & Sashes',
    tags: ['Unisex', 'Wedding', 'Traditional'],
    colors: ['Green', 'Gold', 'Black', 'Red'],
  },
  {
    id: '6',
    name: 'Emaa Da Buba',
    patternName: 'Emaa Da',
    price: 150.00,
    description: 'This "novelty" pattern is a modern creation, showcasing the evolution of Kente weaving. Its vibrant colors and unique design make it a standout piece for fashion-forward individuals.',
    story: '"Emaa Da" means "it has not happened before." This pattern represents innovation and new ideas, breaking from tradition while still honoring the craft of Kente weaving.',
    images: ['ready-to-wear-shirt'],
    category: 'Ready-to-Wear',
    tags: ['For Men', 'Unisex', 'Everyday', 'Festival'],
    colors: ['Blue', 'Orange', 'White'],
  }
];

export const orders: Order[] = [
  {
    id: "ORD001",
    customerName: "Ama Serwaa",
    date: "2024-05-20",
    total: 110.00,
    status: "Shipped",
    items: [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 1 }
    ]
  },
  {
    id: "ORD002",
    customerName: "Kofi Annan",
    date: "2024-05-22",
    total: 450.00,
    status: "Processing",
    items: [
      { product: products[1], quantity: 1 }
    ]
  },
  {
    id: "ORD003",
    customerName: "Yaa Asantewaa",
    date: "2024-05-23",
    total: 180.00,
    status: "Delivered",
    items: [
      { product: products[3], quantity: 1 }
    ]
  },
    {
    id: "ORD004",
    customerName: "Kwame Nkrumah",
    date: "2024-05-25",
    total: 235.00,
    status: "Pending",
    items: [
      { product: products[4], quantity: 1 },
      { product: products[5], quantity: 1 }
    ]
  }
];


export const getProductById = (id: string) => products.find(p => p.id === id);
export const getProductBySlug = (slug: string) => products.find(p => p.patternName.toLowerCase().replace(/ /g, '-') === slug);

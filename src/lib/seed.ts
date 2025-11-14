// This is a temporary file to seed the database with initial data.
// It will be removed after the first run.
'use client';
import type { Product } from './types';
import { collection, getDocs, writeBatch, doc, Firestore } from 'firebase/firestore';

const sampleProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Adwinasa Royalty Stole',
    patternName: 'Adwinasa',
    price: { usd: 85, ghs: 1250, eur: 79 },
    category: 'Stoles & Sashes',
    description: "The Adwinasa pattern, which means 'all motifs are used up,' is a testament to the weaver's skill, incorporating a complex variety of designs into a single masterpiece. This stole is perfect for significant events where you want to make a statement of sophistication and completeness.",
    story: "Legend says the first Adwinasa weaver was so inspired that he vowed to exhaust all known Kente motifs in one cloth. Upon completing it, he declared his masterpiece 'Adwinasa,' signifying the pinnacle of his craft and the exhaustion of all patterns.",
    tags: ['Traditional', 'Wedding', 'Unisex'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1644845933242-cb40a29c9059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZW50ZSUyMHN0b2xlfGVufDB8fHx8MTc2MzA4OTA3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
        'https://images.unsplash.com/photo-1644845933242-cb40a29c9059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZW50ZSUyMHN0b2xlfGVufDB8fHx8MTc2MzA4OTA3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1726273858078-cb94feb4cf53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxnaGFuYSUyMGZhYnJpY3xlbnwwfHx8fDE3NjMwODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
  },
  {
    name: 'Golden Kingdom Full Cloth',
    patternName: 'Sika Futoro',
    price: { usd: 450, ghs: 6650, eur: 420 },
    category: 'Full Cloths',
    description: '"Sika Futoro," meaning "gold dust," symbolizes wealth, royalty, and social status. This luxurious full cloth is woven with golden yellow threads that shimmer, making it a prized possession for ceremonial occasions and a symbol of prosperity.',
    story: "The Ashanti Kingdom was historically known for its vast gold resources. The Sika Futoro pattern was created for kings and queens to wear during royal durbars, reflecting the kingdom's immense wealth and the sun's life-giving power.",
    tags: ['Traditional', 'Wedding', 'Festival'],
    featured: false,
     imageUrl: 'https://images.unsplash.com/photo-1612353375223-e6acfa31ae71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGV4dGlsZXxlbnwwfHx8fDE3NjMwODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
        'https://images.unsplash.com/photo-1612353375223-e6acfa31ae71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGV4dGlsZXxlbnwwfHx8fDE3NjMwODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1761515315519-7fa1af1d3e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxrZW50ZSUyMHBhdHRlcm58ZW58MHx8fHwxNzYyOTg5MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
  },
  {
    name: 'The Unity Bow Tie',
    patternName: 'Fathia Fata Nkrumah',
    price: { usd: 35, ghs: 520, eur: 32 },
    category: 'Accessories',
    description: 'A stylish bow tie featuring the "Fathia Fata Nkrumah" pattern, a design created to honor the marriage of Ghana\'s first president, Dr. Kwame Nkrumah, to his Egyptian wife, Fathia. It represents unity and the coming together of different cultures.',
    story: "This pattern was commissioned for the historic union between Ghana and Egypt through marriage. It is a powerful symbol of Pan-Africanism and the idea that love and unity can transcend borders and backgrounds, weaving two distinct cultures into one beautiful fabric.",
    tags: ['Unisex', 'Wedding', 'Everyday'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1666357702631-48dcc06ec849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxrZW50ZSUyMGJvdyUyMHRpZXxlbnwwfHx8fDE3NjMwODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1666357702631-48dcc06ec849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxrZW50ZSUyMGJvdyUyMHRpZXxlbnwwfHx8fDE3NjMwODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    name: "The Statesman's Sash",
    patternName: 'Obaakofoo Mmu Man',
    price: { usd: 95, ghs: 1400, eur: 88 },
    category: 'Stoles & Sashes',
    description: 'The name of this pattern translates to "one person does not rule a nation." It is a powerful symbol of democracy, participatory governance, and the importance of counsel. Wearing this sash conveys a message of humility and collaborative leadership.',
    story: 'This design was often worn by chiefs and elders during council meetings to remind themselves and others that wisdom is not found in a single person, but in the collective. It champions the idea that a good leader listens to their people.',
    tags: ['Traditional', 'For Men', 'Unisex'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1741885178424-f6959f813aa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZHJlc3N8ZW58MHx8fHwxNzYzMDg5MDczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1741885178424-f6959f813aa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZHJlc3N8ZW58MHx8fHwxNzYzMDg5MDczfDA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    name: 'The "Nyame Biribi Wo Soro" Shirt',
    patternName: 'Nyame Biribi Wo Soro',
    price: { usd: 120, ghs: 1775, eur: 112 },
    category: 'Ready-to-Wear',
    description: 'A modern, ready-to-wear shirt featuring the "Nyame Biribi Wo Soro" pattern, which means "God is in the heavens." It is an expression of hope, faith, and reliance on a higher power. This stylish shirt blends tradition with contemporary fashion.',
    story: 'This pattern is a visual prayer, a reminder that for every problem, there is a solution that can be found through faith and hope. It encourages the wearer to look upwards for inspiration and to trust in the divine for providence and protection.',
    tags: ['Everyday', 'Unisex', 'For Men', 'For Women'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1761660896769-1adb3a79a5f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxhZnJpY2FuJTIwc2hpcnR8ZW58MHx8fHwxNzYzMDg5MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1761660896769-1adb3a79a5f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxhZnJpY2FuJTIwc2hpcnR8ZW58MHx8fHwxNzYzMDg5MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080'],
  }
];


export async function seedDatabase(firestore: Firestore) {
    const productsCollection = collection(firestore, 'products');
    
    try {
        const snapshot = await getDocs(productsCollection);
        if (!snapshot.empty) {
            console.log('Database already seeded. Skipping.');
            return;
        }

        console.log('Database is empty. Seeding products...');
        const batch = writeBatch(firestore);

        sampleProducts.forEach(productData => {
            const docRef = doc(productsCollection); // Create a new doc with a generated ID
            const productWithId = { ...productData, id: docRef.id };
            batch.set(docRef, productWithId);
        });

        await batch.commit();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

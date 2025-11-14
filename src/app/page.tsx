
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Loader2 } from 'lucide-react';
import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Product } from '@/lib/types';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const firestore = useFirestore();
  
  const productsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      // Query for products where 'featured' is true
      return query(collection(firestore, 'products'), where("featured", "==", true));
  }, [firestore]);

  const { data: featuredProducts, isLoading } = useCollection<Product>(productsQuery);

  const homeCarouselImages = [
    PlaceHolderImages.find(img => img.id === 'homepage-carousel-1'),
    PlaceHolderImages.find(img => img.id === 'homepage-carousel-2'),
    PlaceHolderImages.find(img => img.id === 'homepage-carousel-3'),
  ].filter(Boolean);

  const plugin = React.useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <div className="space-y-16 md:space-y-24 pb-24 animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline leading-tight">
            BonwireKente
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl">
            Wear Your Heritage
          </p>
          <p className="mt-2 text-base md:text-lg max-w-2xl text-slate-200">
            To make authentic Ghanaian Kente accessible worldwide, celebrating its beauty, cultural significance, and craftsmanship
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/shop">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <h2 className="text-3xl font-bold text-center font-headline mb-8">Featured Weaves</h2>
        {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts && featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        )}
        <div className="text-center mt-12">
            <Button asChild variant="outline">
                <Link href="/shop">View All Products</Link>
            </Button>
        </div>
      </section>

      {/* Kente Guide CTA */}
      <section className="bg-secondary/50 py-20">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-headline mb-4">Discover the Story in Every Thread</h2>
          <p className="text-muted-foreground mb-6">
            Each Kente pattern has a name and a story. Our AI-powered Kente Guide helps you explore the rich symbolism and history behind the cloth you wear.
          </p>
          <Button asChild>
            <Link href="/kente-guide">Explore the Kente Guide</Link>
          </Button>
        </div>
      </section>
      
      {/* Brand Mission */}
      <section className="container">
         <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                 <h2 className="text-3xl font-bold font-headline mb-4">From Ghana, With Pride</h2>
                 <p className="text-muted-foreground mb-4">BonwireKente was born from a desire to share the vibrant legacy of Ghanaian Kente with the world. We partner directly with artisans in Ghana, ensuring every piece is authentic, ethically made, and carries the spirit of its creator.</p>
                 <p className="text-muted-foreground mb-6">Our mission is to make this celebrated art form a part of your story, connecting you to a rich heritage of craftsmanship and culture.</p>
                 <Button asChild variant="outline">
                    <Link href="/about">Learn More About Us</Link>
                 </Button>
            </div>
            <div>
                 <Carousel
                    plugins={[plugin.current]}
                    className="w-full rounded-lg overflow-hidden shadow-lg"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    >
                    <CarouselContent>
                        {homeCarouselImages.map((image, index) => image && (
                        <CarouselItem key={index}>
                            <div className="aspect-w-4 aspect-h-3 relative">
                                <Image
                                    src={image.imageUrl}
                                    alt={image.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.imageHint}
                                />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
         </div>
      </section>
    </div>
  );
}

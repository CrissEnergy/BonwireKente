"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function WishlistPage() {
  const { wishlist } = useAppContext();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full animate-fade-in-up">
       {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover blur-md scale-110"
            data-ai-hint={heroImage.imageHint}
          />
        )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Your Wishlist</h1>
          <p className="text-lg text-slate-200">
            Your collection of favorited heritage pieces.
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl rounded-lg p-12 max-w-lg mx-auto text-white">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold font-headline">Your Wishlist is Empty</h3>
            <p className="text-slate-300 mt-2 mb-6">
              You haven't added any products to your wishlist yet. Browse our collection to find something you love.
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

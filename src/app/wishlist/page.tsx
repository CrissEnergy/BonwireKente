"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useAppContext();

  return (
    <div className="container py-16 md:py-24 animate-fade-in-up">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Your Wishlist</h1>
        <p className="text-lg text-muted-foreground">
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
        <div className="text-center bg-secondary/30 rounded-lg p-12 max-w-lg mx-auto">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold font-headline">Your Wishlist is Empty</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            You haven't added any products to your wishlist yet. Browse our collection to find something you love.
          </p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

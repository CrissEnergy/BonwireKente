
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ProductPrice } from './ProductPrice';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, formatPrice } = useAppContext();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const isNowInWishlist = !isInWishlist(product.id);
    toggleWishlist(product);
    toast({
      title: isNowInWishlist ? "Added to Wishlist" : "Removed from Wishlist",
      description: `${product.name} has been ${isNowInWishlist ? 'added to' : 'removed from'} your wishlist.`,
    });
  };

  const productInWishlist = isInWishlist(product.id);

  const slug = product.id;

  return (
    <Card className="overflow-hidden flex flex-col group bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
      <Link href={`/shop/${slug}`} className="block">
        <CardContent className="p-0">
          <div className="aspect-w-3 aspect-h-4 relative">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
             <div className="absolute top-2 right-2">
               <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/70 hover:bg-background"
                onClick={handleToggleWishlist}
                aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
               >
                 <Heart className={cn("h-5 w-5", productInWishlist ? "fill-red-500 text-red-500" : "text-foreground")} />
               </Button>
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/shop/${slug}`} className="block">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.patternName}</p>
        </Link>
        <ProductPrice price={product.price} className="text-lg font-bold mt-2 flex-grow" />
      </div>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Weave Into Wardrobe
        </Button>
      </CardFooter>
    </Card>
  );
}

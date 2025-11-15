'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { WishlistButton } from '@/components/products/WishlistButton';
import { ProductPrice } from '@/components/products/ProductPrice';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function ProductDetailClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const firestore = useFirestore();

  const productRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, 'products', slug);
  }, [firestore, slug]);

  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productRef);

  if (isProductLoading || !product) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center">
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
        <div className="relative z-10 flex justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isProductLoading && !product) {
    notFound();
  }

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
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container py-12 md:py-24 flex items-center justify-center">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl w-full">
                <Card className="overflow-hidden group bg-card/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-0">
                        <div className="aspect-w-1 aspect-h-1 relative">
                        {product.imageUrl && (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        )}
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-headline text-white">{product.name}</h1>
                            <p className="text-lg text-slate-300 mt-1">{product.patternName}</p>
                            <div className="my-4">
                                <ProductPrice price={product.price} className="text-3xl font-bold text-white" />
                            </div>
                        </div>

                        <p className="text-slate-300 leading-relaxed">{product.description}</p>
                        
                        <div className="flex items-center gap-4 pt-4">
                            <AddToCartButton product={product} />
                            <WishlistButton product={product} />
                        </div>
                        
                        <Separator className="bg-white/20"/>

                        {product.story && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-headline text-xl font-bold mb-2 text-white">The Story Behind the Weave</h3>
                                    <p className="text-slate-300 whitespace-pre-wrap">{product.story}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

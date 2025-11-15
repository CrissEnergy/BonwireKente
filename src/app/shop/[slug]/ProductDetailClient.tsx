'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { WishlistButton } from '@/components/products/WishlistButton';
import { ProductPrice } from '@/components/products/ProductPrice';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
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

  const relatedProductsQuery = useMemoFirebase(() => {
    if (!firestore || !product) return null;
    // Query for 4 other products in the same category, excluding the current one.
    return query(
      collection(firestore, 'products'),
      where('category', '==', product.category),
      where('id', '!=', product.id),
      limit(4)
    );
  }, [firestore, product]);

  const { data: relatedProducts, isLoading: areProductsLoading } = useCollection<Product>(relatedProductsQuery);

  const isLoading = isProductLoading || !product;

  // Initial loading state before we even have a product object
  if (isProductLoading && !product) {
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

  // After loading, if product is still null, it means it wasn't found
  if (!isLoading && !product) {
    notFound();
  }
  
  // This should not happen if notFound() is called, but as a fallback.
  if(!product) return null;

  return (
    <div className="relative min-h-screen w-full animate-fade-in-up">
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
        <div className="relative z-10 container py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
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
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
                            <p className="text-lg text-muted-foreground mt-1">{product.patternName}</p>
                            <div className="my-4">
                                <ProductPrice price={product.price} className="text-3xl font-bold" />
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                        
                        <div className="flex items-center gap-4">
                            <AddToCartButton product={product} />
                            <WishlistButton product={product} />
                        </div>
                        
                        <Separator />

                        {product.story && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-headline text-xl font-bold mb-2">The Story Behind the Weave</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{product.story}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {areProductsLoading && (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="mt-16 md:mt-24">
                <h2 className="text-3xl font-bold text-center font-headline mb-8 text-white">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedProducts.map(relatedProduct => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                </div>
                </section>
            )}
        </div>
    </div>
  );
}
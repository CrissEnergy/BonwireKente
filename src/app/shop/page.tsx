
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { products as allProducts } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ShopPage() {
  const [filters, setFilters] = useState({
    colors: [] as string[],
    priceRange: [0, 500] as [number, number],
    occasions: [] as string[],
    categories: [] as string[],
    audience: [] as string[],
  });

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const inColor = filters.colors.length === 0 || product.colors.some(c => filters.colors.includes(c));
      const inPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const inOccasion = filters.occasions.length === 0 || product.tags.some(t => filters.occasions.includes(t));
      const inCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
      const inAudience = filters.audience.length === 0 || product.tags.some(t => filters.audience.includes(t));
      return inColor && inPrice && inOccasion && inCategory && inAudience;
    });
  }, [filters]);

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
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Shop Our Collection</h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Explore our collection of authentic Kente, from traditional full cloths to modern accessories.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters filters={filters} setFilters={setFilters} />
          </aside>

          <main className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center bg-card/60 backdrop-blur-sm border-white/20 rounded-lg p-12 text-white">
                  <h3 className="text-2xl font-semibold">No Products Found</h3>
                  <p className="text-slate-200 mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

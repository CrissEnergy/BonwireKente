"use client";

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { products as allProducts } from '@/lib/placeholder-data';

export default function ShopPage() {
  const [filters, setFilters] = useState({
    colors: [] as string[],
    priceRange: [0, 500] as [number, number],
    occasions: [] as string[],
  });

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const inColor = filters.colors.length === 0 || product.colors.some(c => filters.colors.includes(c));
      const inPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const inOccasion = filters.occasions.length === 0 || product.tags.some(t => filters.occasions.includes(t));
      return inColor && inPrice && inOccasion;
    });
  }, [filters]);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Shop Our Collection</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            <div className="flex flex-col items-center justify-center h-full text-center bg-secondary/30 rounded-lg p-12">
                <h3 className="text-2xl font-semibold">No Products Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

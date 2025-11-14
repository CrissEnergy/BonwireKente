
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/types';

export function LiveSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery || !products) {
      return [];
    }
    const lowercasedQuery = debouncedQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.patternName.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
    );
  }, [debouncedQuery, products]);

  const localIsSearching = isSearching || isLoadingProducts;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="bg-background/90 backdrop-blur-lg border-white/20">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-headline">Search for Products</SheetTitle>
        </SheetHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, pattern, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 h-12 text-lg"
          />
          {localIsSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />}
        </div>
        
        <ScrollArea className="h-[60vh] mt-6">
          {query && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((product) => {
                 const slug = product.id; // Use ID for slug
                return (
                    <SheetClose asChild key={product.id}>
                        <Link
                        href={`/shop/${slug}`}
                        className="flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-muted"
                        >
                        {product.imageUrl && (
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.patternName}</p>
                        </div>
                        </Link>
                    </SheetClose>
                );
              })}
            </div>
          )}
          {query && !localIsSearching && searchResults.length === 0 && (
            <div className="text-center py-10">
              <p className="font-semibold">No results found for "{debouncedQuery}"</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different search term.</p>
            </div>
          )}
          {!query && (
             <div className="text-center py-10">
              <p className="text-muted-foreground">Start typing to find your heritage.</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

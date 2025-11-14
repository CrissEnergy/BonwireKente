'use client';

import { CartClient } from './CartClient';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CartPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/account');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center animate-fade-in-up">
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
  
  if(user) {
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
              <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Your Shopping Cart</h1>
              <p className="text-lg text-slate-200">
                  Review the items in your cart and proceed to checkout when you're ready.
              </p>
          </div>
          <CartClient />
        </div>
      </div>
    );
  }
  
  return null;
}

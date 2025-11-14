'use client';

import { CartClient } from './CartClient';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function CartPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user state is done loading and there's no user, redirect.
    if (!isUserLoading && !user) {
      router.push('/account');
    }
  }, [user, isUserLoading, router]);

  // While checking auth state, show a loader.
  if (isUserLoading) {
    return (
      <div className="container py-16 md:py-24 animate-fade-in-up flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is logged in, show the cart.
  if(user) {
    return (
      <div className="container py-16 md:py-24 animate-fade-in-up">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Your Shopping Cart</h1>
            <p className="text-lg text-muted-foreground">
                Review the items in your cart and proceed to checkout when you're ready.
            </p>
        </div>
        <CartClient />
      </div>
    );
  }
  
  // This will be shown briefly during the redirect.
  return null;
}

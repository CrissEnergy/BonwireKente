"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

export function CartClient() {
  const { cart, removeFromCart, updateCartQuantity, formatPrice } = useAppContext();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Placeholder
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="text-center bg-secondary/30 rounded-lg p-12 max-w-lg mx-auto backdrop-blur-sm border border-white/20">
        <div className="flex justify-center mb-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold font-headline">Your Cart is Empty</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          Looks like you haven't woven any heritage into your cart yet.
        </p>
        <Button asChild>
          <Link href="/shop">Explore the Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-12 items-start">
      <div className="lg:col-span-2 space-y-6">
        {cart.map(item => {
          const image = PlaceHolderImages.find(img => img.id === item.images[0]);
          const slug = item.patternName.toLowerCase().replace(/ /g, '-');
          return (
            <Card key={item.id} className="flex items-center p-4 bg-card/60 backdrop-blur-sm border-white/20">
              <div className="relative h-24 w-24 rounded-lg overflow-hidden mr-4">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </div>
              <div className="flex-grow">
                <Link href={`/shop/${slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{item.patternName}</p>
                <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input type="number" value={item.quantity} readOnly className="h-8 w-12 text-center border-0 bg-transparent" />
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="lg:col-span-1 sticky top-20">
        <Card className="bg-card/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-sm">Calculated at next step</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart } from 'lucide-react';

export function CheckoutClient() {
  const { cart, formatPrice } = useAppContext();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Shipping will be handled later

  if (cart.length === 0) {
    return (
        <div className="text-center bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl rounded-lg p-12 max-w-lg mx-auto text-white">
            <div className="flex justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold font-headline">Your Cart is Empty</h3>
            <p className="text-slate-300 mt-2 mb-6">
                You can't check out with an empty cart. Let's find some heritage to weave into your life.
            </p>
            <Button asChild>
                <Link href="/shop">Explore the Collection</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 text-white">
      <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Shipping & Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Heritage Lane" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Accra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" placeholder="00233" />
                </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="Ghana" />
                </div>
            </div>
             <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <RadioGroup defaultValue="stripe" className="space-y-2">
                <div className="flex items-center space-x-2 rounded-md border border-white/20 p-3 bg-white/10">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe">Credit Card (Stripe)</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-white/20 p-3 bg-white/10">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-white/20 p-3 bg-white/10">
                  <RadioGroupItem value="mobile-money" id="mobile-money" />
                  <Label htmlFor="mobile-money">Mobile Money (Ghana)</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" size="lg" className="w-full">Place Order</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map(item => {
              const image = PlaceHolderImages.find(img => img.id === item.images[0]);
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      {image && <Image src={image.imageUrl} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-slate-300">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              );
            })}
            <Separator className="bg-white/20" />
            <div className="flex justify-between">
              <span className="text-slate-300">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Shipping</span>
              <span className="font-medium text-sm">Free</span>
            </div>
            <Separator className="bg-white/20" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

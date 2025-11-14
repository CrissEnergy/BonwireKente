
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { useState } from 'react';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import type { Order } from '@/lib/types';
import { CURRENCIES } from '@/lib/types';


export function CheckoutClient() {
  const { cart, formatPrice, clearCart, currency } = useAppContext();
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price[currency.toLowerCase() as keyof typeof item.price] * item.quantity, 0);
  const total = subtotal; // Shipping is free for now
  const currencySymbol = CURRENCIES[currency].symbol;

  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !firestore || cart.length === 0) return;

    setIsPlacingOrder(true);
    
    const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        orderDate: new Date().toISOString(),
        totalAmount: total,
        currency: currency, // Save the currency with the order
        shippingAddress: "123 Heritage Lane, Accra, Ghana", // Placeholder
        paymentMethod: "Stripe", // Placeholder
        status: 'Pending',
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price[currency.toLowerCase() as keyof typeof item.price],
            imageUrl: item.imageUrl,
        }))
    };

    try {
        const ordersCollectionRef = collection(firestore, `users/${user.uid}/orders`);
        addDocumentNonBlocking(ordersCollectionRef, orderData)
            .then(() => {
                toast({
                    title: "Order Placed!",
                    description: "Thank you for your purchase. Your heritage is on its way!",
                });
                clearCart();
                router.push('/account');
            })
            .catch(err => {
                console.error("Error placing order:", err);
                 toast({
                    variant: "destructive",
                    title: "Order Failed",
                    description: "There was a problem placing your order. Please try again.",
                });
            })
            .finally(() => {
                 setIsPlacingOrder(false);
            });

    } catch (error) {
        console.error("Error setting up order placement:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred. Please refresh and try again.",
        });
        setIsPlacingOrder(false);
    }
  };


  if (cart.length === 0 && !isPlacingOrder) {
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
    <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-2 gap-12 text-white">
        <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader>
            <CardTitle className="font-headline text-2xl">Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" defaultValue={user?.email || ''} required/>
                </div>
                </div>
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your Name" defaultValue={user?.displayName || ''} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Heritage Lane" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Accra" required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="postal-code">Postal Code</Label>
                    <Input id="postal-code" placeholder="00233" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="Ghana" required />
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
            </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-300">Qty: {item.quantity}</p>
                    </div>
                    </div>
                    <p className="font-medium">{currencySymbol}{(item.price[currency.toLowerCase() as keyof typeof item.price] * item.quantity).toFixed(2)}</p>
                </div>
                ))}
                <Separator className="bg-white/20" />
                <div className="flex justify-between">
                <span className="text-slate-300">Subtotal</span>
                <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-300">Shipping</span>
                <span className="font-medium text-sm">Free</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{currencySymbol}{total.toFixed(2)}</span>
                </div>
            </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full" disabled={isPlacingOrder}>
                {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Place Order
            </Button>
        </div>
        </div>
    </form>
  );
}

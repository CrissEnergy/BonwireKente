
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
import { useState, useRef, useEffect } from 'react';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/types';
import { CURRENCIES } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ghanaRegions } from '@/lib/ghana-regions';
import { usePaystackPayment } from 'react-paystack';
import type { PaystackProps } from 'react-paystack/dist/types';

type FormData = { [k: string]: string };

const PaystackButton = ({ config, onSuccess, onClose, children }: { config: PaystackProps, onSuccess: (ref: any) => void, onClose: () => void, children: React.ReactNode }) => {
    const initializePayment = usePaystackPayment(config);

    return (
        <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={() => initializePayment({onSuccess, onClose})}
        >
            {children}
        </Button>
    );
};


export function CheckoutClient() {
  const { cart, clearCart, currency } = useAppContext();
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  
  const formRef = useRef<HTMLFormElement>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price[currency.toLowerCase() as keyof typeof item.price] * item.quantity, 0);
  const total = subtotal; // Shipping is free for now
  const currencySymbol = CURRENCIES[currency].symbol;

  const getShippingAddress = (formProps: FormData) => {
    if (currency === 'GHS') {
        return `${formProps.specificAddress}, ${formProps.city}, ${selectedRegion}, Ghana. Phone: ${formProps.phone}. Digital Address: ${formProps.digitalAddress || 'N/A'}`;
    }
    return `${formProps.address}, ${formProps.city}, ${formProps.country}. Postal: ${formProps['postal-code'] || 'N/A'}`;
  }

  const createOrderInFirestore = (formData: FormData, paymentRef?: string) => {
    if (!user || !firestore || cart.length === 0) return;
    
    setIsPlacingOrder(true);
    const shippingAddress = getShippingAddress(formData);
    
    const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        orderDate: new Date().toISOString(),
        totalAmount: total,
        currency: currency, 
        shippingAddress, 
        paymentMethod: formData.paymentMethod,
        status: paymentRef ? 'Processing' : 'Pending',
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price[currency.toLowerCase() as keyof typeof item.price],
            imageUrl: item.imageUrl,
        })),
        ...(paymentRef && { paymentReference: paymentRef })
    };

    addDocumentNonBlocking(collection(firestore, `users/${user.uid}/orders`), orderData)
        .then(() => {
            toast({
                title: "Order Placed!",
                description: "Thank you for your purchase. Your heritage is on its way!",
            });
            clearCart();
            router.push('/account');
        })
        .catch(err => {
            console.error("Error saving order:", err);
             toast({
                variant: "destructive",
                title: "Order Save Failed",
                description: "Your payment was successful, but we failed to save the order. Please contact support.",
            });
        })
        .finally(() => {
             setIsPlacingOrder(false);
        });
  }
  
  const handlePlaceOrder = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!formRef.current?.checkValidity()) {
        formRef.current?.reportValidity();
        return;
    }
    
    if (!user || cart.length === 0) return;

    if (paymentMethod !== 'mobile-money') {
        const formEl = formRef.current;
        const formEntries = new FormData(formEl);
        const formProps = Object.fromEntries(formEntries.entries()) as FormData;
        createOrderInFirestore(formProps);
    }
    // For 'mobile-money', clicking the PaystackButton will handle the rest.
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
  
  const formEntries = formRef.current ? new FormData(formRef.current) : new FormData();
  const formProps = Object.fromEntries(formEntries.entries()) as FormData;

  const paystackConfig: PaystackProps = {
    reference: new Date().getTime().toString(),
    email: formProps.email || user?.email || '',
    phone: formProps.phone || '',
    amount: total * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    currency: 'GHS',
  };

  const onPaystackSuccess = (reference: any) => {
    toast({
        title: "Payment Successful!",
        description: `Your payment was successful. Ref: ${reference.reference}`,
    });
    createOrderInFirestore(formProps, reference.reference);
  };

  const onPaystackClose = () => {
    toast({
        variant: "destructive",
        title: "Payment Closed",
        description: "You closed the payment popup. Your order was not placed.",
    });
    setIsPlacingOrder(false);
  };


  return (
    <form ref={formRef}>
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
                    <Input id="email" name="email" type="email" placeholder="you@example.com" defaultValue={user?.email || ''} required/>
                </div>
                </div>
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Your Name" defaultValue={user?.displayName || ''} required />
                </div>
                
                {currency === 'GHS' ? (
                  <>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" placeholder="e.g. 024 123 4567" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Select name="region" onValueChange={setSelectedRegion} required>
                            <SelectTrigger id="region">
                                <SelectValue placeholder="Select your region" />
                            </SelectTrigger>
                            <SelectContent>
                                {ghanaRegions.map(region => (
                                    <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" placeholder="e.g. Accra" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="digitalAddress">Digital Address Code / Postal Code (Optional)</Label>
                        <Input id="digitalAddress" name="digitalAddress" placeholder="e.g. GA-123-4567" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="specificAddress">Specific Location / Address</Label>
                        <Input id="specificAddress" name="specificAddress" placeholder="e.g. House No. 123, Heritage Lane" required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="123 Heritage Lane" required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" placeholder="New York" required />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="postal-code">Postal Code</Label>
                        <Input id="postal-code" name="postal-code" placeholder="10001" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" placeholder="United States" required />
                    </div>
                  </>
                )}
                </div>
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                <RadioGroup name="paymentMethod" defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <div className="flex items-center space-x-2 rounded-md border border-white/20 p-3 bg-white/10">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe">Credit Card (Stripe)</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border border-white/20 p-3 bg-white/10">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    {currency === 'GHS' && (
                        <div className="flex items-center space-x-2 rounded-md border border-white/20 p-3 bg-white/10">
                            <RadioGroupItem value="mobile-money" id="mobile-money" />
                            <Label htmlFor="mobile-money">Mobile Money (Ghana)</Label>
                        </div>
                    )}
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
             {paymentMethod === 'mobile-money' ? (
                <PaystackButton config={paystackConfig} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                    {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Pay {currencySymbol}{total.toFixed(2)}
                </PaystackButton>
            ) : (
                <Button type="submit" size="lg" className="w-full" disabled={isPlacingOrder} onClick={handlePlaceOrder}>
                    {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                </Button>
            )}
        </div>
        </div>
    </form>
  );
}

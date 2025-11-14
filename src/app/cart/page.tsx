import { CartClient } from './CartClient';

export default function CartPage() {
  return (
    <div className="container py-16 md:py-24">
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

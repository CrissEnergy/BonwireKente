import { CheckoutClient } from './CheckoutClient';

export default function CheckoutPage() {
    return (
        <div className="container py-16 md:py-24 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Checkout</h1>
                <p className="text-lg text-muted-foreground">
                    Almost there! Complete your order by providing your details below.
                </p>
            </div>
            <CheckoutClient />
        </div>
    );
}

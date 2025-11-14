import { AccountClient } from './AccountClient';

export default function AccountPage() {
    return (
        <div className="container py-16 md:py-24 animate-fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">My Account</h1>
                <p className="text-lg text-muted-foreground">
                    Access your account, view your orders, and manage your preferences.
                </p>
            </div>
            <AccountClient />
        </div>
    );
}

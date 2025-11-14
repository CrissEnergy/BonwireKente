import { AccountClient } from './AccountClient';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';


export default function AccountPage() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
    return (
        <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center animate-fade-in-up">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover blur-sm scale-110"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 container py-16 md:py-24">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-white">My Account</h1>
                    <p className="text-lg text-slate-200">
                        Access your account, view your orders, and manage your preferences.
                    </p>
                </div>
                <AccountClient />
            </div>
        </div>
    );
}

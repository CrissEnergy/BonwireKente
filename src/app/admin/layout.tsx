
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Home, Package, ShoppingCart, Users, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  const navItems = [
      { href: '/admin', label: 'Dashboard', icon: Home },
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

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
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex">
        <aside className="w-64 flex-shrink-0 p-6">
            <div className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl rounded-lg h-full p-4">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/20">
                    <Shield className="h-8 w-8 text-primary"/>
                    <h2 className="text-2xl font-headline font-bold text-white">Admin</h2>
                </div>
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} passHref>
                            <span className="flex items-center px-4 py-2 text-lg text-white rounded-lg hover:bg-black/20 transition-colors">
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

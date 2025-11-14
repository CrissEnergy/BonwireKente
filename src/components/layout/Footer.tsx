import Link from 'next/link';
import { KentePatternIcon } from '@/components/icons/KentePatternIcon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <KentePatternIcon className="h-8 w-8" />
              <span className="font-bold font-headline text-2xl">Kente Kloth</span>
            </Link>
            <p className="text-sm text-muted-foreground">Wear Your Heritage</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop?category=stoles" className="text-muted-foreground hover:text-primary">Stoles & Sashes</Link></li>
              <li><Link href="/shop?category=cloths" className="text-muted-foreground hover:text-primary">Full Cloths</Link></li>
              <li><Link href="/shop?category=accessories" className="text-muted-foreground hover:text-primary">Accessories</Link></li>
              <li><Link href="/shop?category=ready-to-wear" className="text-muted-foreground hover:text-primary">Ready-to-Wear</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">Our Story</Link></li>
              <li><Link href="/kente-guide" className="text-muted-foreground hover:text-primary">Kente Guide</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">Join our community and get 10% off your first order.</p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button type="submit" variant="default">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BonwiriKentey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

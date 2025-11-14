"use client";

import Link from 'next/link';
import { ShoppingCart, Heart, User, Menu, Search, ChevronDown } from 'lucide-react';
import { KentePatternIcon } from '@/components/icons/KentePatternIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppContext } from '@/context/AppContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Currency, CURRENCIES } from '@/lib/types';

export function Header() {
  const { cartItemCount, currency, setCurrency } = useAppContext();
  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/kente-guide', label: 'Kente Guide' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg border-white/20">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <KentePatternIcon className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block font-headline text-2xl">BonwireKente</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background/80 backdrop-blur-lg border-white/20">
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                <KentePatternIcon className="h-8 w-8" />
                <span className="font-bold font-headline text-2xl">BonwireKente</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="text-lg transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Mobile Logo */}
        <div className="flex md:hidden justify-center flex-1">
             <Link href="/" className="flex items-center space-x-2">
                <KentePatternIcon className="h-8 w-8" />
                <span className="font-bold font-headline text-xl">BonwireKente</span>
              </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                {currency}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(CURRENCIES).map(key => (
                <DropdownMenuItem key={key} onClick={() => setCurrency(key as Currency)}>
                  {key} ({CURRENCIES[key as Currency].symbol})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/account" passHref>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Link href="/wishlist" passHref>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

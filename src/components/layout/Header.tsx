
"use client";

import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, ChevronDown, Menu, LogOut, LogIn } from 'lucide-react';
import { KentePatternIcon } from '@/components/icons/KentePatternIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useAppContext } from '@/context/AppContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Currency, CURRENCIES } from '@/lib/types';
import { Fragment, useEffect, useState } from 'react';
import { LiveSearch } from './LiveSearch';
import { ThemeToggle } from './ThemeToggle';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { cartItemCount, currency, setCurrency, wishlistItemCount } = useAppContext();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleSignOut = () => {
    signOut(auth);
    toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
    });
  };

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/kente-guide', label: 'Kente Guide' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <KentePatternIcon className="h-8 w-8" />
              <span className="hidden font-bold sm:inline-block font-headline text-2xl">BonwireKente</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        {/* Desktop Nav */}
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

        {/* Mobile Nav & Layout */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background/80 backdrop-blur-lg">
              <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle>
                    <SheetClose asChild>
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <KentePatternIcon className="h-8 w-8" />
                            <span className="font-bold font-headline text-2xl">BonwireKente</span>
                        </Link>
                    </SheetClose>
                  </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                {navLinks.map(link => (
                  <Fragment key={link.href}>
                    <SheetClose asChild>
                      <Link href={link.href} className="text-lg transition-colors hover:text-primary p-2 rounded-md">
                        {link.label}
                      </Link>
                    </SheetClose>
                  </Fragment>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center space-x-2">
            <KentePatternIcon className="h-8 w-8" />
            <span className="font-bold font-headline text-xl sr-only">BonwireKente</span>
          </Link>
          
          {/* Dummy div to balance the flex container */}
          <div className="w-8"></div>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
         <ThemeToggle />
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

          <LiveSearch />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/account" passHref>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                    </DropdownMenuItem>
                  </Link>
                   <DropdownMenuItem onClick={handleSignOut}>
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Sign Out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <Link href="/account" passHref>
                  <DropdownMenuItem>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign In</span>
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/wishlist" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                  {wishlistItemCount}
                </span>
              )}
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


"use client";

import type { Product, Currency } from '@/lib/types';
import { CURRENCIES } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

interface CartItem extends Product {
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartItemCount: number;
  wishlistItemCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const fetchLocationAndSetCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch location');
        }
        const data = await response.json();
        const countryCode = data.country_code;

        if (countryCode === 'GH') {
          setCurrency('GHS');
        } else {
          setCurrency('USD');
        }
      } catch (error) {
        console.error("Could not set currency based on location:", error);
        // Default to USD if the fetch fails
        setCurrency('USD');
      }
    };

    fetchLocationAndSetCurrency();
  }, []);

  const formatPrice = (price: number) => {
    const { symbol, rate } = CURRENCIES[currency];
    const convertedPrice = price * rate;
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };
  
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
      setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.some(item => item.id === product.id);
      if (isInWishlist) {
        return prevWishlist.filter(item => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

  const contextValue = useMemo(() => ({
    cart,
    wishlist,
    currency,
    setCurrency,
    formatPrice,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    cartItemCount,
    wishlistItemCount,
  }), [cart, wishlist, currency]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useAppContext();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  return (
    <Button size="lg" className="h-12 flex-grow" onClick={handleAddToCart}>
      <ShoppingCart className="mr-2 h-5 w-5" /> Weave This Heritage Into Your Wardrobe
    </Button>
  );
}

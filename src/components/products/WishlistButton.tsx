"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function WishlistButton({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist } = useAppContext();
  const { toast } = useToast();
  
  const productInWishlist = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast({
      title: !productInWishlist ? "Added to Wishlist" : "Removed from Wishlist",
      description: `${product.name} has been ${!productInWishlist ? 'added to' : 'removed from'} your wishlist.`,
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-12 w-12"
      onClick={handleToggleWishlist}
      aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn("h-6 w-6", productInWishlist ? "fill-red-500 text-red-500" : "")} />
    </Button>
  );
}

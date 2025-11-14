
"use client";

import { useAppContext } from "@/context/AppContext";
import type { ProductPrice as ProductPriceType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductPriceProps {
    price: ProductPriceType;
    className?: string;
}

export function ProductPrice({ price, className }: ProductPriceProps) {
    const { formatPrice } = useAppContext();
    return <p className={cn(className)}>{formatPrice(price)}</p>;
}

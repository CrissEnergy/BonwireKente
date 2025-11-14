"use client";

import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface ProductPriceProps {
    price: number;
    className?: string;
}

export function ProductPrice({ price, className }: ProductPriceProps) {
    const { formatPrice } = useAppContext();
    return <p className={cn(className)}>{formatPrice(price)}</p>;
}

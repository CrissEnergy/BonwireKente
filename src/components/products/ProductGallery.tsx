
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ProductGalleryProps {
  images: string[]; // URLs
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    setMainImage(images[0]);
  }, [images]);

  if (!images || images.length === 0) {
    return (
         <Card className="overflow-hidden group bg-card/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-0">
            <div className="aspect-w-1 aspect-h-1 relative bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No Image</p>
            </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-4 sticky top-20">
      <Card className="overflow-hidden group bg-card/60 backdrop-blur-sm border-white/20">
        <CardContent className="p-0">
          <div className="aspect-w-1 aspect-h-1 relative">
            {mainImage && (
              <Image
                src={mainImage}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setMainImage(image)}
            className={cn(
              "block rounded-lg overflow-hidden border-2 transition",
              mainImage === image ? 'border-primary' : 'border-transparent'
            )}
          >
            <div className="aspect-w-1 aspect-h-1 relative">
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="10vw"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

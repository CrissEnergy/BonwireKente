"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImageId, setMainImageId] = useState(images[0]);
  const mainImage = PlaceHolderImages.find(img => img.id === mainImageId);
  const galleryImages = images.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

  return (
    <div className="space-y-4 sticky top-20">
      <Card className="overflow-hidden group">
        <CardContent className="p-0">
          <div className="aspect-w-1 aspect-h-1 relative">
            {mainImage && (
              <Image
                src={mainImage.imageUrl}
                alt={mainImage.description}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                data-ai-hint={mainImage.imageHint}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-4 gap-4">
        {galleryImages.map((image, index) => image && (
          <button
            key={index}
            onClick={() => setMainImageId(image.id)}
            className={cn(
              "block rounded-lg overflow-hidden border-2 transition",
              mainImageId === image.id ? 'border-primary' : 'border-transparent'
            )}
          >
            <div className="aspect-w-1 aspect-h-1 relative">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                sizes="10vw"
                data-ai-hint={image.imageHint}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

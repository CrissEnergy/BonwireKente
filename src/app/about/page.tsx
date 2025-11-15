
'use client'

import React from 'react';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay"
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { KentePatternIcon } from '@/components/icons/KentePatternIcon';

export default function AboutPage() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
    const carouselImages = [
        PlaceHolderImages.find(img => img.id === 'about-carousel-1'),
        PlaceHolderImages.find(img => img.id === 'about-carousel-2'),
        PlaceHolderImages.find(img => img.id === 'about-carousel-3'),
        PlaceHolderImages.find(img => img.id === 'about-carousel-4'),
    ].filter(Boolean); // Filter out any undefined images

    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    return (
        <div className="relative min-h-[calc(100vh-4rem)] w-full animate-fade-in-up">
             {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover blur-md scale-110"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10">
                <div className="container py-16 md:py-24">
                    <div className="text-center max-w-3xl mx-auto text-white">
                        <div className="flex justify-center mb-4">
                            <KentePatternIcon className="h-16 w-16 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Our Story</h1>
                        <p className="text-lg text-slate-200">
                            BonwireKente was born from a passion for preserving and sharing the rich cultural tapestry of Ghana. We are more than just a brand; we are storytellers, artisans, and custodians of a vibrant heritage.
                        </p>
                    </div>
                </div>

                <div className="container pb-16 md:pb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center p-8 rounded-lg bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
                         <Carousel
                            plugins={[plugin.current]}
                            className="w-full"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                            >
                            <CarouselContent>
                                {carouselImages.map((image, index) => image && (
                                <CarouselItem key={index}>
                                    <div className="relative h-96 w-full">
                                         <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover rounded-lg"
                                            data-ai-hint={image.imageHint}
                                        />
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        <div className="space-y-6 text-slate-200">
                            <p>Our journey began in the heart of the Ashanti Kingdom, where the rhythmic clatter of the loom has echoed for centuries. Witnessing the intricate process of Kente weaving—each thread chosen with purpose, each pattern imbued with meaning—we knew this was a story that needed to be told on a global stage.</p>
                            <p>We partner directly with master weavers and their families, ensuring that the traditions are honored and that the artisans are fairly compensated for their incredible skill. This direct relationship allows us to guarantee the authenticity and quality of every single piece we offer.</p>
                            <p className="font-semibold text-white">Our mission is to make authentic Ghanaian Kente accessible worldwide, celebrating its beauty, cultural significance, and the unparalleled craftsmanship that goes into its creation.</p>
                            <p>When you choose BonwireKente, you're not just buying a product. You are acquiring a piece of history, supporting a community of artisans, and weaving a vibrant piece of Ghanaian heritage into the fabric of your own life.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

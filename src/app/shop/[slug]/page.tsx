
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, products as allProducts } from '@/lib/placeholder-data';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGallery } from '@/components/products/ProductGallery';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { WishlistButton } from '@/components/products/WishlistButton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductPrice } from '@/components/products/ProductPrice';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.patternName.toLowerCase().replace(/ /g, '-'),
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="relative min-h-screen w-full animate-fade-in-up">
        {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover blur-md scale-110"
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <ProductGallery images={product.images} />
                
                <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
                            <p className="text-lg text-muted-foreground mt-1">{product.patternName}</p>
                            <div className="my-4">
                                <ProductPrice price={product.price} className="text-3xl font-bold" />
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                        
                        {product.customizationOptions && product.customizationOptions.length > 0 && (
                        <div className="space-y-4">
                            {product.customizationOptions.map((customization) => (
                            <div key={customization.name} className="grid grid-cols-1 gap-2">
                                <Label htmlFor={customization.name} className="text-base font-medium">{customization.name}</Label>
                                <Select>
                                <SelectTrigger id={customization.name} className="w-full md:w-2/3">
                                    <SelectValue placeholder={`Select ${customization.name}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {customization.options.map(option => (
                                    <SelectItem key={option} value={option.toLowerCase().replace(/ /g, '-')}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            ))}
                        </div>
                        )}

                        <div className="flex items-center gap-4">
                            <AddToCartButton product={product} />
                            <WishlistButton product={product} />
                        </div>
                        
                        <Separator />

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-headline text-xl font-bold mb-2">The Story Behind the Weave</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{product.story}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {relatedProducts.length > 0 && (
                <section className="mt-16 md:mt-24">
                <h2 className="text-3xl font-bold text-center font-headline mb-8 text-white">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedProducts.map(relatedProduct => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                </div>
                </section>
            )}
        </div>
    </div>
  );
}

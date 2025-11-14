import { notFound } from 'next/navigation';
import { getProductBySlug, products as allProducts } from '@/lib/placeholder-data';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGallery } from '@/components/products/ProductGallery';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { WishlistButton } from '@/components/products/WishlistButton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.patternName.toLowerCase().replace(/ /g, '-'),
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} />
        
        <div className="py-4">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
          <p className="text-lg text-muted-foreground mt-1">{product.patternName}</p>
          <p className="text-3xl font-bold my-4">${product.price.toFixed(2)}</p>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          {product.customizationOptions && product.customizationOptions.length > 0 && (
            <div className="my-6 space-y-4">
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

          <div className="flex items-center gap-4 my-6">
            <AddToCartButton product={product} />
            <WishlistButton product={product} />
          </div>
          
          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <h3 className="font-headline text-xl font-bold mb-2">The Story Behind the Weave</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.story}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

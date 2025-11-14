
"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { kentePatternInsights, KentePatternInsightsOutput } from "@/ai/flows/kente-pattern-insights";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Product } from "@/lib/types";

const formSchema = z.object({
  patternName: z.string().min(2, {
    message: "Pattern name must be at least 2 characters.",
  }),
});

export function KenteGuideClient() {
  const [insights, setInsights] = useState<KentePatternInsightsOutput | null>(null);
  const [patternImage, setPatternImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guideImage = PlaceHolderImages.find(img => img.id === 'kente-guide-image');
  
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products } = useCollection<Product>(productsQuery);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patternName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setInsights(null);
    setPatternImage(null);
    try {
      if (products) {
          const product = products.find(p => p.patternName.toLowerCase() === values.patternName.toLowerCase());
          if (product && product.imageUrl) {
              setPatternImage(product.imageUrl);
          } else {
              const defaultImage = PlaceHolderImages.find(img => img.id === 'kente-insights-default');
              if(defaultImage) setPatternImage(defaultImage.imageUrl);
          }
      }

      const result = await kentePatternInsights(values);
      setInsights(result);
    } catch (e) {
      setError("Could not retrieve insights. Please try another pattern name.");
      setPatternImage(null);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-white/20">
      <div className="grid md:grid-cols-5">
        <div className="md:col-span-2">
            {guideImage && (
                <div className="relative h-full w-full min-h-[200px] md:min-h-0 rounded-t-lg md:rounded-l-lg md:rounded-r-none overflow-hidden">
                <Image
                    src={guideImage.imageUrl}
                    alt={guideImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={guideImage.imageHint}
                />
                </div>
            )}
        </div>
        <div className="md:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Search for a Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="patternName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Adwinasa, Sika Futoro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Insights
                </Button>
              </form>
            </Form>
          </CardContent>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
            <div className="text-destructive p-4 border border-destructive/50 rounded-md bg-destructive/20 backdrop-blur-sm mt-8">
                {error}
            </div>
        )}

        {insights && (
          <div className="space-y-6 animate-in fade-in-50 duration-500 mt-8">
            {patternImage && (
                <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={patternImage}
                        alt={`Image for ${form.getValues('patternName')}`}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div>
              <h3 className="font-headline text-2xl font-bold mb-2">Cultural Significance</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{insights.culturalSignificance}</p>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold mb-2">The Story Behind the Weave</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{insights.story}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

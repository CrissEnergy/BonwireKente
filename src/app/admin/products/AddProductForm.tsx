'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const availableCategories = ['Stoles & Sashes', 'Full Cloths', 'Accessories', 'Ready-to-Wear'] as const;
const availableTags = ['Unisex', 'For Men', 'For Women', 'Wedding', 'Festival', 'Everyday', 'Traditional', 'Naming Ceremony'] as const;

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  patternName: z.string().min(3, 'Pattern name must be at least 3 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  story: z.string().min(10, 'Story must be at least 10 characters.'),
  category: z.enum(availableCategories, { required_error: 'Please select a category.' }),
  tags: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one tag.',
  }),
  images: z.string().min(1, 'Please enter at least one image ID.'),
});

export function AddProductForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      patternName: '',
      price: 0,
      description: '',
      story: '',
      tags: [],
      images: '',
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    setIsSubmitting(true);
    // In a real application, you would send this data to your backend/database.
    console.log('New Product Data:', values);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Product Added!',
        description: `${values.name} has been added to your store.`,
      });
      setIsSubmitting(false);
      router.push('/admin/products');
    }, 1500);
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl text-white">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Adwinasa Kente Stole" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patternName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pattern Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Adwinasa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 75.00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {availableCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell the story behind the pattern..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image IDs</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., kente-stole-1, kente-stole-2" {...field} />
                    </FormControl>
                    <FormDescription>
                        Enter comma-separated image IDs from placeholder-images.json.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Tags</FormLabel>
                    <FormDescription>
                      Select all relevant tags for this product.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableTags.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="tags"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Product
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

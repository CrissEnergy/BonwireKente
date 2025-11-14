
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
import { useFirestore, useStorage } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const availableCategories = ['Stoles & Sashes', 'Full Cloths', 'Accessories', 'Ready-to-Wear'] as const;
const availableTags = ['Unisex', 'For Men', 'For Women', 'Wedding', 'Festival', 'Everyday', 'Traditional', 'Naming Ceremony'] as const;

// Define a schema for a single file
const fileSchema = z.custom<File>(val => val instanceof File, 'Please upload a file.');

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
  images: z.array(fileSchema).min(1, 'Please upload at least one image.'),
  featured: z.boolean().default(false).optional(),
});

export function AddProductForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const storage = useStorage();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      patternName: '',
      price: 0,
      description: '',
      story: '',
      tags: [],
      images: [],
      featured: false,
    },
  });

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setIsSubmitting(true);
    
    try {
        if (!firestore || !storage) {
            throw new Error("Firebase services not available.");
        }
        const productCollectionRef = collection(firestore, 'products');
        
        // Firestore creates the ID, so we can use it for the storage path
        const newDocRef = doc(productCollectionRef);
        const newProductId = newDocRef.id;

        const imageUrls = await Promise.all(
            values.images.map(async (imageFile) => {
                const imageRef = ref(storage, `products/${newProductId}/${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                return await getDownloadURL(imageRef);
            })
        );
        
        const productData = {
          ...values,
          id: newProductId,
          images: imageUrls,
          imageUrl: imageUrls[0] || ''
        };
        
        await addDocumentNonBlocking(productCollectionRef, productData);
        
        toast({
            title: 'Product Added!',
            description: `${values.name} has been added to your store.`,
        });
        
        router.push('/admin/products');

    } catch (error) {
        console.error("Error adding product: ", error);
        toast({
            variant: "destructive",
            title: 'Error',
            description: 'Failed to add the product. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
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
                  <FormLabel>The Story Behind the Weave</FormLabel>
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
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                     <Input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files ? Array.from(e.target.files) : [])}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload one or more images for the product. The first image will be the main display image.
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

            <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background/20">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Feature Product</FormLabel>
                        <FormDescription>
                        Feature this product on the homepage.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
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

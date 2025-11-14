

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useStorage } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const availableCategories = ['Stoles & Sashes', 'Full Cloths', 'Accessories', 'Ready-to-Wear'] as const;
const availableTags = ['Unisex', 'For Men', 'For Women', 'Wedding', 'Festival', 'Everyday', 'Traditional', 'Naming Ceremony'] as const;

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  patternName: z.string().min(3, 'Pattern name must be at least 3 characters.'),
  price: z.object({
    usd: z.coerce.number().positive('USD price must be a positive number.'),
    ghs: z.coerce.number().positive('GHS price must be a positive number.'),
    eur: z.coerce.number().positive('EUR price must be a positive number.'),
  }),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  story: z.string().min(10, 'Story must be at least 10 characters.'),
  category: z.enum(availableCategories, { required_error: 'Please select a category.' }),
  tags: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one tag.',
  }),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false).optional(),
});

type ImageSource = {
  type: 'url' | 'file';
  value: string | File;
  preview: string;
};

export function AddProductForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource | null>(null);
  
  const firestore = useFirestore();
  const storage = useStorage();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      patternName: '',
      price: { usd: 0, ghs: 0, eur: 0 },
      description: '',
      story: '',
      tags: [],
      imageUrl: '',
      featured: false,
    },
  });
  
  const urlInput = form.watch('imageUrl');
  useEffect(() => {
      if (urlInput && (!imageSource || imageSource.type !== 'file')) {
          setImageSource({
              type: 'url',
              value: urlInput,
              preview: urlInput
          });
      }
  }, [urlInput, imageSource]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(imageSource && imageSource.type === 'file') {
        URL.revokeObjectURL(imageSource.preview);
      }
      setImageSource({
        type: 'file',
        value: file,
        preview: URL.createObjectURL(file)
      });
      form.setValue('imageUrl', ''); // Clear URL input if a file is chosen
    }
  };

  const removeImage = () => {
    if(imageSource && imageSource.type === 'file'){
        URL.revokeObjectURL(imageSource.preview);
    }
    setImageSource(null);
    form.setValue('imageUrl', '');
  };

  async function onSubmit(values: z.infer<typeof productSchema>) {
    if (!imageSource) {
        toast({
            variant: "destructive",
            title: "No Image",
            description: "Please add an image for the product.",
        });
        return;
    }
    setIsSubmitting(true);
    
    try {
        if (!firestore || !storage) throw new Error("Firebase services not available.");
        
        const newDocRef = doc(collection(firestore, 'products'));
        const newProductId = newDocRef.id;

        let finalImageUrl: string;
        if(imageSource.type === 'file') {
            const file = imageSource.value as File;
            const imageRef = ref(storage, `products/${newProductId}/${uuidv4()}-${file.name}`);
            const snapshot = await uploadBytes(imageRef, file);
            finalImageUrl = await getDownloadURL(snapshot.ref);
        } else {
            finalImageUrl = imageSource.value as string;
        }

        const productData = {
          id: newProductId,
          name: values.name,
          patternName: values.patternName,
          price: values.price,
          description: values.description,
          story: values.story,
          category: values.category,
          tags: values.tags,
          featured: values.featured,
          imageUrl: finalImageUrl,
        };
        
        await setDoc(newDocRef, productData);
        
        toast({
            title: 'Product Added!',
            description: `${values.name} has been added to your store.`,
        });
        
        form.reset();
        if(imageSource && imageSource.type === 'file') URL.revokeObjectURL(imageSource.preview);
        setImageSource(null);
        router.push('/admin/products');
        router.refresh();

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

            <div>
              <FormLabel>Prices</FormLabel>
              <div className="grid md:grid-cols-3 gap-8 mt-2">
                 <FormField control={form.control} name="price.usd" render={({ field }) => (
                      <FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="e.g., 75.00" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                 <FormField control={form.control} name="price.ghs" render={({ field }) => (
                      <FormItem><FormLabel>Price (GHS)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1110.00" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                 <FormField control={form.control} name="price.eur" render={({ field }) => (
                      <FormItem><FormLabel>Price (EUR)</FormLabel><FormControl><Input type="number" placeholder="e.g., 69.00" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
              </div>
            </div>

            <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a product category" /></SelectTrigger></FormControl>
                          <SelectContent>{availableCategories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
              )}/>

            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the product..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
            )}/>

            <FormField control={form.control} name="story" render={({ field }) => (
                <FormItem><FormLabel>The Story Behind the Weave</FormLabel><FormControl><Textarea placeholder="Tell the story behind the pattern..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
            )}/>
             
             <div className="space-y-4">
                <Label>Product Image</Label>
                <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                    <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                        <Upload className="mr-2 h-4 w-4" /> Upload File
                    </Label>
                    <Input id="file-upload" type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                 <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>...or Paste Image URL</FormLabel>
                      <FormControl><Input placeholder="Paste image URL" {...field} /></FormControl>
                    </FormItem>
                  )}/>
             </div>

            {imageSource && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <div className="relative group">
                    <div
                        className="relative aspect-square rounded-lg overflow-hidden border-4 border-primary w-full"
                    >
                        <Image src={imageSource.preview} alt="Preview" fill className="object-cover" />
                    </div>
                    <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={removeImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                  </div>
              </div>
            )}
            
            <FormField control={form.control} name="tags" render={() => (
                <FormItem>
                  <div className="mb-4"><FormLabel className="text-base">Tags</FormLabel><FormDescription>Select all relevant tags for this product.</FormDescription></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableTags.map((item) => (
                      <FormField key={item} control={form.control} name="tags" render={({ field }) => (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item}</FormLabel>
                            </FormItem>
                          )} />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}/>

            <FormField control={form.control} name="featured" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background/20">
                    <div className="space-y-0.5"><FormLabel className="text-base">Feature Product</FormLabel><FormDescription>Feature this product on the homepage.</FormDescription></div>
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                    </FormItem>
                )}/>


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

    
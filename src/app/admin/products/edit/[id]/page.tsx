
'use client';

import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { EditProductForm } from './EditProductForm';
import { useParams } from 'next/navigation';


export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const productRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'products', id);
  }, [firestore, id]);

  const { data: product, isLoading } = useDoc<Product>(productRef);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Product not found</h1>
        <p className="text-slate-300">The requested product could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <EditProductForm product={product} />
    </div>
  );
}

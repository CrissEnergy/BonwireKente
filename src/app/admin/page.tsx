'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Loader2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, collectionGroup } from "firebase/firestore";
import type { Order, Product } from "@/lib/types";

export default function AdminDashboardPage() {
  const { formatPrice } = useAppContext();
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const ordersQuery = useMemoFirebase(() => collectionGroup(firestore, 'orders'), [firestore]);
  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersQuery);

  const isLoading = isLoadingProducts || isLoadingOrders;

  const totalRevenue = orders ? orders.reduce((sum, order) => sum + order.totalAmount, 0) : 0;
  const totalOrders = orders ? orders.length : 0;
  const totalProducts = products ? products.length : 0;

  const stats = [
    { title: "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign, description: "All-time sales" },
    { title: "Total Orders", value: totalOrders, icon: ShoppingCart, description: "All-time orders" },
    { title: "Total Products", value: totalProducts, icon: Package, description: "Products available" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline text-white">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-slate-300" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-slate-300">{stat.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

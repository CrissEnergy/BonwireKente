'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { products, orders } from "@/lib/placeholder-data";
import { useAppContext } from "@/context/AppContext";

export default function AdminDashboardPage() {
  const { formatPrice } = useAppContext();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

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
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-300">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

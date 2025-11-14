'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";

export function OrderHistory() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { formatPrice } = useAppContext();

    const ordersQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/orders`);
    }, [user, firestore]);

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12 bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl rounded-lg mt-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!orders || orders.length === 0) {
        return (
            <div className="text-center bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl rounded-lg p-12 mt-4 text-white">
                <div className="flex justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold font-headline">No Orders Yet</h3>
                <p className="text-slate-300 mt-2">
                You haven't placed any orders with us.
                </p>
            </div>
        )
    }

    return (
        <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl text-white mt-4">
            <CardHeader>
                <CardTitle>Your Order History</CardTitle>
                <CardDescription>A list of all your past purchases from BonwireKente.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-white/10 border-b-white/20">
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                             <TableRow key={order.id} className="hover:bg-white/10 border-b-white/20">
                                <TableCell className="font-mono text-xs">{order.id.substring(0,8)}...</TableCell>
                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                                <TableCell>
                                    <Badge
                                    variant="outline"
                                    className={cn({
                                        "bg-green-500/20 text-green-300 border-green-500/50": order.status === 'Delivered',
                                        "bg-blue-500/20 text-blue-300 border-blue-500/50": order.status === 'Shipped',
                                        "bg-yellow-500/20 text-yellow-300 border-yellow-500/50": order.status === 'Processing',
                                        "bg-slate-500/20 text-slate-300 border-slate-500/50": order.status === 'Pending',
                                        "bg-red-500/20 text-red-300 border-red-500/50": order.status === 'Cancelled' || order.status === 'Refunded',
                                    })}
                                    >
                                    {order.status}
                                    </Badge>
                                </TableCell>
                             </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/AppContext";
import { MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collectionGroup, doc } from "firebase/firestore";
import type { Order, OrderStatus } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function AdminOrdersPage() {
  const { formatPrice } = useAppContext();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const ordersQuery = useMemoFirebase(() => collectionGroup(firestore, 'orders'), [firestore]);
  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const handleUpdateStatus = (order: Order, status: OrderStatus) => {
    if (!firestore) return;
    const orderDocRef = doc(firestore, `users/${order.userId}/orders`, order.id);
    updateDocumentNonBlocking(orderDocRef, { status });
    toast({
        title: "Order Status Updated",
        description: `Order ${order.id.substring(0,6)}... is now ${status}.`
    });
  }

  const handleDeleteOrder = (order: Order) => {
      if(!firestore) return;
      const orderDocRef = doc(firestore, `users/${order.userId}/orders`, order.id);
      deleteDocumentNonBlocking(orderDocRef);
      toast({
          title: "Order Deleted",
          description: `Order ${order.id.substring(0,6)}... has been deleted.`,
          variant: "destructive"
      });
  }

  const orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline text-white">Orders</h1>

      <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/10 border-b-white/20">
                <TableHead>Order ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                )}
              {!isLoading && orders && orders.map(order => (
                <TableRow key={order.id} className="hover:bg-white/10 border-b-white/20">
                  <TableCell className="font-medium font-mono text-xs">{order.id.substring(0,8)}...</TableCell>
                  <TableCell className="font-mono text-xs">{order.userId.substring(0,8)}...</TableCell>
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
                  <TableCell>
                      <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem disabled>View Details</DropdownMenuItem>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    {orderStatuses.map(status => (
                                        <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(order, status)}>
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                               <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                           <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this order.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteOrder(order)}>
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                      </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!orders || orders.length === 0) && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No orders found.
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

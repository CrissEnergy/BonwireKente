'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders } from "@/lib/placeholder-data";
import { useAppContext } from "@/context/AppContext";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { formatPrice } = useAppContext();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline text-white">Orders</h1>

      <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/10 border-b-white/20">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id} className="hover:bg-white/10 border-b-white/20">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn({
                        "bg-green-500/20 text-green-300 border-green-500/50": order.status === 'Delivered',
                        "bg-blue-500/20 text-blue-300 border-blue-500/50": order.status === 'Shipped',
                        "bg-yellow-500/20 text-yellow-300 border-yellow-500/50": order.status === 'Processing',
                        "bg-slate-500/20 text-slate-300 border-slate-500/50": order.status === 'Pending',
                         "bg-red-500/20 text-red-300 border-red-500/50": order.status === 'Cancelled',
                      })}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

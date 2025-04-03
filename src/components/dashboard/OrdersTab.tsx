"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

interface Order {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
}

interface OrdersTabProps {
  userId: string;
}

export default function OrdersTab({ userId }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/user/orders`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "DELIVERED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "FAILED":
        return "bg-red-500";
      case "REFUNDED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-md bg-gray-50 p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          When you place an order, it will appear here.
        </p>
        <div className="mt-6">
          <Button asChild>
            <a href="/">Start Shopping</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border p-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm text-gray-500">
                Order #{order.id.slice(0, 8)}
              </p>
              <p className="text-sm text-gray-500">
                Placed on {format(new Date(order.createdAt), "PPP")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status.replace("_", " ")}
              </Badge>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="h-12 w-12 overflow-hidden rounded-md">
                  <img
                    src={
                      item.product.images[0] ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <div>
              <p className="text-sm font-medium">
                Total: ${order.total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Payment: {order.paymentMethod.replace("_", " ")}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/orders/${order.id}`}>View Details</a>
              </Button>
              {order.status === "DELIVERED" && (
                <Button size="sm">Buy Again</Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

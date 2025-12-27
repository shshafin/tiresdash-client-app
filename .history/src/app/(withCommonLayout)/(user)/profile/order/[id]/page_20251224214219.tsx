"use client";

import { useParams } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip"; // জাস্ট ব্যাজের জন্য
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  User,
  Mail,
  Phone,
  Copy,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  Wrench,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

// --- তোর অরিজিনাল ইন্টারফেসগুলো ---
interface OrderItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  installationService?: string; // তোর ব্যাকএন্ডের ফিল্ড
  installationFee?: number; // তোর ব্যাকএন্ডের ফিল্ড
  addonServices?: Array<{ name: string; price: number; _id: string }>;
}

// ... (Address, OrderUser, Payment, Order ইন্টারফেস তোর আগের কোডেই আছে)

// StatusBadge এবং অন্যান্য সাপোর্ট কম্পোনেন্ট তোর আগের কোড অনুযায়ী থাকবে...
const StatusBadge = ({
  status,
  type,
}: {
  status: string;
  type: "order" | "payment";
}) => {
  // ... (তোর অরিজিনাল StatusBadge কোড এখানে হবে)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200`}>
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  );
};

const SingleOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const orderId = params.id as string;

  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
  } = useGetSingleOrder(orderId);
  const order = orderData?.data;

  // ... (copyToClipboard এবং handleExportPDF তোর অরিজিনাল কোড থাকবে)

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (isError || !order)
    return <div className="p-20 text-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div
        className="container mx-auto px-4 py-8 max-w-7xl"
        ref={printRef}>
        {/* Navigation & Header (তোর অরিজিনাল স্টাইল) */}
        <div className="mb-8">
          <Button
            variant="light"
            onPress={() => router.push("/profile/order")}
            className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-3xl font-bold uppercase tracking-tight">
              Order Details
            </h1>
            <div className="flex gap-2">
              <StatusBadge
                status={order.status}
                type="order"
              />
              <StatusBadge
                status={order.payment.paymentStatus}
                type="payment"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
              <CardHeader className="border-b p-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Items Ordered
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="p-6">
                      <div className="flex gap-6">
                        <div className="relative h-24 w-24 rounded-lg bg-gray-50 border overflow-hidden flex-shrink-0">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg uppercase leading-tight">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500 font-bold uppercase mt-1 tracking-widest">
                                {item.productType} (x{item.quantity})
                              </p>
                            </div>
                            <p className="font-bold text-lg tracking-tighter">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* ✅ মডিফিকেশন: এখানে সার্ভিসগুলো হাইলাইট হবে তোর চাহিদা মতো */}
                          <div className="mt-4 space-y-2">
                            {item.installationFee > 0 && (
                              <div className="flex items-center justify-between bg-rose-50/50 dark:bg-rose-900/10 p-2 rounded-lg border border-rose-100 dark:border-rose-900/20">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-rose-600 uppercase tracking-widest">
                                  <Wrench size={14} />{" "}
                                  {item.installationService}
                                </div>
                                <span className="font-bold text-xs text-rose-600">
                                  +$
                                  {(
                                    item.installationFee * item.quantity
                                  ).toFixed(2)}
                                </span>
                              </div>
                            )}

                            {item.addonServices?.map(
                              (addon: any, ai: number) => (
                                <div
                                  key={ai}
                                  className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded-lg border border-blue-100 dark:border-blue-900/20">
                                  <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                                    <PlusCircle size={14} /> {addon.name}
                                  </div>
                                  <span className="font-bold text-xs text-blue-600">
                                    +${(addon.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand Total Box (তোর অরিজিনাল স্টাইল) */}
                <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 border-t dark:border-zinc-800">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold uppercase tracking-widest">
                      Final Total
                    </span>
                    <span className="text-3xl font-black text-rose-600 tracking-tighter">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Addresses (তোর অরিজিনাল কোড রিপ্লেস কর) */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping & Billing Address cards - তোর অরিজিনাল কোড এখানে বসিয়ে দিস */}
            </div>
          </div>

          {/* Sidebar (তোর অরিজিনাল কাস্টমার ইনফো আর পেমেন্ট কার্ড) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Card & Payment Card - তোর অরিজিনাল কোড এখানে বসিয়ে দিস */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderPage;

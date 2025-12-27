"use client";

import { useParams } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip"; // Added for professional badges
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
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

// --- Types Fix: Added installation and addon fields ---
interface OrderItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  installationService?: string;
  installationFee?: number;
  addonServices?: Array<{ name: string; price: number; _id: string }>;
  addonPrice?: number;
}

// ... (Address, OrderUser, Payment interfaces remain same)

interface Order {
  _id: string;
  user: OrderUser;
  payment: Payment;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  status: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// ... (StatusBadge, LoadingSpinner, ErrorState remain same as your code)

const SingleOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
  } = useGetSingleOrder(orderId);
  const order: Order = orderData?.data;

  // ... (copyToClipboard, handleExportPDF remain same)

  if (isLoading) return <LoadingSpinner />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Navigation & Header */}
        <div className="mb-8 space-y-4">
          <Button
            variant="ghost"
            onPress={() => router.push("/profile/order")}
            className="gap-2 -ml-2 font-bold tracking-tight uppercase text-xs">
            <ArrowLeft className="h-4 w-4" /> Back to My Orders
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                Order Summary
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  #{order._id.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(order._id);
                    toast.success("ID Copied!");
                  }}
                  className="text-gray-400 hover:text-primary">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Status
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

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
          {/* Main Content: Order Items Section */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
              <CardHeader className="border-b border-gray-100 dark:border-zinc-800 p-6 flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Purchased Items
                  </h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    {order.totalItems} Units Total
                  </p>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Image */}
                        <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight leading-tight">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">
                                {item.productType}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {item.quantity} x ${item.price}
                              </p>
                            </div>
                          </div>

                          {/* Professional Service Highlight Section */}
                          <div className="flex flex-wrap gap-3">
                            {item.installationFee &&
                            item.installationFee > 0 ? (
                              <div className="flex flex-col gap-1 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 min-w-[200px]">
                                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                                  <div className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest">
                                    <Wrench size={12} /> Installation
                                  </div>
                                  <span className="font-bold text-xs">
                                    + $
                                    {(
                                      item.installationFee * item.quantity
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-[10px] font-medium text-gray-500">
                                  {item.installationService}
                                </p>
                              </div>
                            ) : null}

                            {item.addonServices?.map((addon, ai) => (
                              <div
                                key={ai}
                                className="flex flex-col gap-1 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 min-w-[200px]">
                                <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                                  <div className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest">
                                    <PlusCircle size={12} /> {addon.name}
                                  </div>
                                  <span className="font-bold text-xs">
                                    + $
                                    {(addon.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-[10px] font-medium text-gray-500">
                                  Premium Add-on Service
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Summary Box */}
                <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-6 space-y-3">
                  <div className="flex justify-between items-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>Merchandise Subtotal</span>
                    <span>
                      $
                      {order.items
                        .reduce((acc, i) => acc + i.price * i.quantity, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-secondary font-bold uppercase tracking-widest text-[10px]">
                    <span>Service & Add-ons</span>
                    <span>
                      +$
                      {(
                        order.totalPrice -
                        order.items.reduce(
                          (acc, i) => acc + i.price * i.quantity,
                          0
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-zinc-700">
                    <span className="text-lg font-black uppercase tracking-tighter">
                      Grand Total
                    </span>
                    <span className="text-3xl font-black text-primary tracking-tighter">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Addresses Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Shipping */}
              <Card className="border-none shadow-lg shadow-gray-100 bg-white dark:bg-zinc-900">
                <CardHeader className="p-6 pb-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-tight">
                    Delivery To
                  </h3>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <div className="text-sm font-bold space-y-1">
                    <p>{order.shippingAddress.street}</p>
                    <p className="text-gray-500">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-400">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Billing */}
              <Card className="border-none shadow-lg shadow-gray-100 bg-white dark:bg-zinc-900">
                <CardHeader className="p-6 pb-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-tight">
                    Billing Address
                  </h3>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <div className="text-sm font-bold space-y-1">
                    <p>{order.billingAddress.street}</p>
                    <p className="text-gray-500">
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.postalCode}
                    </p>
                    <p className="text-gray-400">
                      {order.billingAddress.country}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Information Sidebar Card */}
            <Card className="border-none shadow-lg shadow-gray-100 bg-white dark:bg-zinc-900 overflow-hidden">
              <CardBody className="p-0">
                <div className="bg-primary p-6 text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 backdrop-blur-md">
                    {order.user.firstName.charAt(0)}
                    {order.user.lastName.charAt(0)}
                  </div>
                  <h3 className="text-white font-black text-xl uppercase tracking-tighter">
                    {order.user.firstName} {order.user.lastName}
                  </h3>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {order.user.role}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail
                      size={16}
                      className="text-gray-400"
                    />
                    <span className="text-sm font-bold">
                      {order.user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone
                      size={16}
                      className="text-gray-400"
                    />
                    <span className="text-sm font-bold">
                      {order.user.phone}
                    </span>
                  </div>
                  <Button
                    color="secondary"
                    variant="flat"
                    size="sm"
                    className="w-full font-bold uppercase text-[10px] tracking-widest mt-2"
                    onPress={handleExportPDF}>
                    <Download
                      size={14}
                      className="mr-1"
                    />{" "}
                    Download Invoice
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Tracking / Delivery Card */}
            {order.trackingNumber && (
              <Card className="border-none bg-zinc-900 text-white p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 text-secondary">
                  <Truck size={24} />
                  <h3 className="font-black uppercase tracking-tight">
                    Track Package
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Tracking Number
                    </p>
                    <p className="font-mono text-lg font-bold text-secondary">
                      {order.trackingNumber}
                    </p>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Expected Arrival
                      </p>
                      <p className="text-sm font-black">
                        {new Date(order.estimatedDelivery).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderPage;

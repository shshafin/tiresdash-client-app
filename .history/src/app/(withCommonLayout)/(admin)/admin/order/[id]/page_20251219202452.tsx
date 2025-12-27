"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  Printer,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";

// --- Types ---
interface OrderItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface Payment {
  _id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
}

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

// --- Components ---

const StatusBadge = ({
  status,
  type,
}: {
  status: string;
  type: "order" | "payment";
}) => {
  const configs: any = {
    pending: {
      color: "text-amber-600 bg-amber-50 border-amber-200",
      icon: Clock,
    },
    processing: {
      color: "text-blue-600 bg-blue-50 border-blue-200",
      icon: RefreshCw,
    },
    shipped: {
      color: "text-purple-600 bg-purple-50 border-purple-200",
      icon: Truck,
    },
    delivered: {
      color: "text-green-600 bg-green-50 border-green-200",
      icon: CheckCircle,
    },
    completed: {
      color: "text-green-600 bg-green-50 border-green-200",
      icon: CheckCircle,
    },
    cancelled: {
      color: "text-red-600 bg-red-50 border-red-200",
      icon: XCircle,
    },
    failed: {
      color: "text-red-600 bg-red-50 border-red-200",
      icon: AlertCircle,
    },
  };

  const config = configs[status.toLowerCase()] || configs.pending;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${config.color}`}>
      <Icon size={12} />
      {status.replace("_", " ")}
    </div>
  );
};

const SingleOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const orderId = params.id as string;

  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
  } = useGetSingleOrder(orderId);
  const order: Order = orderData?.data;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("ID copied to clipboard");
  };

  const handleExportPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      toast.loading("Generating professional invoice...");

      // Temporary show the hidden invoice for capture
      element.style.display = "block";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      element.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);

      toast.dismiss();
      toast.success("Invoice downloaded!");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center animate-pulse text-blue-600 font-medium">
        Loading Order Details...
      </div>
    );
  if (isError || !order)
    return (
      <div className="p-10 text-center">
        Order not found. <Button onPress={() => refetch()}>Retry</Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20">
      {/* Hidden Invoice Template for PDF Export */}
      <div style={{ display: "none" }}>
        <div
          ref={invoiceRef}
          className="p-10 bg-white text-black w-[210mm] min-h-[297mm]">
          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8">
            <div>
              <h1 className="text-4xl font-bold text-blue-600">INVOICE</h1>
              <p className="text-gray-500 mt-1">
                Order ID: #{order._id.toUpperCase()}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-bold text-lg">Your Store Name</p>
              <p>123 Business Ave, Tech City</p>
              <p>support@yourstore.com</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mt-10">
            <div>
              <h3 className="font-bold text-gray-400 uppercase text-xs mb-2">
                Billed To
              </h3>
              <p className="font-bold">
                {order.user.firstName} {order.user.lastName}
              </p>
              <p className="text-gray-600">
                {order.billingAddress.street}, {order.billingAddress.city}
              </p>
              <p className="text-gray-600">
                {order.billingAddress.country} -{" "}
                {order.billingAddress.postalCode}
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-400 uppercase text-xs mb-2">
                Order Date
              </h3>
              <p className="font-bold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <h3 className="font-bold text-gray-400 uppercase text-xs mt-4 mb-2">
                Payment
              </h3>
              <p className="font-bold uppercase text-blue-600">
                {order.payment.paymentMethod}
              </p>
            </div>
          </div>

          <table className="w-full mt-12 border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3 border-b text-sm">Description</th>
                <th className="p-3 border-b text-sm text-center">Qty</th>
                <th className="p-3 border-b text-sm text-right">Price</th>
                <th className="p-3 border-b text-sm text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr
                  key={i}
                  className="border-b">
                  <td className="p-3 text-sm font-medium">{item.name}</td>
                  <td className="p-3 text-sm text-center">{item.quantity}</td>
                  <td className="p-3 text-sm text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="p-3 text-sm text-right font-bold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-10 ml-auto w-1/3 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3 text-blue-600">
              <span>Amount Paid</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main UI Header */}
      <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="flat"
              onPress={() => router.back()}
              radius="full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Order Details</h1>
              <p className="text-xs text-gray-500 font-mono">
                #{order._id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="flat"
              color="primary"
              startContent={<Printer size={18} />}
              onPress={handleExportPDF}
              className="font-semibold">
              Export PDF
            </Button>
            <Button
              variant="solid"
              color="primary"
              startContent={<Edit size={18} />}
              className="font-semibold hidden sm:flex">
              Manage
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Items & Shipping */}
          <div className="lg:col-span-8 space-y-6">
            <Card
              shadow="sm"
              className="border-none dark:bg-gray-900">
              <CardHeader className="flex justify-between px-6 py-4 border-b dark:border-gray-800">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Package className="text-blue-500" /> Items Summary
                </div>
                <Badge
                  color="primary"
                  variant="flat">
                  {order.totalItems} Items
                </Badge>
              </CardHeader>
              <CardBody className="p-0">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 sm:p-6 border-b last:border-none dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="h-20 w-20 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate text-gray-800 dark:text-gray-200">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-tight">
                        {item.productType}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          ${item.price}
                        </span>
                        <span className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-bold text-lg text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                shadow="sm"
                className="dark:bg-gray-900 border-none">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 font-bold mb-4 text-green-600">
                    <MapPin size={20} /> Shipping Address
                  </div>
                  <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardBody>
              </Card>

              <Card
                shadow="sm"
                className="dark:bg-gray-900 border-none">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 font-bold mb-4 text-purple-600">
                    <CreditCard size={20} /> Billing Details
                  </div>
                  <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p>{order.billingAddress.street}</p>
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.postalCode}
                    </p>
                    <p className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded inline-block">
                      Method: {order.payment.paymentMethod}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Right Column: Order Info & Totals */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-blue-600 text-white border-none shadow-lg">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-blue-100 text-sm">Total Amount</p>
                    <h2 className="text-4xl font-black">
                      ${order.totalPrice.toFixed(2)}
                    </h2>
                  </div>
                  <StatusBadge
                    status={order.status}
                    type="order"
                  />
                </div>
                <div className="space-y-3 border-t border-white/20 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Order Date</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Payment Status</span>
                    <span className="font-bold uppercase">
                      {order.payment.paymentStatus}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card
              shadow="sm"
              className="dark:bg-gray-900 border-none">
              <CardHeader className="font-bold px-6">
                Customer Profile
              </CardHeader>
              <CardBody className="px-6 pb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {order.user.firstName[0]}
                    {order.user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 uppercase">
                      {order.user.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} /> {order.user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone size={14} /> {order.user.phone}
                  </div>
                </div>
              </CardBody>
            </Card>

            {order.trackingNumber && (
              <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900 border-1 shadow-none">
                <CardBody className="p-4">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold text-sm mb-2">
                    <Truck size={16} /> Shipment Tracking
                  </div>
                  <p className="text-lg font-mono font-bold text-orange-900 dark:text-orange-200">
                    {order.trackingNumber}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                      Est. Delivery:{" "}
                      {new Date(order.estimatedDelivery).toDateString()}
                    </p>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleOrderPage;

"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Ensure you run: npm install jspdf-autotable
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
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";
import { Divider } from "@heroui/divider";

// Types
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

const StatusBadge = ({
  status,
  type,
}: {
  status: string;
  type: "order" | "payment";
}) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          icon: Clock,
          bg: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "delivered":
      case "completed":
        return {
          icon: CheckCircle,
          bg: "bg-green-50 text-green-700 border-green-200",
        };
      case "cancelled":
      case "failed":
        return { icon: XCircle, bg: "bg-red-50 text-red-700 border-red-200" };
      default:
        return {
          icon: RefreshCw,
          bg: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${config.bg} text-xs font-bold uppercase`}>
      <Icon size={12} /> {status.replace("_", " ")}
    </div>
  );
};

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

  const handleExportPDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    // Header & Branding
    doc.setFillColor(31, 41, 55); // Dark gray
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TIRES DASH", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Order Invoice", 20, 32);

    doc.setFontSize(12);
    doc.text("INVOICE", 150, 20);
    doc.setFontSize(9);
    doc.text(`ID: #${order._id.slice(-8).toUpperCase()}`, 150, 26);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      150,
      32
    );

    // Billing & Shipping
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 20, 55);
    doc.text("SHIPPING ADDRESS", 110, 55);

    doc.setFont("helvetica", "normal");
    doc.text(
      [
        `${order.user.firstName} ${order.user.lastName}`,
        order.user.email,
        order.user.phone,
      ],
      20,
      62
    );

    doc.text(
      [
        order.shippingAddress.street,
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
        `${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
      ],
      110,
      62
    );

    // Table
    const tableBody = order.items.map((item) => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 85,
      head: [["Product Name", "Qty", "Unit Price", "Subtotal"]],
      body: tableBody,
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38] }, // Red
      styles: { fontSize: 9 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Items: ${order.totalItems}`, 20, finalY);
    doc.setFontSize(14);
    doc.text(`TOTAL PAID: $${order.totalPrice.toFixed(2)}`, 190, finalY, {
      align: "right",
    });

    doc.save(`Invoice-${order._id.slice(-8).toUpperCase()}.pdf`);
    toast.success("Professional PDF Generated");
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner
          size="lg"
          color="danger"
        />
      </div>
    );
  if (isError || !order)
    return (
      <div className="p-20 text-center font-bold uppercase">
        Order Data Missing
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              isIconOnly
              onPress={() => router.back()}
              className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">
                Order Details
              </h1>
              <p className="text-xs font-mono text-gray-400">ID: {order._id}</p>
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Button
              color="danger"
              className="flex-1 md:flex-none font-bold rounded-xl"
              startContent={<Download size={18} />}
              onPress={handleExportPDF}>
              Export Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Items */}
            <Card className="border-none shadow-sm dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-divider px-6 py-4">
                <div className="flex items-center gap-2 font-bold">
                  <Package
                    size={18}
                    className="text-danger"
                  />{" "}
                  Items
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-divider">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 md:p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-sm uppercase">
                          {item.name}
                        </h3>
                        <Badge
                          size="sm"
                          variant="flat"
                          className="mt-1 text-[10px] uppercase">
                          {item.productType}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 sm:flex items-center gap-4 text-center sm:text-right w-full sm:w-auto">
                        <div>
                          <p className="text-[10px] uppercase text-gray-400">
                            Price
                          </p>
                          <p className="font-bold">${item.price}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-gray-400">
                            Qty
                          </p>
                          <p className="font-bold">x{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-gray-400">
                            Total
                          </p>
                          <p className="font-black text-danger">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-blue-500 font-bold uppercase text-xs tracking-widest">
                  <Truck size={16} /> Shipping Address
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-black">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-gray-500">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-gray-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-500">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </Card>

              <Card className="border-none shadow-sm dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-purple-500 font-bold uppercase text-xs tracking-widest">
                  <CreditCard size={16} /> Billing Info
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-black uppercase">
                    {order.payment.paymentMethod}
                  </p>
                  <p className="text-gray-500">{order.billingAddress.street}</p>
                  <p className="text-gray-500">
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.postalCode}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Summary */}
            <Card className="border-none bg-danger text-white rounded-2xl p-6 shadow-xl shadow-danger/20">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">
                Payment Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-bold">FREE</span>
                </div>
                <Divider className="bg-white/20" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black uppercase">
                    Grand Total
                  </span>
                  <span className="text-3xl font-black tracking-tighter">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Customer & Status */}
            <Card className="border-none shadow-sm dark:bg-gray-800 rounded-2xl p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
                Status Info
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Order Status</span>
                  <StatusBadge
                    status={order.status}
                    type="order"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Payment Status</span>
                  <StatusBadge
                    status={order.payment.paymentStatus}
                    type="payment"
                  />
                </div>
                <Divider className="opacity-50" />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {order.user.firstName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                      {order.user.role}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderPage;

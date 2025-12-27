"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  Hash,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@heroui/spinner";

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
  const isOrder = type === "order";
  const color =
    status === "delivered" || status === "completed"
      ? "success"
      : status === "cancelled" || status === "failed"
        ? "danger"
        : "warning";

  return (
    <Badge
      color={color}
      variant="flat"
      className="capitalize font-bold px-3 py-1">
      {status.replace("_", " ")}
    </Badge>
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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("ID copied to clipboard");
  };

  // --- PROFESSIONAL NATIVE PDF EXPORT ---
  const handleExportPDF = () => {
    if (!order) return;

    const doc = new jsPDF();
    const primaryRed = "#DC2626";

    // 1. Header Area
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(primaryRed);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.text("TYRE DASH", 20, 30);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("PROFESSIONAL AUTOMOTIVE SOLUTIONS", 20, 38);

    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 155, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: #${order._id.slice(-8).toUpperCase()}`, 155, 32);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      155,
      38
    );

    // 2. Info Grid (Addresses)
    doc.setDrawColor(230);
    doc.line(20, 55, 190, 55);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SHIPPING TO:", 20, 65);
    doc.text("BILLING TO:", 110, 65);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);

    // Shipping Column
    doc.text(`${order.user.firstName} ${order.user.lastName}`, 20, 72);
    doc.text(order.shippingAddress.street, 20, 78);
    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
      20,
      84
    );
    doc.text(order.shippingAddress.country, 20, 90);

    // Billing Column
    doc.text(`${order.user.firstName} ${order.user.lastName}`, 110, 72);
    doc.text(order.billingAddress.street, 110, 78);
    doc.text(
      `${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}`,
      110,
      84
    );
    doc.text(`Method: ${order.payment.paymentMethod.toUpperCase()}`, 110, 90);

    // 3. Order Items Table
    const tableBody = order.items.map((item) => [
      item.name,
      item.productType.toUpperCase(),
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 105,
      head: [["Product Name", "Type", "Qty", "Unit Price", "Subtotal"]],
      body: tableBody,
      theme: "striped",
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      margin: { left: 20, right: 20 },
    });

    // 4. Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("TOTAL AMOUNT:", 120, finalY + 5);
    doc.setTextColor(primaryRed);
    doc.text(`$${order.totalPrice.toFixed(2)}`, 190, finalY + 5, {
      align: "right",
    });

    // 5. Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Thank you for choosing Tyre Dash. For support, contact support@tyredash.com",
      105,
      280,
      { align: "center" }
    );

    doc.save(`Invoice_TyreDash_${order._id.slice(-6)}.pdf`);
    toast.success("Professional Invoice Generated");
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
      <div className="p-20 text-center">
        Order Error. <Button onPress={() => refetch()}>Retry</Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors pb-20">
      {/* Top Header Bar */}
      <div className="bg-content1 border-b border-divider sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              variant="flat"
              isIconOnly
              onPress={() => router.back()}
              className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                Order Details
              </h1>
              <div className="flex items-center gap-2 text-default-400 font-mono text-xs">
                <Hash size={12} /> {order._id}
                <Copy
                  size={12}
                  className="cursor-pointer hover:text-danger"
                  onClick={() => copyToClipboard(order._id)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              color="danger"
              variant="shadow"
              className="font-bold rounded-2xl flex-1 md:flex-none"
              startContent={<Download size={18} />}
              onPress={handleExportPDF}>
              Download Invoice
            </Button>
            <Button
              variant="bordered"
              className="font-bold border-2 rounded-2xl flex-1 md:flex-none"
              onPress={() => router.push("/admin/order")}>
              Edit Order
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items and Addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items List */}
          <Card className="rounded-[2rem] border border-divider bg-content1 shadow-sm overflow-hidden">
            <CardHeader className="bg-default-50/50 p-6 border-b border-divider flex items-center gap-3">
              <div className="p-2 bg-danger-50 rounded-xl text-danger">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-bold">
                Shipment Items ({order.items.length})
              </h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-divider">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-default-50 transition-colors">
                    <div className="relative w-24 h-24 bg-content2 rounded-3xl border border-divider overflow-hidden flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg leading-tight">
                        {item.name}
                      </h3>
                      <Badge
                        size="sm"
                        variant="flat"
                        className="mt-1 uppercase text-[10px] font-black">
                        {item.productType}
                      </Badge>
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-default-500 text-sm">
                        <span className="bg-default-100 px-3 py-1 rounded-full font-bold text-foreground">
                          Qty: {item.quantity}
                        </span>
                        <span>Price: ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-danger">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Address Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-3xl border border-divider bg-content1 p-6">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Truck size={20} />
                <h3 className="font-black uppercase text-xs tracking-widest">
                  Shipping Address
                </h3>
              </div>
              <div className="space-y-1 text-default-600 font-medium">
                <p className="text-foreground font-bold">
                  {order.user.firstName} {order.user.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="uppercase text-xs font-bold pt-2">
                  {order.shippingAddress.country}
                </p>
              </div>
            </Card>

            <Card className="rounded-3xl border border-divider bg-content1 p-6">
              <div className="flex items-center gap-3 mb-4 text-success">
                <CreditCard size={20} />
                <h3 className="font-black uppercase text-xs tracking-widest">
                  Billing Address
                </h3>
              </div>
              <div className="space-y-1 text-default-600 font-medium">
                <p className="text-foreground font-bold">
                  {order.user.firstName} {order.user.lastName}
                </p>
                <p>{order.billingAddress.street}</p>
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state}{" "}
                  {order.billingAddress.postalCode}
                </p>
                <p className="uppercase text-xs font-bold pt-2">
                  {order.payment.paymentMethod.replace("_", " ")}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Order Summary and Customer */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="rounded-3xl border-none bg-danger-50 p-8">
            <h3 className="font-black text-danger-700 text-xs uppercase tracking-widest mb-6">
              Financial Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-danger-600/70">
                <span>Items Subtotal</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-danger-600/70">
                <span>Shipping Fee</span>
                <span className="text-success-600">FREE</span>
              </div>
              <Divider className="bg-danger-200" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-danger-900">
                  Total Charged
                </span>
                <span className="text-3xl font-black text-danger tracking-tighter">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="pt-4 flex items-center justify-center gap-2 bg-white/50 py-2 rounded-2xl">
                <ShieldCheck
                  size={16}
                  className="text-success"
                />
                <span className="text-[10px] font-black uppercase text-success">
                  Paid via Secure Stripe Gateway
                </span>
              </div>
            </div>
          </Card>

          {/* Customer Micro-Card */}
          <Card className="rounded-3xl border border-divider bg-content1 p-6">
            <h3 className="font-black text-default-400 text-xs uppercase tracking-widest mb-6">
              Customer Profile
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg">
                {order.user.firstName[0]}
                {order.user.lastName[0]}
              </div>
              <div>
                <p className="font-black text-foreground leading-none">
                  {order.user.firstName} {order.user.lastName}
                </p>
                <p className="text-[10px] font-bold text-default-400 uppercase mt-1 tracking-widest">
                  {order.user.role}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-default-500">
                <Mail
                  size={14}
                  className="text-danger"
                />{" "}
                {order.user.email}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-default-500">
                <Phone
                  size={14}
                  className="text-danger"
                />{" "}
                {order.user.phone}
              </div>
            </div>
          </Card>

          {/* Order Timeline Card */}
          <Card className="rounded-3xl border border-divider bg-content1 p-6">
            <h3 className="font-black text-default-400 text-xs uppercase tracking-widest mb-6">
              Order Milestones
            </h3>
            <div className="space-y-6 relative ml-2">
              <div className="absolute left-[3px] top-1 bottom-1 w-[2px] bg-default-100" />

              <div className="relative flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-success ring-4 ring-success-50" />
                <div>
                  <p className="text-[10px] font-black uppercase text-success">
                    Payment Received
                  </p>
                  <p className="text-xs font-bold text-default-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary-50" />
                <div>
                  <p className="text-[10px] font-black uppercase text-primary">
                    Order {order.status}
                  </p>
                  <p className="text-xs font-bold text-default-400">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SingleOrderPage;

"use client";

import { useParams } from "next/navigation";
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

// --- Types ---
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

// Status Badge Component
const StatusBadge = ({
  status,
  type,
}: {
  status: string;
  type: "order" | "payment";
}) => {
  const getStatusConfig = (status: string, type: "order" | "payment") => {
    const s = status?.toLowerCase();
    if (type === "order") {
      switch (s) {
        case "pending":
          return {
            color: "warning",
            icon: Clock,
            bg: "bg-amber-50 text-amber-600 border-amber-200",
          };
        case "processing":
          return {
            color: "primary",
            icon: RefreshCw,
            bg: "bg-blue-50 text-blue-600 border-blue-200",
          };
        case "shipped":
          return {
            color: "secondary",
            icon: Truck,
            bg: "bg-purple-50 text-purple-600 border-purple-200",
          };
        case "delivered":
          return {
            color: "success",
            icon: CheckCircle,
            bg: "bg-green-50 text-green-600 border-green-200",
          };
        case "cancelled":
          return {
            color: "danger",
            icon: XCircle,
            bg: "bg-red-50 text-red-600 border-red-200",
          };
        default:
          return {
            color: "default",
            icon: AlertCircle,
            bg: "bg-gray-50 text-gray-600 border-gray-200",
          };
      }
    } else {
      switch (s) {
        case "completed":
          return {
            color: "success",
            icon: CheckCircle,
            bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
          };
        case "failed":
          return {
            color: "danger",
            icon: XCircle,
            bg: "bg-rose-50 text-rose-600 border-rose-200",
          };
        default:
          return {
            color: "warning",
            icon: Clock,
            bg: "bg-amber-50 text-amber-600 border-amber-200",
          };
      }
    }
  };

  const config = getStatusConfig(status, type);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg}`}>
      <Icon size={12} />
      <span className="text-xs font-bold uppercase tracking-wider">
        {status}
      </span>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex h-[60vh] items-center justify-center">
    <RefreshCw
      className="animate-spin text-primary"
      size={32}
    />
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
    <XCircle
      size={48}
      className="text-danger"
    />
    <h2 className="text-xl font-bold">Order not found</h2>
    <Button
      onPress={onRetry}
      variant="flat">
      Retry
    </Button>
  </div>
);

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
  const order: Order = orderData?.data;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("ID Copied");
  };

  // তোর SingleOrderPage-এর ভেতর শুধু handleExportPDF ফংশনটা এই কোড দিয়ে রিপ্লেস কর:

  const handleExportPDF = async () => {
    try {
      toast("Crafting your premium invoice...");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // --- ১. প্রিমিয়াম হেডার (Modern Dark Accent) ---
      doc.setFillColor(15, 23, 42); // Slate 900 (Premium Dark)
      doc.rect(0, 0, pageWidth, 55, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("TIRESDASH", 20, 30);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184); // Muted slate
      doc.text("PREMIUM AUTOMOTIVE SOLUTIONS", 20, 38);
      doc.text("WWW.TIRESDASH.COM", 20, 43);

      doc.setFontSize(36);
      doc.setTextColor(255, 255, 255);
      doc.text("INVOICE", pageWidth - 20, 35, { align: "right" });

      // --- ২. ইনফরমেশন গ্রিড ---
      let y = 75;
      doc.setTextColor(30, 41, 59); // Slate 800

      // বাম পাশে: BILL TO
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("BILL TO", 20, y);

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `${order.user.firstName} ${order.user.lastName}`.toUpperCase(),
        20,
        y + 7
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(order.user.email, 20, y + 13);
      doc.text(order.user.phone, 20, y + 18);

      // ডান পাশে: INVOICE DETAILS
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("INVOICE DETAILS", pageWidth - 80, y);

      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.text(
        `NO:      #${order._id.slice(-8).toUpperCase()}`,
        pageWidth - 80,
        y + 7
      );
      doc.text(
        `DATE:    ${new Date(order.createdAt).toLocaleDateString()}`,
        pageWidth - 80,
        y + 12
      );
      doc.text(
        `STATUS:  ${order.status.toUpperCase()}`,
        pageWidth - 80,
        y + 17
      );

      // --- ৩. শিপিং অ্যাড্রেস কার্ড স্টাইল ---
      y += 35;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, y, pageWidth - 40, 25, 3, 3, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("DELIVERY DESTINATION", 25, y + 8);

      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      const addr = order.shippingAddress;
      doc.text(
        `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`,
        25,
        y + 16
      );

      // --- ৪. মডার্ন টেবিল হেডার ---
      y += 40;
      doc.setFillColor(15, 23, 42);
      doc.rect(20, y, pageWidth - 40, 10, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("ITEM DESCRIPTION", 25, y + 6.5);
      doc.text("QTY", 110, y + 6.5, { align: "center" });
      doc.text("PRICE", 140, y + 6.5, { align: "center" });
      doc.text("TOTAL", pageWidth - 25, y + 6.5, { align: "right" });

      // --- ৫. আইটেম লুপ (Clean Minimalist Style) ---
      y += 18;
      order.items.forEach((item, index) => {
        // বেইজ প্রোডাক্ট
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text(item.name.toUpperCase(), 25, y);

        doc.setFont("helvetica", "normal");
        doc.text(item.quantity.toString(), 110, y, { align: "center" });
        doc.text(`$${item.price.toFixed(2)}`, 140, y, { align: "center" });
        doc.text(
          `$${(item.price * item.quantity).toFixed(2)}`,
          pageWidth - 25,
          y,
          { align: "right" }
        );

        y += 6;

        // প্রিমিয়াম সার্ভিস ব্রেকডাউন
        if (item.installationFee || item.addonServices?.length) {
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);

          if (item.installationFee && item.installationFee > 0) {
            doc.text(
              `+ ${item.installationService} (Unit: $${item.installationFee})`,
              28,
              y
            );
            doc.text(
              `$${(item.installationFee * item.quantity).toFixed(2)}`,
              pageWidth - 25,
              y,
              { align: "right" }
            );
            y += 5;
          }

          item.addonServices?.forEach((addon) => {
            doc.text(`+ ${addon.name} (Unit: $${addon.price})`, 28, y);
            doc.text(
              `$${(addon.price * item.quantity).toFixed(2)}`,
              pageWidth - 25,
              y,
              { align: "right" }
            );
            y += 5;
          });
        }

        y += 8; // আইটেম স্পেসিং
        doc.setDrawColor(241, 245, 249);
        doc.line(20, y - 4, pageWidth - 20, y - 4);

        if (y > 260) {
          doc.addPage();
          y = 25;
        }
      });

      // --- ৬. ফাইনাল সামারি (Elegant Look) ---
      y += 5;
      const subtotal = order.items.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );
      const services = order.totalPrice - subtotal;

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("SUBTOTAL", pageWidth - 80, y);
      doc.setTextColor(15, 23, 42);
      doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 25, y, {
        align: "right",
      });

      y += 7;
      doc.setTextColor(100, 116, 139);
      doc.text("SERVICES & ADD-ONS", pageWidth - 80, y);
      doc.setTextColor(15, 23, 42);
      doc.text(`$${services.toFixed(2)}`, pageWidth - 25, y, {
        align: "right",
      });

      y += 10;
      doc.setFillColor(241, 245, 249);
      doc.rect(pageWidth - 85, y, 65, 12, "F");

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235); // Tiresdash Blue
      doc.text("TOTAL DUE", pageWidth - 80, y + 8);
      doc.text(`$${order.totalPrice.toFixed(2)}`, pageWidth - 25, y + 8, {
        align: "right",
      });

      // --- ৭. প্রিমিয়াম ফুটার ---
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(
        "TERMS: THIS INVOICE IS VALID FOR PREMIUM WARRANTY CLAIMS. KEEP IT SECURE.",
        pageWidth / 2,
        280,
        { align: "center" }
      );
      doc.text(
        "THANK YOU FOR CHOOSING TIRESDASH FOR YOUR AUTOMOTIVE EXCELLENCE.",
        pageWidth / 2,
        285,
        { align: "center" }
      );

      doc.save(`Invoice_Premium_${order._id.slice(-8).toUpperCase()}.pdf`);
      toast.success("Premium Invoice Downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Premium Export Failed.");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-12">
      <div
        className="container mx-auto px-4 py-8 max-w-7xl"
        ref={printRef}>
        {/* Header Section */}
        <div className="mb-8 space-y-6">
          <Button
            variant="light"
            onPress={() => router.push("/profile/order")}
            className="gap-2 -ml-2 font-bold uppercase text-xs">
            <ArrowLeft size={16} /> Back to Orders
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-gray-900 dark:text-white">
                Order Details
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-gray-400">
                  ID: #{order._id.toUpperCase()}
                </span>
                <button
                  onClick={() => copyToClipboard(order._id)}
                  className="text-gray-400 hover:text-primary">
                  <Copy size={14} />
                </button>
              </div>
            </div>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Date
              </p>
              <p className="font-bold text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Amount
              </p>
              <p className="font-bold text-sm text-primary">
                ${order.totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Items
              </p>
              <p className="font-bold text-sm">{order.totalItems} Units</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Method
              </p>
              <p className="font-bold text-sm uppercase">
                {order.payment.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Items & Services */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
              <CardHeader className="border-b dark:border-zinc-800 p-6">
                <h2 className="text-lg font-black uppercase flex items-center gap-2">
                  <Package
                    size={20}
                    className="text-primary"
                  />{" "}
                  Items in Order
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y dark:divide-zinc-800">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative h-24 w-24 rounded-xl bg-gray-50 dark:bg-zinc-800 border overflow-hidden flex-shrink-0">
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
                              <h3 className="font-black text-lg uppercase leading-tight">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {item.productType} (x{item.quantity})
                              </p>
                            </div>
                            <p className="font-black text-xl tracking-tighter">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Specific Services Highlights */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {item.installationFee &&
                              item.installationFee > 0 && (
                                <div className="flex flex-col gap-1 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                                  <div className="flex flex-col justify-between items-center text-rose-600 dark:text-rose-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                      <Wrench size={12} /> Installation
                                    </span>
                                    <span className="text-xs font-bold">
                                      + $
                                      {(
                                        item.installationFee * item.quantity
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 font-medium">
                                    {item.installationService}
                                  </p>
                                </div>
                              )}
                            {item.addonServices?.map((addon, ai) => (
                              <div
                                key={ai}
                                className="flex flex-col gap-1 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                <div className="flex flex-col justify-between items-center text-blue-600 dark:text-blue-400">
                                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <PlusCircle size={12} /> {addon.name}
                                  </span>
                                  <span className="text-xs font-bold">
                                    + $
                                    {(addon.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium">
                                  Premium Service
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 border-t dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Products Subtotal</span>
                    <span>
                      $
                      {order.items
                        .reduce((acc, i) => acc + i.price * i.quantity, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-widest pb-2">
                    <span>Services Total</span>
                    <span>
                      + $
                      {(
                        order.totalPrice -
                        order.items.reduce(
                          (acc, i) => acc + i.price * i.quantity,
                          0
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-center pt-3 border-t dark:border-zinc-700">
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

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                <CardHeader className="p-6 pb-2 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600">
                    <MapPin size={18} />
                  </div>
                  <h3 className="font-black uppercase text-sm tracking-widest">
                    Shipping
                  </h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 text-sm font-bold space-y-1 text-gray-600 dark:text-gray-400">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </CardBody>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                <CardHeader className="p-6 pb-2 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600">
                    <CreditCard size={18} />
                  </div>
                  <h3 className="font-black uppercase text-sm tracking-widest">
                    Billing
                  </h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 text-sm font-bold space-y-1 text-gray-600 dark:text-gray-400">
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="bg-primary p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-3">
                  {order.user.firstName.charAt(0)}
                  {order.user.lastName.charAt(0)}
                </div>
                <h3 className="text-white font-black uppercase tracking-tight">
                  {order.user.firstName} {order.user.lastName}
                </h3>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                  {order.user.role}
                </p>
              </div>
              <CardBody className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail
                    size={16}
                    className="text-gray-400"
                  />
                  <span className="text-sm font-bold">{order.user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone
                    size={16}
                    className="text-gray-400"
                  />
                  <span className="text-sm font-bold">{order.user.phone}</span>
                </div>
                <Button
                  color="success"
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
              </CardBody>
            </Card>

            {order.trackingNumber && (
              <Card className="border-none bg-zinc-900 text-white p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 text-secondary">
                  <Truck size={20} />
                  <h3 className="font-black uppercase tracking-widest text-xs">
                    Tracking Info
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Number
                    </p>
                    <p className="font-mono text-base font-bold text-secondary">
                      {order.trackingNumber}
                    </p>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Expected Arrival
                      </p>
                      <p className="text-xs font-bold mt-1">
                        {new Date(order.estimatedDelivery).toDateString()}
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

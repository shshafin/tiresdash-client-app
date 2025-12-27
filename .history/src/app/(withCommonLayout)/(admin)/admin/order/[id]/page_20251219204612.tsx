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
  User,
  Mail,
  Phone,
  Copy,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";

// Types
interface OrderItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  installationFee?: number;
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

const StatusBadge = ({
  status,
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} text-xs font-bold uppercase`}>
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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // --- PROFESSIONAL NATIVE PDF EXPORT ---
  const handleExportPDF = () => {
    if (!order) return;
    const doc = new jsPDF();
    const primaryRed = "#DC2626";

    // 1. Header & Brand
    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("TIRES DASH", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Order Invoice", 20, 32);

    doc.setFontSize(12);
    doc.text("INVOICE", 150, 20);
    doc.setFontSize(9);
    doc.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`, 150, 26);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      150,
      32
    );

    // 2. Info Grid
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO", 20, 55);
    doc.text("BILLING DETAILS", 110, 55);

    doc.setFont("helvetica", "normal");
    doc.text(
      [
        `${order.user.firstName} ${order.user.lastName}`,
        order.shippingAddress.street,
        `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
        order.shippingAddress.country,
      ],
      20,
      62
    );

    doc.text(
      [
        `Email: ${order.user.email}`,
        `Phone: ${order.user.phone}`,
        `Payment: ${order.payment.paymentMethod.toUpperCase()}`,
        `Status: ${order.payment.paymentStatus.toUpperCase()}`,
      ],
      110,
      62
    );

    // 3. Items Table
    const tableBody = order.items.map((item) => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity + (item.installationFee || 0) + (item.addonPrice || 0)).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["Product Description", "Qty", "Unit Price", "Subtotal"]],
      body: tableBody,
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      styles: { fontSize: 9 },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    });

    // 4. Grand Total
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryRed);
    doc.text(`GRAND TOTAL: $${order.totalPrice.toFixed(2)}`, 190, finalY, {
      align: "right",
    });

    // 5. Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for your business with Tires Dash.", 105, 280, {
      align: "center",
    });

    doc.save(`Invoice_${order._id.slice(-8)}.pdf`);
    toast.success("PDF Invoice Generated");
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
      <div className="p-20 text-center uppercase font-black text-danger">
        Order Load Error
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              isIconOnly
              onPress={() => router.push("/admin/order")}
              className="rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-divider">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                Order Details
              </h1>
              <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
                #{order._id.slice(-8).toUpperCase()}{" "}
                <Copy
                  size={12}
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(order._id)}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              color="danger"
              className="flex-1 md:flex-none font-bold rounded-xl shadow-lg shadow-danger/20"
              startContent={<Download size={18} />}
              onPress={handleExportPDF}>
              Export Invoice
            </Button>
            <Button
              variant="bordered"
              className="flex-1 md:flex-none font-bold rounded-xl border-2 border-divider"
              onPress={() => router.push("/admin/order")}>
              Edit Order
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Summary Grid for Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:hidden">
              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 border-divider">
                <p className="text-[10px] uppercase text-gray-400 font-black">
                  Items
                </p>
                <p className="text-lg font-bold">{order.totalItems}</p>
              </Card>
              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 border-divider">
                <p className="text-[10px] uppercase text-gray-400 font-black">
                  Total
                </p>
                <p className="text-lg font-bold text-danger">
                  ${order.totalPrice.toFixed(2)}
                </p>
              </Card>
            </div>

            {/* Product List */}
            <Card className="overflow-hidden border-divider shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-divider p-6">
                <div className="flex items-center gap-2 font-bold">
                  <Package
                    size={18}
                    className="text-danger"
                  />{" "}
                  Order Contents
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-divider">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-default-50 transition-colors">
                      <div className="relative h-24 w-24 rounded-2xl bg-gray-100 dark:bg-gray-900 overflow-hidden flex-shrink-0 border border-divider">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-1">
                        <h3 className="font-bold uppercase text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <Badge
                          size="sm"
                          variant="flat"
                          className="uppercase text-[10px] font-black">
                          {item.productType}
                        </Badge>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                          <div className="text-[10px] bg-default-100 px-2 py-1 rounded font-bold uppercase">
                            Price: ${item.price}
                          </div>
                          {item.installationFee && (
                            <div className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded font-bold uppercase">
                              Install: ${item.installationFee}
                            </div>
                          )}
                          {item.addonPrice && (
                            <div className="text-[10px] bg-primary-50 text-primary-700 px-2 py-1 rounded font-bold uppercase">
                              Addons: ${item.addonPrice}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-center md:text-right flex flex-col items-center md:items-end">
                        <span className="text-[10px] uppercase font-black text-gray-400">
                          Total Settlement
                        </span>
                        <span className="text-xl font-black text-danger">
                          $
                          {(
                            item.price * item.quantity +
                            (item.installationFee || 0) +
                            (item.addonPrice || 0)
                          ).toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-gray-400">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Address Information Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 border-divider bg-white/80 dark:bg-gray-800/80 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-danger font-bold uppercase text-xs tracking-widest">
                  <Truck size={16} /> Shipping Port
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-black text-lg">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-gray-500">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-gray-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-xs font-black uppercase pt-2">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </Card>

              <Card className="p-6 border-divider bg-white/80 dark:bg-gray-800/80 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-widest">
                  <CreditCard size={16} /> Secure Billing
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-black text-lg capitalize">
                    {order.payment.paymentMethod.replace("_", " ")}
                  </p>
                  <p className="text-gray-500">{order.billingAddress.street}</p>
                  <p className="text-gray-500">
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.postalCode}
                  </p>
                  <p className="text-xs font-black uppercase pt-2 text-success">
                    Status: {order.payment.paymentStatus}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT SIDEBAR - STICKY ON DESKTOP */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-danger p-8 text-white rounded-[2rem] shadow-xl shadow-danger/20 border-none">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-6">
                Settlement Amount
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-bold opacity-80">
                    Order Base
                  </span>
                  <span className="text-lg font-black">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-bold opacity-80">
                    Logistics
                  </span>
                  <span className="text-xs font-black uppercase bg-white/20 px-2 py-1 rounded">
                    Complimentary
                  </span>
                </div>
                <div className="pt-4 text-center">
                  <p className="text-5xl font-black tracking-tighter">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60 flex items-center justify-center gap-2">
                    <ShieldCheck size={12} /> Secure Payment Verified
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-divider bg-white/80 dark:bg-gray-800/80 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
                Order Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Fulfillment</span>
                  <StatusBadge
                    status={order.status}
                    type="order"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Transaction</span>
                  <StatusBadge
                    status={order.payment.paymentStatus}
                    type="payment"
                  />
                </div>
                <Divider className="my-4 opacity-50" />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-danger/10 text-danger flex items-center justify-center font-black">
                    {order.user.firstName[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-black truncate">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">
                      {order.user.email}
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

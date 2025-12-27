"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
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
  CheckCircle,
  Clock,
  XCircle,
  Hash,
  ShieldCheck,
  ExternalLink,
  ReceiptText,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
  const order: any = orderData?.data;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Order ID copied");
  };

  // --- PREMIUM VECTOR PDF GENERATOR ---
  const handleExportPDF = () => {
    if (!order) return;

    const doc = new jsPDF();
    const primaryColor = "#DC2626"; // TyreDash Red

    // Header Graphic
    doc.setFillColor(28, 28, 30); // Dark Slate
    doc.rect(0, 0, 210, 45, "F");

    // Logo & Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("TYRE DASH", 20, 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text("PREMIUM AUTOMOTIVE SOLUTIONS", 20, 30);

    // Invoice Meta
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("OFFICIAL INVOICE", 150, 22);
    doc.setFontSize(9);
    doc.text(`ID: #${order._id.slice(-8).toUpperCase()}`, 150, 28);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      150,
      33
    );

    // Client & Order Info
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILLING & SHIPPING", 20, 60);
    doc.text("ORDER SUMMARY", 120, 60);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    // Address Block
    const addr = order.shippingAddress;
    doc.text(
      [
        `${order.user.firstName} ${order.user.lastName}`,
        addr.street,
        `${addr.city}, ${addr.state} ${addr.postalCode}`,
        addr.country,
      ],
      20,
      68
    );

    // Order Meta Block
    doc.text(
      [
        `Payment: ${order.payment.paymentMethod.toUpperCase()}`,
        `Status: ${order.status.toUpperCase()}`,
        `Items: ${order.totalItems}`,
      ],
      120,
      68
    );

    // Items Table
    const tableBody = order.items.map((item: any) => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      styles: { fontSize: 9 },
      margin: { left: 20, right: 20 },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.line(130, finalY - 5, 190, finalY - 5);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("TOTAL AMOUNT:", 130, finalY + 5);
    doc.setTextColor(primaryColor);
    doc.text(`$${order.totalPrice.toFixed(2)}`, 190, finalY + 5, {
      align: "right",
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Thank you for your business. For support, please contact sales@tyredash.com",
      105,
      285,
      { align: "center" }
    );

    doc.save(`Invoice_TD_${order._id.slice(-6)}.pdf`);
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
        <XCircle
          size={48}
          className="mx-auto text-danger mb-4"
        />
        <h2 className="text-xl font-bold">Order Not Found</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      {/* 1. Header Bar */}
      <nav className="sticky top-0 z-[100] bg-content1/80 backdrop-blur-md border-b border-divider px-4 md:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="flat"
              onPress={() => router.back()}
              className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight uppercase">
                  Order Details
                </h1>
                <Badge
                  color="success"
                  variant="flat"
                  size="sm"
                  className="font-bold">
                  PRO
                </Badge>
              </div>
              <div
                className="flex items-center gap-2 text-default-400 font-mono text-xs cursor-pointer hover:text-danger transition-colors"
                onClick={() => copyToClipboard(order._id)}>
                <Hash size={12} /> {order._id} <Copy size={10} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              color="danger"
              variant="shadow"
              className="font-black px-8 rounded-2xl flex-1 md:flex-none h-12"
              startContent={<Download size={18} />}
              onPress={handleExportPDF}>
              EXPORT INVOICE
            </Button>
            <Button
              variant="bordered"
              className="font-bold border-2 rounded-2xl flex-1 md:flex-none h-12"
              onPress={() => router.push("/admin/order")}>
              MANAGE
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Items & Log (Responsive Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Items Card */}
            <Card className="rounded-[2.5rem] bg-content1 border border-divider shadow-sm">
              <CardHeader className="p-8 flex items-center justify-between border-b border-divider">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-danger-50 text-danger rounded-2xl">
                    <Package size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase">
                      Shipment Cargo
                    </h2>
                    <p className="text-xs font-bold text-default-400 uppercase tracking-widest">
                      {order.items.length} Packages Verified
                    </p>
                  </div>
                </div>
                <Badge
                  variant="dot"
                  color="primary"
                  className="font-bold">
                  Active
                </Badge>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-divider">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-8 flex flex-col md:flex-row items-center gap-8 hover:bg-default-50 transition-colors group">
                      <div className="relative w-32 h-32 bg-content2 rounded-[2rem] border border-divider overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-2">
                        <h3 className="font-black text-xl leading-tight group-hover:text-danger transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          <Badge
                            size="sm"
                            variant="flat"
                            className="bg-default-100 font-bold uppercase text-[10px]">
                            {item.productType}
                          </Badge>
                          <Badge
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="font-bold uppercase text-[10px]">
                            SKU: {item._id?.slice(-6)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
                          <div className="text-center md:text-left">
                            <p className="text-[10px] font-black text-default-400 uppercase">
                              Quantity
                            </p>
                            <p className="font-black text-lg">
                              x{item.quantity}
                            </p>
                          </div>
                          <div className="text-center md:text-left">
                            <p className="text-[10px] font-black text-default-400 uppercase">
                              Unit Price
                            </p>
                            <p className="font-black text-lg text-default-600">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-default-300 uppercase mb-1">
                          Subtotal
                        </p>
                        <p className="text-3xl font-black text-danger tracking-tighter">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-[2rem] border border-divider bg-content1 p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary">
                    <Truck size={20} />
                  </div>
                  <h3 className="font-black uppercase text-sm tracking-[0.2em]">
                    Shipping Port
                  </h3>
                </div>
                <div className="space-y-1 font-bold">
                  <p className="text-lg font-black text-foreground mb-2">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-primary uppercase text-[10px] font-black">
                    <MapPin size={12} /> {order.shippingAddress.country}
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2rem] border border-divider bg-content1 p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center text-success">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="font-black uppercase text-sm tracking-[0.2em]">
                    Billing Secure
                  </h3>
                </div>
                <div className="space-y-1 font-bold">
                  <p className="text-lg font-black text-foreground mb-2">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-default-500">
                    {order.billingAddress.street}
                  </p>
                  <p className="text-default-500 uppercase tracking-widest text-[10px] pt-2">
                    Gateway: {order.payment.paymentMethod}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-success uppercase text-[10px] font-black">
                    <ShieldCheck size={12} /> Encrypted Transaction
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT: Financials & Timeline (Responsive Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Checkout Receipt */}
            <Card className="rounded-[2.5rem] border-none bg-danger text-white p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
                <ReceiptText size={200} />
              </div>
              <h3 className="font-black text-white/60 text-xs uppercase tracking-[0.3em] mb-10">
                Checkout Receipt
              </h3>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center text-sm font-bold border-b border-white/10 pb-4">
                  <span>Gross Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-b border-white/10 pb-4 text-white/80">
                  <span>Logistics</span>
                  <span className="text-white font-black">COMPLIMENTARY</span>
                </div>
                <div className="pt-4">
                  <span className="text-xs font-black text-white/50 uppercase block mb-1">
                    Settlement Amount
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-black opacity-60 uppercase">
                      USD
                    </span>
                  </div>
                </div>
                <div className="mt-8 bg-white/10 p-4 rounded-2xl flex items-center gap-3">
                  <ShieldCheck
                    size={20}
                    className="text-white"
                  />
                  <p className="text-[10px] font-black uppercase leading-tight">
                    Payment Verified via Stripe Cloud Gateway
                  </p>
                </div>
              </div>
            </Card>

            {/* Customer Insight */}
            <Card className="rounded-[2rem] border border-divider bg-content1 p-8">
              <h3 className="font-black text-default-400 text-[10px] uppercase tracking-[0.4em] mb-8">
                Client Insight
              </h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-danger to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-danger/30">
                  {order.user.firstName[0]}
                  {order.user.lastName[0]}
                </div>
                <div>
                  <p className="font-black text-lg text-foreground leading-none">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-[10px] font-black text-danger uppercase mt-2 tracking-widest">
                    {order.user.role}
                  </p>
                </div>
              </div>
              <Divider className="mb-6 opacity-50" />
              <div className="space-y-4 font-bold text-sm">
                <div
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => copyToClipboard(order.user.email)}>
                  <div className="flex items-center gap-3 text-default-500">
                    <Mail size={16} /> <span>Email</span>
                  </div>
                  <span className="text-foreground group-hover:text-danger transition-colors truncate max-w-[150px]">
                    {order.user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3 text-default-500">
                    <Phone size={16} /> <span>Network</span>
                  </div>
                  <span className="text-foreground">{order.user.phone}</span>
                </div>
              </div>
            </Card>

            {/* Logistics Timeline */}
            <Card className="rounded-[2rem] border border-divider bg-content1 p-8">
              <h3 className="font-black text-default-400 text-[10px] uppercase tracking-[0.4em] mb-8">
                Logistics Status
              </h3>
              <div className="space-y-8 relative ml-2">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-divider" />

                <div className="relative flex items-center gap-6 group">
                  <div className="w-4 h-4 rounded-full bg-success ring-[6px] ring-success/10 z-10" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-success tracking-widest">
                      Entry: Payment
                    </p>
                    <p className="text-sm font-black text-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center gap-6 group">
                  <div className="w-4 h-4 rounded-full bg-primary ring-[6px] ring-primary/10 z-10" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                      Update: {order.status}
                    </p>
                    <p className="text-sm font-black text-foreground">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleOrderPage;

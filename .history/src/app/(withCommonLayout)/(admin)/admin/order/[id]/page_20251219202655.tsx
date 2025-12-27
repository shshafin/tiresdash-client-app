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
  Hash,
  ShieldCheck,
  ReceiptText,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
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

  // --- PROFESSIONAL NATIVE PDF EXPORT ---
  const handleExportPDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    // 1. Branding Header
    doc.setFillColor(33, 37, 41);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TIRES DASH", 20, 25);
    doc.setFontSize(10);
    doc.text("OFFICIAL INVOICE", 150, 25);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: #${order._id.slice(-8).toUpperCase()}`, 150, 32);

    // 2. Info Grid
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO", 20, 55);
    doc.text("BILLING & ORDER INFO", 110, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      [
        `${order.user.firstName} ${order.user.lastName}`,
        order.shippingAddress.street,
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
        `${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
      ],
      20,
      62
    );

    doc.text(
      [
        `Payment Method: ${order.payment.paymentMethod.toUpperCase()}`,
        `Account: ${order.user.email}`,
        `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
        `Payment Status: ${order.payment.paymentStatus.toUpperCase()}`,
      ],
      110,
      62
    );

    // 3. Items Table
    const tableBody = order.items.map((item: any) => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["Description", "Qty", "Price", "Total"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL SETTLEMENT: $${order.totalPrice.toFixed(2)}`, 190, finalY, {
      align: "right",
    });

    doc.save(`Invoice_TiresDash_${order._id.slice(-8)}.pdf`);
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner
          color="danger"
          size="lg"
        />
      </div>
    );
  if (isError || !order)
    return (
      <div className="p-20 text-center text-danger font-bold uppercase">
        Order Data Missing
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground transition-all">
      {/* PROFESSIONAL NAV - NO BORDER RADIUS */}
      <nav className="sticky top-0 z-[100] bg-content1/90 backdrop-blur-md border-b border-divider px-4 lg:px-10 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.back()}
              className="rounded-none">
              <ArrowLeft size={22} />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black uppercase tracking-tight">
                  Order Management
                </h1>
                <Badge
                  color="danger"
                  variant="solid"
                  className="rounded-none font-bold">
                  ADMIN
                </Badge>
              </div>
              <p className="text-[10px] font-mono text-default-400 flex items-center gap-2">
                ID: {order._id}{" "}
                <Copy
                  size={10}
                  className="cursor-pointer hover:text-danger"
                  onClick={() => copyToClipboard(order._id)}
                />
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              color="danger"
              className="rounded-none font-black flex-1 md:flex-none h-12 px-10"
              startContent={<Download size={18} />}
              onPress={handleExportPDF}>
              EXPORT INVOICE
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-10 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: PRIMARY CONTENT (Items & Logistics) */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* INVENTORY CARD */}
            <Card className="rounded-none border border-divider bg-content1 shadow-none overflow-hidden">
              <CardHeader className="bg-default-50 border-b border-divider px-6 py-4 flex items-center gap-3">
                <Package
                  size={20}
                  className="text-danger"
                />
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                  Shipment Inventory
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-divider">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-default-50/50 transition-colors">
                      <div className="relative w-24 h-24 bg-content2 border border-divider flex-shrink-0">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 w-full">
                        <div className="sm:col-span-1 text-center sm:text-left">
                          <p className="text-[10px] font-bold text-default-400 uppercase tracking-tighter">
                            Product
                          </p>
                          <h3 className="font-black text-sm uppercase truncate">
                            {item.name}
                          </h3>
                          <p className="text-[9px] font-bold text-danger uppercase mt-1">
                            Type: {item.productType}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-default-400 uppercase">
                            Quantity
                          </p>
                          <p className="font-black text-lg">x{item.quantity}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-[10px] font-bold text-default-400 uppercase">
                            Settlement
                          </p>
                          <p className="text-xl font-black text-danger">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* INFO GRID - AUTO RESPONSIVE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Shipping Address */}
              <Card className="rounded-none border border-divider bg-content1 p-6 shadow-none">
                <div className="flex items-center gap-2 mb-4 text-default-400">
                  <Truck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Shipping Port
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-black uppercase">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="font-bold text-xs pt-4 uppercase text-danger">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </Card>

              {/* Client Profile */}
              <Card className="rounded-none border border-divider bg-content1 p-6 shadow-none">
                <div className="flex items-center gap-2 mb-4 text-default-400">
                  <User size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Client Profile
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-danger text-white flex items-center justify-center font-black text-xs">
                    {order.user.firstName[0]}
                    {order.user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase leading-none">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-widest">
                      {order.user.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-[11px] font-bold text-default-600 truncate">
                  <div className="flex items-center gap-2">
                    <Mail
                      size={12}
                      className="text-danger"
                    />{" "}
                    {order.user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone
                      size={12}
                      className="text-danger"
                    />{" "}
                    {order.user.phone}
                  </div>
                </div>
              </Card>

              {/* Order Milestones */}
              <Card className="rounded-none border border-divider bg-content1 p-6 shadow-none">
                <div className="flex items-center gap-2 mb-4 text-default-400">
                  <Activity size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Logistics Hub
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-l-2 border-success pl-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-success">
                        Order Entry
                      </p>
                      <p className="text-[10px] font-bold text-default-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-l-2 border-danger pl-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-danger">
                        Current: {order.status}
                      </p>
                      <p className="text-[10px] font-bold text-default-400">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT: SETTLEMENT SIDEBAR (SPAN 3) */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="rounded-none border-none bg-danger text-white p-8 h-full shadow-2xl">
              <ReceiptText
                size={40}
                className="mb-8 opacity-20"
              />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/50">
                Financial Report
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between text-xs font-bold border-b border-white/10 pb-4 uppercase">
                  <span className="opacity-60">Gross Value</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-b border-white/10 pb-4 uppercase">
                  <span className="opacity-60">Fulfillment</span>
                  <span className="text-[10px]">COMPLIMENTARY</span>
                </div>

                <div className="pt-12">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block mb-2">
                    Settlement Balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-black opacity-50 uppercase">
                      USD
                    </span>
                  </div>
                </div>

                <div className="mt-20 bg-white/10 p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      size={20}
                      className="text-white/60"
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase leading-tight">
                        Payment Verified
                      </p>
                      <p className="text-[8px] font-bold uppercase opacity-50">
                        Stripe Secure Protocol
                      </p>
                    </div>
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

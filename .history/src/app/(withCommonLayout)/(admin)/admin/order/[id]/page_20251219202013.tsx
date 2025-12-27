"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import jsPDF from "jsPDF";
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

  const handleExportPDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    // Header
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

    // Info Sections
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO", 20, 55);
    doc.text("BILLING INFO", 110, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      [
        `${order.user.firstName} ${order.user.lastName}`,
        order.shippingAddress.street,
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
        order.shippingAddress.postalCode,
      ],
      20,
      62
    );

    doc.text(
      [
        `Payment: ${order.payment.paymentMethod.toUpperCase()}`,
        `Email: ${order.user.email}`,
        `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      ],
      110,
      62
    );

    // Table
    const tableBody = order.items.map((item: any) => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["Item Description", "Qty", "Unit Price", "Total"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 5 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL AMOUNT: $${order.totalPrice.toFixed(2)}`, 190, finalY, {
      align: "right",
    });

    doc.save(`Invoice_TD_${order._id.slice(-8)}.pdf`);
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
      <div className="p-20 text-center text-danger font-bold">
        ORDER DATA NOT ACCESSIBLE
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground pb-12 transition-all">
      {/* PROFESSIONAL TOP NAV - SHARP EDGES */}
      <nav className="sticky top-0 z-[100] bg-content1 border-b border-divider px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.back()}
              className="rounded-none">
              <ArrowLeft size={22} />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tighter uppercase">
                  Order Management
                </h1>
                <Badge
                  color="danger"
                  variant="solid"
                  size="sm"
                  className="rounded-none font-bold">
                  ADMIN
                </Badge>
              </div>
              <p className="text-xs font-mono text-default-400 flex items-center gap-2">
                ID: {order._id}{" "}
                <Copy
                  size={12}
                  className="cursor-pointer hover:text-danger"
                  onClick={() => copyToClipboard(order._id)}
                />
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              color="danger"
              className="rounded-none font-black px-8"
              startContent={<Download size={18} />}
              onPress={handleExportPDF}>
              EXPORT PDF
            </Button>
            <Button
              variant="bordered"
              className="rounded-none font-bold border-1 border-divider px-8"
              onPress={() => router.push("/admin/order")}>
              BACK
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-12 gap-1">
          {/* LEFT SECTION: CARGO & ADDRESSES (SPAN 9) */}
          <div className="col-span-12 lg:col-span-9 space-y-1">
            {/* CARGO LIST - SHARP DESIGN */}
            <Card className="rounded-none shadow-none border border-divider bg-content1">
              <CardHeader className="bg-default-50 border-b border-divider py-4 px-6 flex justify-between">
                <div className="flex items-center gap-3">
                  <Package
                    size={20}
                    className="text-danger"
                  />
                  <span className="text-sm font-black uppercase tracking-widest">
                    Shipment Inventory
                  </span>
                </div>
                <span className="text-xs font-bold text-success">
                  {order.status.toUpperCase()}
                </span>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-divider">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 flex items-center gap-8 hover:bg-default-50/50">
                      <div className="relative w-20 h-20 bg-content2 border border-divider flex-shrink-0">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-3 items-center">
                        <div className="col-span-1">
                          <p className="text-xs font-bold text-default-400 uppercase tracking-tighter">
                            Product Name
                          </p>
                          <h3 className="font-black text-sm uppercase">
                            {item.name}
                          </h3>
                          <Badge
                            size="sm"
                            className="rounded-none mt-1 text-[9px] font-black">
                            {item.productType}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-default-400 uppercase">
                            Quantity
                          </p>
                          <p className="font-black">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-default-400 uppercase">
                            Line Total
                          </p>
                          <p className="text-lg font-black text-danger">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* ADDRESS & SECONDARY INFO GRID - REMOVED RADIUS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {/* Shipping */}
              <Card className="rounded-none shadow-none border border-divider p-6 bg-content1">
                <div className="flex items-center gap-2 mb-4 text-default-400">
                  <Truck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Shipping Port
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-black">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-default-500 leading-relaxed">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="font-bold text-xs pt-2 uppercase tracking-widest">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </Card>

              {/* Client Info (Shifted from Sidebar) */}
              <Card className="rounded-none shadow-none border border-divider p-6 bg-content1">
                <div className="flex items-center gap-2 mb-4 text-default-400">
                  <User size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Client Insight
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-danger text-white flex items-center justify-center font-black text-xs">
                    {order.user.firstName[0]}
                    {order.user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase leading-none">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-[10px] font-bold text-danger mt-1">
                      ID: {order.user._id.slice(-6)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-default-500">
                    <Mail size={12} /> {order.user.email}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-default-500">
                    <Phone size={12} /> {order.user.phone}
                  </div>
                </div>
              </Card>

              {/* Logistics Status (Shifted from Sidebar) */}
              <Card className="rounded-none shadow-none border border-divider p-6 bg-content1">
                <div className="flex items-center gap-2 mb-4 text-default-400">
                  <Activity size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Logistics Status
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-l-2 border-success pl-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-success">
                        Verified Payment
                      </p>
                      <p className="text-[10px] font-bold text-default-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle
                      size={14}
                      className="text-success"
                    />
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
                    <Clock
                      size={14}
                      className="text-danger"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT SECTION: FINANCIALS (SPAN 3) */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="rounded-none shadow-none border border-divider bg-danger h-full text-white p-8">
              <ReceiptText
                size={40}
                className="mb-6 opacity-20"
              />
              <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-white/50">
                Settlement Report
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between text-sm font-bold border-b border-white/10 pb-4">
                  <span className="text-white/60 uppercase">
                    Gross Subtotal
                  </span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-b border-white/10 pb-4">
                  <span className="text-white/60 uppercase">Logistics</span>
                  <span className="text-xs">COMPLIMENTARY</span>
                </div>

                <div className="pt-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">
                    Final Balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-black opacity-50 uppercase">
                      USD
                    </span>
                  </div>
                </div>

                <div className="mt-20 border border-white/20 p-4 flex items-center gap-3">
                  <ShieldCheck
                    size={20}
                    className="opacity-50"
                  />
                  <p className="text-[9px] font-black uppercase leading-tight opacity-70">
                    Security Protocol: Stripe Cloud Verification Active
                  </p>
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

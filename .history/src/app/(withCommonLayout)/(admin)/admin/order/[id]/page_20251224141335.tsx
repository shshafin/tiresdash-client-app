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
  CreditCard,
  Truck,
  Mail,
  Phone,
  Copy,
  Download,
  ShieldCheck,
  Wrench,
  PlusCircle,
  MapPin,
  Calendar,
  Hash,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const SingleOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: orderData, isLoading, isError } = useGetSingleOrder(orderId);
  const order: any = orderData?.data;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "warning",
      processing: "primary",
      shipped: "secondary",
      delivered: "success",
      cancelled: "danger",
      refunded: "default",
    };
    return colors[status] || "default";
  };

  const handleExportPDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    // Professional Header with Company Info
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 50, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("TIRES DASH", 20, 25);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Tire & Wheel Solutions", 20, 32);
    doc.text("Email: info@tiresdash.com | Phone: +1 (555) 123-4567", 20, 38);

    // Invoice Title
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 170, 25);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`#${order._id.slice(-8).toUpperCase()}`, 170, 32);
    doc.text(new Date(order.createdAt).toLocaleDateString(), 170, 38);

    // Customer & Order Info Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 20, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.user.firstName} ${order.user.lastName}`, 20, 72);
    doc.text(order.user.email, 20, 78);
    if (order.user.phone) {
      doc.text(order.user.phone, 20, 84);
    }

    // Shipping Address
    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO:", 110, 65);
    doc.setFont("helvetica", "normal");
    doc.text(order.shippingAddress.street, 110, 72);
    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
      110,
      78
    );
    doc.text(
      `${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
      110,
      84
    );

    // Order Status
    doc.setFont("helvetica", "bold");
    doc.text("ORDER STATUS:", 20, 95);
    doc.setFont("helvetica", "normal");
    doc.text(order.status.toUpperCase(), 55, 95);

    // Items Table with Detailed Breakdown
    const tableData: any[] = [];

    order.items.forEach((item: any) => {
      // Main product row
      tableData.push([
        item.name,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`,
      ]);

      // Installation service row
      if (item.installationFee > 0) {
        tableData.push([
          `  └─ ${item.installationService || "Installation"}`,
          item.quantity.toString(),
          `$${item.installationFee.toFixed(2)}`,
          `$${(item.installationFee * item.quantity).toFixed(2)}`,
        ]);
      }

      // Addon services rows
      if (item.addonServices && item.addonServices.length > 0) {
        item.addonServices.forEach((addon: any) => {
          tableData.push([
            `  └─ ${addon.name}`,
            item.quantity.toString(),
            `$${addon.price.toFixed(2)}`,
            `$${(addon.price * item.quantity).toFixed(2)}`,
          ]);
        });
      }
    });

    autoTable(doc, {
      startY: 105,
      head: [["Product/Service", "Qty", "Unit Price", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [220, 38, 38],
        fontSize: 10,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 35, halign: "right" },
      },
    });

    // Summary Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 140, finalY);
    doc.text(`$${order.totalPrice.toFixed(2)}`, 180, finalY, {
      align: "right",
    });

    doc.text("Shipping:", 140, finalY + 7);
    doc.text("FREE", 180, finalY + 7, { align: "right" });

    doc.text("Tax:", 140, finalY + 14);
    doc.text("$0.00", 180, finalY + 14, { align: "right" });

    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.line(140, finalY + 18, 190, finalY + 18);

    doc.setFontSize(12);
    doc.text("TOTAL:", 140, finalY + 25);
    doc.text(`$${order.totalPrice.toFixed(2)}`, 180, finalY + 25, {
      align: "right",
    });

    // Payment Info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Payment Method: ${order.payment.paymentMethod.toUpperCase()}`,
      20,
      finalY + 25
    );
    doc.text("Payment Status: COMPLETED", 20, finalY + 32);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.text("For questions, contact us at support@tiresdash.com", 105, 285, {
      align: "center",
    });

    doc.save(`TiresDash_Invoice_${order._id.slice(-8)}.pdf`);
    toast.success("Invoice downloaded successfully!");
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
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-black text-danger uppercase mb-2">
            Order Not Found
          </p>
          <Button
            variant="flat"
            onPress={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <Card className="rounded-lg shadow-sm border border-divider">
          <CardBody className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <Button
                  isIconOnly
                  variant="flat"
                  size="lg"
                  onPress={() => router.back()}
                  className="rounded-lg">
                  <ArrowLeft size={20} />
                </Button>
                <div>
                  <h1 className="text-lg md:text-2xl font-black uppercase tracking-tight">
                    Order Details
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Hash
                      size={12}
                      className="text-default-400"
                    />
                    <code className="text-[10px] md:text-xs font-mono text-default-500">
                      {order._id}
                    </code>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => copyToClipboard(order._id)}
                      className="h-6 w-6 min-w-6">
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                color="danger"
                className="rounded-lg font-bold px-6 h-11 w-full sm:w-auto"
                startContent={<Download size={18} />}
                onPress={handleExportPDF}>
                Export Invoice
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Status Banner */}
        <Card
          className={`rounded-lg shadow-sm border-2 border-${getStatusColor(order.status)}`}>
          <CardBody
            className={`p-4 md:p-6 bg-${getStatusColor(order.status)}/5`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-default-500 uppercase mb-2">
                  Order Status
                </p>
                <Badge
                  color={getStatusColor(order.status)}
                  variant="flat"
                  size="lg"
                  className="rounded-lg font-black uppercase text-sm px-4 py-2">
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-default-500">
                <Calendar size={14} />
                <span>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            {/* Customer Information */}
            <Card className="rounded-lg shadow-sm border border-divider">
              <CardHeader className="bg-gradient-to-r from-danger/10 to-danger/5 border-b border-divider py-4 px-4 md:px-6">
                <h2 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                  <Package size={16} />
                  Customer Information
                </h2>
              </CardHeader>
              <CardBody className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-1 bg-gradient-to-br from-danger to-danger/70 rounded-lg flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg">
                        {order.user.firstName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base md:text-lg font-black uppercase truncate">
                          {order.user.firstName} {order.user.lastName}
                        </p>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-default-600">
                            <Mail
                              size={14}
                              className="flex-shrink-0"
                            />
                            <a
                              href={`mailto:${order.user.email}`}
                              className="hover:text-danger transition-colors truncate">
                              {order.user.email}
                            </a>
                          </div>
                          {order.user.phone && (
                            <div className="flex items-center gap-2 text-xs md:text-sm text-default-600">
                              <Phone
                                size={14}
                                className="flex-shrink-0"
                              />
                              <a
                                href={`tel:${order.user.phone}`}
                                className="hover:text-danger transition-colors">
                                {order.user.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Truck
                        size={16}
                        className="text-danger"
                      />
                      <p className="text-xs font-black text-default-500 uppercase">
                        Shipping Address
                      </p>
                    </div>
                    <div className="bg-default-50 dark:bg-default-100/10 p-4 rounded-lg space-y-1 text-sm">
                      <p className="font-bold">
                        {order.shippingAddress.street}
                      </p>
                      <p className="text-default-600">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>
                      <p className="text-default-600">
                        {order.shippingAddress.postalCode}
                      </p>
                      <p className="font-bold text-danger uppercase pt-2">
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Order Items */}
            <Card className="rounded-lg shadow-sm border border-divider">
              <CardHeader className="bg-gradient-to-r from-danger/10 to-danger/5 border-b border-divider py-4 px-4 md:px-6">
                <h2 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                  <Package size={16} />
                  Order Items ({order.totalItems})
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                {order.items.map((item: any, idx: number) => {
                  const itemTotal =
                    item.price * item.quantity +
                    (item.installationFee || 0) * item.quantity +
                    (item.addonPrice || 0) * item.quantity;
                  return (
                    <div
                      key={idx}
                      className="p-4 md:p-6 border-b border-divider last:border-0 hover:bg-default-50/50 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                        {/* Product Image */}
                        <div className="relative w-full lg:w-32 h-32 bg-white border border-divider rounded-lg flex-shrink-0 overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-4 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black uppercase text-sm md:text-base leading-tight truncate">
                                {item.name}
                              </h3>
                              <Badge
                                size="sm"
                                variant="flat"
                                color="danger"
                                className="rounded-md text-[9px] font-bold mt-2 uppercase">
                                {item.productType}
                              </Badge>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-default-500 uppercase font-bold mb-1">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-xl md:text-2xl font-black text-danger">
                                ${itemTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Pricing Breakdown */}
                          <div className="space-y-2">
                            {/* Base Price */}
                            <div className="flex items-center justify-between text-xs bg-default-100/50 dark:bg-default-100/10 p-2 rounded">
                              <div className="flex items-center gap-2">
                                <Package
                                  size={12}
                                  className="text-danger"
                                />
                                <span className="font-bold">Base Price</span>
                              </div>
                              <span className="font-black">
                                ${item.price.toFixed(2)} × {item.quantity} = $
                                {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>

                            {/* Installation */}
                            {item.installationFee > 0 && (
                              <div className="flex items-start justify-between text-xs bg-success-50 dark:bg-success-900/10 p-2 rounded border-l-2 border-success">
                                <div className="flex items-center gap-2">
                                  <Wrench
                                    size={12}
                                    className="text-success flex-shrink-0 mt-0.5"
                                  />
                                  <div>
                                    <p className="font-black text-success">
                                      {item.installationService ||
                                        "Installation"}
                                    </p>
                                    <p className="text-[9px] text-success-600">
                                      Per unit service
                                    </p>
                                  </div>
                                </div>
                                <span className="font-black text-success whitespace-nowrap">
                                  ${item.installationFee.toFixed(2)} ×{" "}
                                  {item.quantity} = $
                                  {(
                                    item.installationFee * item.quantity
                                  ).toFixed(2)}
                                </span>
                              </div>
                            )}

                            {/* Addons */}
                            {item.addonServices &&
                              item.addonServices.length > 0 && (
                                <div className="bg-primary-50 dark:bg-primary-900/10 p-2 rounded border-l-2 border-primary">
                                  <div className="flex items-center gap-2 mb-2">
                                    <PlusCircle
                                      size={12}
                                      className="text-primary"
                                    />
                                    <p className="text-xs font-black text-primary uppercase">
                                      Addon Services
                                    </p>
                                  </div>
                                  <div className="space-y-1.5 pl-5">
                                    {item.addonServices.map(
                                      (addon: any, addonIdx: number) => (
                                        <div
                                          key={addonIdx}
                                          className="flex items-center justify-between text-[10px]">
                                          <span className="text-primary-700 dark:text-primary-300">
                                            • {addon.name}
                                          </span>
                                          <span className="font-black text-primary whitespace-nowrap">
                                            ${addon.price.toFixed(2)} ×{" "}
                                            {item.quantity} = $
                                            {(
                                              addon.price * item.quantity
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4 md:space-y-6">
            {/* Order Summary */}
            <Card className="rounded-lg shadow-sm border border-divider sticky top-4">
              <CardHeader className="bg-gradient-to-r from-danger to-danger/80 text-white py-4 px-4 md:px-6">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-sm font-black uppercase tracking-wide">
                    Order Summary
                  </h3>
                  <CreditCard size={18} />
                </div>
              </CardHeader>
              <CardBody className="p-4 md:p-6 space-y-4">
                {/* Price Lines */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-default-600">Subtotal</span>
                    <span className="font-black">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-default-600">Shipping</span>
                    <span className="font-black text-success">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-divider">
                    <span className="text-default-600">Tax</span>
                    <span className="font-black">$0.00</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-danger/10 to-danger/5 p-4 rounded-lg border-l-4 border-danger">
                  <div className="flex flex-col justify-between items-center mb-2">
                    <span className="text-sm font-black uppercase">Total</span>
                    <span className="text-2xl md:text-3xl font-black text-danger">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-default-500">
                    <ShieldCheck size={12} />
                    <span className="uppercase">Secure Payment Verified</span>
                  </div>
                </div>

                <Divider />

                {/* Payment Method */}
                <div>
                  <p className="text-xs font-bold text-default-500 uppercase mb-3">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-3 bg-default-50 dark:bg-default-100/10 p-3 rounded-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard
                        size={18}
                        className="text-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black uppercase truncate">
                        {order.payment.paymentMethod.replace("_", " ")}
                      </p>
                      <p className="text-[10px] text-success font-bold uppercase">
                        Completed
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Billing Address */}
            <Card className="rounded-lg shadow-sm border border-divider">
              <CardHeader className="bg-default-50 dark:bg-default-100/10 border-b border-divider py-3 px-4">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={14}
                    className="text-danger"
                  />
                  <h3 className="text-xs font-black uppercase">
                    Billing Address
                  </h3>
                </div>
              </CardHeader>
              <CardBody className="p-4 text-sm space-y-1">
                <p className="font-bold">{order.billingAddress.street}</p>
                <p className="text-default-600">
                  {order.billingAddress.city}, {order.billingAddress.state}
                </p>
                <p className="text-default-600">
                  {order.billingAddress.postalCode}
                </p>
                <p className="font-bold text-danger uppercase pt-2">
                  {order.billingAddress.country}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderPage;

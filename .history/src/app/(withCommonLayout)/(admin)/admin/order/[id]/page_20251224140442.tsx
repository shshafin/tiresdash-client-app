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
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ShieldCheck,
  Wrench,
  PlusCircle,
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
    toast.success("ID copied to clipboard");
  };

  const handleExportPDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(33, 37, 41);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("TIRES DASH", 20, 25);
    doc.setFontSize(10);
    doc.text(`INVOICE: #${order._id.slice(-8).toUpperCase()}`, 150, 25);

    // Items with Fees Breakdown
    const tableBody = order.items.map((item: any) => [
      item.name,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.installationFee || 0).toFixed(2)}`,
      `$${(item.addonPrice || 0).toFixed(2)}`,
      `$${(item.price * item.quantity + (item.installationFee || 0) + (item.addonPrice || 0)).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Product", "Qty", "Base", "Install", "Addons", "Subtotal"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] },
    });

    doc.save(`Invoice_${order._id.slice(-8)}.pdf`);
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
      <div className="p-20 text-center font-black text-danger">
        ORDER NOT FOUND
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-6 border border-divider shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.back()}
              className="rounded-none">
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">
                Order Control
              </h1>
              <p className="text-[10px] font-mono text-default-400">
                REF: {order._id}
              </p>
            </div>
          </div>
          <Button
            color="danger"
            className="rounded-none font-black px-10 h-12 w-full md:w-auto"
            startContent={<Download size={18} />}
            onPress={handleExportPDF}>
            EXPORT INVOICE
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Inventory Card */}
            <Card className="rounded-none shadow-none border border-divider overflow-hidden">
              <CardHeader className="bg-default-50 dark:bg-gray-900 border-b border-divider py-4 px-6 font-black uppercase text-xs tracking-widest">
                Shipment Inventory
              </CardHeader>
              <CardBody className="p-0">
                {order.items.map((item: any, idx: number) => {
                  const itemTotal =
                    item.price * item.quantity +
                    (item.installationFee || 0) +
                    (item.addonPrice || 0);
                  return (
                    <div
                      key={idx}
                      className="p-6 flex flex-col md:flex-row items-start gap-8 border-b border-divider last:border-0 hover:bg-default-50/50 transition-colors">
                      <div className="relative w-28 h-28 bg-white border border-divider flex-shrink-0">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-4 w-full">
                        <div>
                          <h3 className="font-black uppercase text-sm leading-tight">
                            {item.name}
                          </h3>
                          <Badge
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="rounded-none text-[9px] font-bold mt-1 uppercase">
                            {item.productType}
                          </Badge>
                        </div>

                        {/* ✅ FIXED: INSTALLATION & ADDONS WITH NAMES */}
                        <div className="space-y-3">
                          {/* Base Price */}
                          <div className="flex items-center gap-2 text-[11px] font-bold text-default-600">
                            <Package
                              size={14}
                              className="text-danger"
                            />
                            <span className="uppercase">Base Price:</span>
                            <span className="font-black text-danger">
                              ${item.price.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-default-400">
                              × {item.quantity}
                            </span>
                          </div>

                          {/* Installation Service */}
                          {item.installationFee > 0 && (
                            <div className="flex items-start gap-2 text-[11px] font-bold text-success bg-success-50 dark:bg-success-900/10 p-2 rounded border-l-2 border-success">
                              <Wrench
                                size={14}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="uppercase font-black">
                                    {item.installationService || "Installation"}
                                  </span>
                                  <span className="font-black">
                                    +${item.installationFee.toFixed(2)}
                                  </span>
                                </div>
                                <span className="text-[9px] text-success-600 dark:text-success-400">
                                  Applied to each unit
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Addon Services */}
                          {item.addonServices &&
                            item.addonServices.length > 0 && (
                              <div className="flex items-start gap-2 text-[11px] font-bold text-primary bg-primary-50 dark:bg-primary-900/10 p-2 rounded border-l-2 border-primary">
                                <PlusCircle
                                  size={14}
                                  className="mt-0.5 flex-shrink-0"
                                />
                                <div className="flex-1 space-y-1">
                                  <div className="font-black uppercase text-primary-700 dark:text-primary-400">
                                    Addon Services:
                                  </div>
                                  {item.addonServices.map(
                                    (addon: any, addonIdx: number) => (
                                      <div
                                        key={addonIdx}
                                        className="flex items-center justify-between text-[10px] pl-2">
                                        <span className="text-primary-600 dark:text-primary-300">
                                          • {addon.name}
                                        </span>
                                        <span className="font-black text-primary">
                                          +${addon.price.toFixed(2)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                  <div className="flex items-center justify-between pt-1 border-t border-primary-200 dark:border-primary-800">
                                    <span className="text-[9px] text-primary-600 dark:text-primary-400 uppercase">
                                      Total Addons
                                    </span>
                                    <span className="font-black text-primary">
                                      +${item.addonPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* Item Subtotal */}
                          <div className="flex items-center justify-between pt-2 border-t-2 border-divider">
                            <span className="text-[10px] font-black text-default-500 uppercase tracking-wider">
                              Item Subtotal
                            </span>
                            <span className="text-lg font-black text-danger">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>

            {/* Address Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-none border-divider p-6 bg-white dark:bg-gray-900 shadow-none">
                <p className="text-[10px] font-black text-default-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                  <Truck size={14} /> Shipping Port
                </p>
                <div className="text-sm font-bold space-y-1">
                  <p className="text-lg font-black uppercase">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-xs font-black text-danger uppercase pt-4">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </Card>
              <Card className="rounded-none border-divider p-6 bg-white dark:bg-gray-900 shadow-none">
                <p className="text-[10px] font-black text-default-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                  <CreditCard size={14} /> Billing Secure
                </p>
                <div className="text-sm font-bold space-y-1">
                  <p className="text-lg font-black uppercase capitalize">
                    {order.payment.paymentMethod.replace("_", " ")}
                  </p>
                  <p className="text-default-500 uppercase text-[10px] tracking-widest pt-4 text-success">
                    Secure Transaction Verified
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order Summary Card */}
            <Card className="rounded-none shadow-none border border-divider bg-white dark:bg-gray-900">
              <CardHeader className="bg-danger text-white py-4 px-6 border-b border-divider">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-xs font-black uppercase tracking-widest">
                    Order Summary
                  </h3>
                  <CreditCard size={18} />
                </div>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-divider">
                    <span className="text-xs font-bold text-default-500 uppercase">
                      Subtotal
                    </span>
                    <span className="text-base font-black">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-divider">
                    <span className="text-xs font-bold text-default-500 uppercase">
                      Shipping
                    </span>
                    <span className="text-xs font-black text-success uppercase">
                      FREE
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-divider">
                    <span className="text-xs font-bold text-default-500 uppercase">
                      Tax
                    </span>
                    <span className="text-xs font-black">$0.00</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-danger/5 dark:bg-danger/10 p-4 rounded border-l-4 border-danger">
                  <div className="flex flex- justify-between items-center">
                    <span className="text-sm font-black uppercase text-default-700">
                      Total Amount
                    </span>
                    <span className="text-3xl font-black text-danger">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[9px] text-default-500 uppercase">
                    <ShieldCheck size={12} />
                    <span>Secure Payment Verified</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t border-divider">
                  <p className="text-[10px] font-black text-default-400 uppercase mb-3">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center">
                      <CreditCard
                        size={20}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase">
                        {order.payment.paymentMethod.replace("_", " ")}
                      </p>
                      <p className="text-[9px] text-success font-bold uppercase">
                        Payment Completed
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Order Status & Customer Info */}
            <Card className="rounded-none border-divider bg-white dark:bg-gray-900 shadow-none">
              <CardHeader className="bg-default-50 dark:bg-gray-900 border-b border-divider py-4 px-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-default-600">
                  Order Details
                </h3>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <p className="text-[10px] font-bold text-default-400 uppercase mb-2">
                    Status
                  </p>
                  <Badge
                    color="danger"
                    variant="flat"
                    className="rounded-none font-black uppercase text-xs px-3 py-1">
                    {order.status}
                  </Badge>
                </div>

                <Divider />

                {/* Customer Info */}
                <div>
                  <p className="text-[10px] font-bold text-default-400 uppercase mb-3">
                    Customer
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-danger rounded-none flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {order.user.firstName[0]}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-black uppercase truncate">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p className="text-[10px] font-bold text-default-400 truncate">
                        {order.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Order ID */}
                <div>
                  <p className="text-[10px] font-bold text-default-400 uppercase mb-2">
                    Order ID
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] font-mono bg-default-100 dark:bg-default-50 px-2 py-1 rounded flex-1 truncate">
                      {order._id}
                    </code>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => copyToClipboard(order._id)}
                      className="flex-shrink-0">
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>

                {/* Order Date */}
                <div>
                  <p className="text-[10px] font-bold text-default-400 uppercase mb-2">
                    Order Date
                  </p>
                  <p className="text-xs font-black">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderPage;

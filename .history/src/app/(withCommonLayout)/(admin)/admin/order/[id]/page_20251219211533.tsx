"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleOrder } from "@/src/hooks/order.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import {
  ArrowLeft,
  Download,
  Package,
  Truck,
  CreditCard,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

const SingleOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: orderData, isLoading } = useGetSingleOrder(orderId);
  const order = orderData?.data;

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner color="danger" />
      </div>
    );
  if (!order)
    return (
      <div className="p-20 text-center uppercase font-black">
        Order Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-none border border-divider">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.back()}>
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">
                Order Management
              </h1>
              <p className="text-[10px] font-mono text-gray-400">
                ID: {order._id}
              </p>
            </div>
          </div>
          <Button
            color="danger"
            className="rounded-none font-black px-10"
            startContent={<Download size={18} />}>
            EXPORT INVOICE
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-none shadow-none border border-divider">
              <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-divider font-black uppercase text-xs tracking-widest">
                Shipment Inventory
              </CardHeader>
              <CardBody className="p-0">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b border-divider last:border-0">
                    <div className="relative w-24 h-24 bg-gray-100 border border-divider">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="font-black uppercase text-sm">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                        <Badge
                          size="sm"
                          variant="flat"
                          className="rounded-none text-[9px] font-bold">
                          BASE: ${item.price}
                        </Badge>
                        {item.installationFee > 0 && (
                          <Badge
                            color="success"
                            size="sm"
                            variant="flat"
                            className="rounded-none text-[9px] font-bold">
                            INSTALL: +${item.installationFee}
                          </Badge>
                        )}
                        {item.addonPrice > 0 && (
                          <Badge
                            color="primary"
                            size="sm"
                            variant="flat"
                            className="rounded-none text-[9px] font-bold">
                            ADDON: +${item.addonPrice}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Line Total
                      </p>
                      <p className="text-2xl font-black text-danger">
                        $
                        {(
                          item.price * item.quantity +
                          (item.installationFee || 0) +
                          (item.addonPrice || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Address Grid - Responsive 1 to 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-none border-divider p-6">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                  <Truck size={14} /> Shipping Port
                </p>
                <div className="text-sm font-bold space-y-1">
                  <p className="uppercase">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-default-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              </Card>
              <Card className="rounded-none border-divider p-6">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                  <CreditCard size={14} /> Billing Secure
                </p>
                <div className="text-sm font-bold space-y-1">
                  <p className="uppercase">{order.payment.paymentMethod}</p>
                  <p className="text-success text-[10px] uppercase tracking-widest pt-2">
                    Transaction Verified
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar - Financials */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-danger rounded-none text-white p-8 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-10">
                Settlement Report
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold border-b border-white/10 pb-4 uppercase">
                  <span>Gross Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="pt-10">
                  <p className="text-5xl font-black tracking-tighter">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest mt-4 opacity-50 flex items-center gap-2">
                    <ShieldCheck size={14} /> Stripe Secure Protocol
                  </p>
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

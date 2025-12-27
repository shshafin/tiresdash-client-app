"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import jsPDF from "jspdf";
import {
  Download,
  Eye,
  Package,
  Search,
  Filter,
  Calendar,
  Mail,
  CreditCard,
  MoreVertical,
  FileText,
  Building2,
  Wrench,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- Columns ---
export const columns = [
  { name: "ID", uid: "orderId" },
  { name: "ITEMS & SERVICES", uid: "items" }, // Changed Name for Clarity
  { name: "TOTAL", uid: "totalPrice" },
  { name: "STATUS", uid: "status" },
  { name: "PAYMENT", uid: "paymentStatus" },
  { name: "DATE", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

// --- Status Chip Component ---
const StatusChip = ({
  status,
  type,
}: {
  status: string;
  type: "order" | "payment";
}) => {
  const getStatusColor = (status: string, type: "order" | "payment") => {
    const s = status?.toLowerCase();
    if (type === "order") {
      if (s === "pending") return "warning";
      if (s === "processing") return "primary";
      if (s === "shipped") return "secondary";
      if (s === "delivered") return "success";
      if (s === "cancelled") return "danger";
      return "default";
    } else {
      if (s === "completed") return "success";
      if (s === "failed" || s === "cancelled") return "danger";
      if (s === "pending") return "warning";
      return "default";
    }
  };

  return (
    <Chip
      color={getStatusColor(status, type) as any}
      size="sm"
      variant="flat"
      className="capitalize font-bold">
      {status || "N/A"}
    </Chip>
  );
};

// --- PDF Generation Fix ---
const generateInvoice = (order: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header & Styling (Keeping your existing UI style)
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20).setFont("helvetica", "bold").text("Tiresdash", 20, 25);

  doc.setTextColor(0, 0, 0);
  let y = 60;
  doc.setFontSize(12).text(`Order ID: #${order._id.toUpperCase()}`, 20, y);
  y += 15;

  // Table Styling
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y, pageWidth - 40, 10, "F");
  doc.setFontSize(10).text("Description", 25, y + 7);
  doc.text("Qty", 120, y + 7);
  doc.text("Total", pageWidth - 30, y + 7, { align: "right" });
  y += 15;

  order.items?.forEach((item: any) => {
    // Base Product
    doc.setFont("helvetica", "bold").text(item.name, 25, y);
    doc.text(item.quantity.toString(), 122, y);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, pageWidth - 30, y, {
      align: "right",
    });
    y += 6;

    // Installation
    if (item.installationFee > 0) {
      doc
        .setFont("helvetica", "normal")
        .setFontSize(8)
        .text(`+ ${item.installationService}`, 30, y);
      doc.text(
        `$${(item.installationFee * item.quantity).toFixed(2)}`,
        pageWidth - 30,
        y,
        { align: "right" }
      );
      y += 5;
    }

    // Addons
    item.addonServices?.forEach((addon: any) => {
      doc
        .setFont("helvetica", "normal")
        .setFontSize(8)
        .text(`+ ${addon.name}`, 30, y);
      doc.text(
        `$${(addon.price * item.quantity).toFixed(2)}`,
        pageWidth - 30,
        y,
        { align: "right" }
      );
      y += 5;
    });
    y += 5;
  });

  doc.line(20, y, pageWidth - 20, y);
  y += 10;
  doc.setFontSize(14).setFont("helvetica", "bold").text("GRAND TOTAL:", 120, y);
  doc.text(`$${order.totalPrice.toFixed(2)}`, pageWidth - 30, y, {
    align: "right",
  });

  doc.save(`Invoice_${order._id.slice(-6)}.pdf`);
};

// --- Mobile View Card ---
const OrderCard = ({ order }: { order: any }) => {
  const router = useRouter();

  return (
    <Card className="w-full border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-zinc-900">
      <CardHeader className="flex justify-between items-center pb-2 bg-zinc-50 dark:bg-zinc-800/50">
        <span className="font-black text-sm text-primary tracking-tighter">
          #{order._id.slice(-8).toUpperCase()}
        </span>
        <StatusChip
          status={order.status}
          type="order"
        />
      </CardHeader>
      <CardBody className="py-4 space-y-4">
        {order.items.map((item: any, i: number) => (
          <div
            key={i}
            className="space-y-1">
            <div className="flex justify-between text-sm font-bold">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            {/* Highlights for Services */}
            {item.installationFee > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                <Wrench size={12} /> {item.installationService}
              </div>
            )}
            {item.addonServices?.map((addon: any, ai: number) => (
              <div
                key={ai}
                className="flex items-center gap-1 text-[10px] text-blue-500 font-bold uppercase tracking-wider pl-2">
                <PlusCircle size={10} /> {addon.name}
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-between items-center pt-3 border-t dark:border-zinc-800">
          <div className="text-xs text-gray-500 flex items-center gap-1 uppercase font-black">
            <Calendar size={12} />{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <span className="text-lg font-black text-success tracking-tighter">
            ${order.totalPrice?.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 font-bold"
            variant="flat"
            color="primary"
            onPress={() => router.push(`/profile/order/${order._id}`)}>
            Details
          </Button>
          <Button
            size="sm"
            isIconOnly
            variant="flat"
            color="success"
            onPress={() => generateInvoice(order)}>
            <Download size={16} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default function OrderTable({ orders }: any) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders =
    orders?.data?.filter((order: any) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return (
        matchesSearch &&
        (statusFilter === "all" || order.status === statusFilter)
      );
    }) || [];

  const renderCell = (order: any, columnKey: string) => {
    switch (columnKey) {
      case "orderId":
        return (
          <span className="font-mono text-xs font-bold text-zinc-400">
            #{order._id.slice(-8).toUpperCase()}
          </span>
        );

      case "items":
        return (
          <div className="flex flex-col gap-2 py-2">
            {order.items.map((item: any, i: number) => (
              <div
                key={i}
                className="border-l-2 border-zinc-100 pl-3">
                <p className="text-sm font-bold leading-none">
                  {item.name}{" "}
                  <span className="text-zinc-400">x{item.quantity}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.installationFee > 0 && (
                    <Chip
                      size="xs"
                      variant="flat"
                      color="danger"
                      startContent={<Wrench size={10} />}
                      className="text-[9px] h-5 font-bold uppercase">
                      Installation
                    </Chip>
                  )}
                  {item.addonServices?.map((a: any, ai: number) => (
                    <Chip
                      key={ai}
                      size="xs"
                      variant="flat"
                      color="primary"
                      className="text-[9px] h-5 font-bold uppercase">
                      {a.name}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "totalPrice":
        return (
          <span className="font-black text-base text-zinc-900 dark:text-white">
            ${order.totalPrice?.toFixed(2)}
          </span>
        );

      case "status":
        return (
          <StatusChip
            status={order.status}
            type="order"
          />
        );

      case "paymentStatus":
        return (
          <StatusChip
            status={order.payment?.paymentStatus || "N/A"}
            type="payment"
          />
        );

      case "createdAt":
        return (
          <div className="text-xs font-medium text-zinc-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        );

      case "actions":
        return (
          <div className="flex gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => router.push(`/profile/order/${order._id}`)}>
              <Eye size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="success"
              onPress={() => generateInvoice(order)}>
              <Download size={16} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
          <Package className="text-primary" /> My Orders
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search orders..."
            size="sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search size={14} />}
            className="max-w-[200px]"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block border border-zinc-100 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
        <Table
          aria-label="Orders"
          removeWrapper
          className="border-none">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-widest">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={filteredOrders}>
            {(order: any) => (
              <TableRow
                key={order._id}
                className="border-b border-zinc-50 last:border-none hover:bg-zinc-50/30 transition-colors">
                {(columnKey) => (
                  <TableCell>
                    {renderCell(order, columnKey as string)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Grid */}
      <div className="grid lg:hidden gap-4">
        {filteredOrders.map((order: any) => (
          <OrderCard
            key={order._id}
            order={order}
          />
        ))}
      </div>
    </div>
  );
}

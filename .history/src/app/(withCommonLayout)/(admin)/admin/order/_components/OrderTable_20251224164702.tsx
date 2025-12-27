"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { DeleteIcon } from "@/src/icons";
import {
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateOrderStatus } from "@/src/hooks/order.hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function OrderTable({
  orders,
  setSelectedOrder,
  onDeleteOpen,
}: any) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const { mutate: updateOrderStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_ORDERS"] });
        toast.success("Status updated");
      },
    });

  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
        return "primary";
      case "shipped":
        return "secondary";
      case "delivered":
        return "success";
      case "cancelled":
      case "refunded":
        return "danger";
      default:
        return "default";
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = [...(orders?.data || [])];
    if (filterValue) {
      filtered = filtered.filter(
        (o) =>
          o.user?.firstName
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          o._id?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all")
      filtered = filtered.filter((o) => o.status === statusFilter);
    return filtered;
  }, [orders, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems]);

  const ActionButtons = ({ order }: { order: any }) => (
    <div className="flex gap-4 justify-center items-center">
      <Tooltip
        content="View Details"
        color="primary">
        <button
          onClick={() => router.push(`/admin/order/${order._id}`)}
          className="text-blue-500 dark:text-blue-400 hover:scale-110 transition-transform">
          <Eye size={22} />
        </button>
      </Tooltip>
      <Tooltip
        content="Delete Order"
        color="danger">
        <button
          onClick={() => {
            setSelectedOrder(order);
            onDeleteOpen();
          }}
          className="text-danger hover:scale-110 transition-transform">
          <DeleteIcon />
        </button>
      </Tooltip>
    </div>
  );

  const PaymentBadge = ({ status }: { status: string }) => {
    const isPaid =
      status?.toLowerCase() === "completed" || status?.toLowerCase() === "paid";
    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isPaid ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400"}`}>
        {status?.toUpperCase() || "PENDING"}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6 text-gray-900 dark:text-gray-100">
      {/* --- Search & Filter --- */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <Input
          isClearable
          className="w-full sm:max-w-[350px]"
          placeholder="Search orders..."
          startContent={
            <Search
              size={18}
              className="text-rose-400"
            />
          }
          value={filterValue}
          onValueChange={(val) => {
            setFilterValue(val);
            setPage(1);
          }}
          variant="bordered"
          color="secondary"
        />
        <Select
          labelPlacement="outside"
          startContent={
            <Filter
              size={16}
              className="text-rose-500"
            />
          }
          className="w-full sm:w-48"
          selectedKeys={[statusFilter]}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          color="secondary"
          variant="bordered">
          <SelectItem key="all">All Status</SelectItem>
          <SelectItem
            key="pending"
            className="text-warning">
            Pending
          </SelectItem>
          <SelectItem
            key="processing"
            className="text-primary">
            Processing
          </SelectItem>
          <SelectItem
            key="shipped"
            className="text-secondary">
            Shipped
          </SelectItem>
          <SelectItem
            key="delivered"
            className="text-success">
            Delivered
          </SelectItem>
          <SelectItem
            key="cancelled"
            className="text-danger">
            Cancelled
          </SelectItem>
        </Select>
      </div>

      {/* --- Desktop View --- */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        <Table
          aria-label="Order Table"
          shadow="none"
          className="dark:bg-gray-900">
          <TableHeader>
            <TableColumn>ORDER & DATE</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>TOTAL</TableColumn>
            <TableColumn>PAYMENT</TableColumn>
            <TableColumn>ORDER STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item: any) => (
              <TableRow
                key={item._id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      #{item._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {item.user?.firstName}
                    </span>
                    <span className="text-tiny text-gray-500">
                      {item.user?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-gray-800 dark:text-gray-200">
                  ${item.totalPrice?.toFixed(2)}
                </TableCell>
                <TableCell>
                  <PaymentBadge status={item.payment?.paymentStatus} />
                </TableCell>
                <TableCell>
                  <Select
                    size="sm"
                    color={getStatusColor(item.status)}
                    className="w-32"
                    selectedKeys={[item.status]}
                    onChange={(e) =>
                      updateOrderStatus({
                        id: item._id,
                        status: e.target.value,
                      })
                    }
                    isDisabled={isUpdatingStatus}>
                    <SelectItem key="pending">Pending</SelectItem>
                    <SelectItem key="processing">Processing</SelectItem>
                    <SelectItem key="shipped">Shipped</SelectItem>
                    <SelectItem key="delivered">Delivered</SelectItem>
                    <SelectItem key="cancelled">Cancelled</SelectItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <ActionButtons order={item} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Tablet & Mobile Card View --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {items.map((order: any) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3 hover:border-rose-300 dark:hover:border-rose-500/50 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-bold text-rose-500">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <ActionButtons order={order} />
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User size={12} /> {order.user?.firstName}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-white">
                <DollarSign size={12} /> ${order.totalPrice?.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CreditCard size={12} />{" "}
                <PaymentBadge status={order.payment?.paymentStatus} />
              </div>
            </div>

            <div className="pt-1">
              <Select
                size="sm"
                variant="flat"
                color={getStatusColor(order.status)}
                label="Update Status"
                selectedKeys={[order.status]}
                onChange={(e) =>
                  updateOrderStatus({ id: order._id, status: e.target.value })
                }
                isDisabled={isUpdatingStatus}>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="processing">Processing</SelectItem>
                <SelectItem key="shipped">Shipped</SelectItem>
                <SelectItem key="delivered">Delivered</SelectItem>
                <SelectItem key="cancelled">Cancelled</SelectItem>
              </Select>
            </div>
          </div>
        ))}
      </div>

      {/* --- Pagination --- */}
      <div className="flex justify-center pb-8">
        <Pagination
          isCompact
          showControls
          color="secondary"
          variant="flat"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

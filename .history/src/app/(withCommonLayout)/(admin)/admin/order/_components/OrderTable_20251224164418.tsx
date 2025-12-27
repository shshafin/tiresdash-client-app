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
  PackageCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateOrderStatus } from "@/src/hooks/order.hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Helper to get color based on status
const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    case "processing":
      return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "shipped":
      return "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    case "delivered":
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    case "cancelled":
      return "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-400";
  }
};

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
        toast.success("Order status updated");
      },
    });

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

  const PaymentBadge = ({ status }: { status: string }) => {
    const isPaid =
      status?.toLowerCase() === "completed" || status?.toLowerCase() === "paid";
    return (
      <span
        className={`px-2 py-1 rounded text-[10px] font-bold border ${isPaid ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400"}`}>
        {status?.toUpperCase() || "UNPAID"}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6 text-gray-900 dark:text-gray-100 p-2">
      {/* --- Filter Bar --- */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <Input
          isClearable
          className="w-full sm:max-w-[400px]"
          placeholder="Search by Customer or ID..."
          startContent={
            <Search
              size={18}
              className="text-rose-500"
            />
          }
          value={filterValue}
          onValueChange={(val) => {
            setFilterValue(val);
            setPage(1);
          }}
          variant="flat"
        />
        <Select
          startContent={
            <Filter
              size={16}
              className="text-rose-500"
            />
          }
          className="w-full sm:w-56"
          placeholder="Filter by Status"
          selectedKeys={[statusFilter]}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}>
          <SelectItem key="all">All Status</SelectItem>
          <SelectItem
            key="pending"
            className="text-amber-600">
            Pending
          </SelectItem>
          <SelectItem
            key="processing"
            className="text-blue-600">
            Processing
          </SelectItem>
          <SelectItem
            key="shipped"
            className="text-purple-600">
            Shipped
          </SelectItem>
          <SelectItem
            key="delivered"
            className="text-emerald-600">
            Delivered
          </SelectItem>
          <SelectItem
            key="cancelled"
            className="text-rose-600">
            Cancelled
          </SelectItem>
        </Select>
      </div>

      {/* --- Desktop View --- */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        <Table
          aria-label="Orders"
          shadow="none">
          <TableHeader>
            <TableColumn className="bg-gray-50 dark:bg-gray-800/50">
              ORDER & DATE
            </TableColumn>
            <TableColumn className="bg-gray-50 dark:bg-gray-800/50">
              CUSTOMER
            </TableColumn>
            <TableColumn className="bg-gray-50 dark:bg-gray-800/50">
              PAYMENT
            </TableColumn>
            <TableColumn className="bg-gray-50 dark:bg-gray-800/50">
              TOTAL
            </TableColumn>
            <TableColumn className="bg-gray-50 dark:bg-gray-800/50">
              STATUS UPDATE
            </TableColumn>
            <TableColumn
              align="center"
              className="bg-gray-50 dark:bg-gray-800/50">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item: any) => (
              <TableRow
                key={item._id}
                className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-rose-900/5 transition-all">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-rose-600 dark:text-rose-400 tracking-tighter">
                      #{item._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-400 italic">
                      {new Date(item.createdAt).toDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold text-xs uppercase">
                      {item.user?.firstName?.[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {item.user?.firstName} {item.user?.lastName}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {item.user?.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <PaymentBadge status={item.payment?.paymentStatus} />
                </TableCell>
                <TableCell className="font-black text-sm">
                  ${item.totalPrice?.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div
                    className={`p-1 rounded-xl border ${getStatusStyles(item.status)}`}>
                    <Select
                      size="sm"
                      variant="light"
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
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => router.push(`/admin/order/${order._id}`)}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full text-rose-500 transition-all">
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(item);
                        onDeleteOpen();
                      }}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full text-danger transition-all">
                      <DeleteIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Tablet/Mobile View --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
        {items.map((order: any) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div
              className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-opacity group-hover:opacity-20 ${getStatusStyles(order.status).split(" ")[1]}`}></div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-black text-rose-600 tracking-wider">
                  #{order._id.slice(-8).toUpperCase()}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/order/${order._id}`)}
                  className="h-10 w-10 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl">
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    onDeleteOpen();
                  }}
                  className="h-10 w-10 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 text-danger rounded-2xl">
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                  <User size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase">
                    {order.user?.firstName}
                  </span>
                  <span className="text-xs text-gray-500 tracking-tight">
                    {order.user?.email}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-black text-lg">
                  <DollarSign
                    size={18}
                    className="text-rose-500"
                  />{" "}
                  {order.totalPrice?.toFixed(2)}
                </div>
                <PaymentBadge status={order.payment?.paymentStatus} />
              </div>
            </div>

            <div
              className={`p-1 rounded-2xl border ${getStatusStyles(order.status)}`}>
              <Select
                label="Change Status"
                variant="light"
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

      <div className="flex justify-center pt-4 pb-10">
        <Pagination
          isCompact
          showControls
          color="secondary"
          variant="shadow"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

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
import { Eye, Package, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateOrderStatus } from "@/src/hooks/order.hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const columns = [
  { name: "ORDER", uid: "orderId" },
  { name: "CUSTOMER", uid: "customer" },
  { name: "TOTAL", uid: "totalPrice" },
  { name: "STATUS", uid: "status" },
  { name: "DATE", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

const orderStatusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    pending: "bg-orange-100 text-orange-700 border-orange-200",
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    shipped: "bg-purple-100 text-purple-700 border-purple-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${colors[status] || "bg-gray-100"}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default function OrderTable({
  orders,
  setSelectedOrder,
  onDeleteOpen,
}: any) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- Frontend State for Filtering & Pagination ---
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

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    let filtered = [...(orders?.data || [])];

    if (filterValue) {
      filtered = filtered.filter(
        (order) =>
          order.user?.firstName
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order._id?.toLowerCase().includes(filterValue.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    return filtered;
  }, [orders, filterValue, statusFilter]);

  // --- Pagination Logic ---
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const renderCell = (order: any, columnKey: any) => {
    switch (columnKey) {
      case "orderId":
        return (
          <span className="font-bold text-blue-600">
            #{order._id.slice(-6).toUpperCase()}
          </span>
        );
      case "customer":
        return (
          <div className="flex flex-col">
            <p className="font-bold text-small capitalize">
              {order.user?.firstName} {order.user?.lastName}
            </p>
            <p className="text-tiny text-default-400">{order.user?.email}</p>
          </div>
        );
      case "totalPrice":
        return (
          <span className="font-bold text-success">
            ${order.totalPrice?.toFixed(2)}
          </span>
        );
      case "status":
        return (
          <Select
            size="sm"
            className="w-32"
            selectedKeys={[order.status]}
            onChange={(e) =>
              updateOrderStatus({ id: order._id, status: e.target.value })
            }
            isDisabled={isUpdatingStatus}>
            {orderStatusOptions
              .filter((o: any) => o.value !== "all")
              .map((opt: any) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
          </Select>
        );
      case "createdAt":
        return (
          <span className="text-tiny text-default-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        );
      case "actions":
        return (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/admin/order/${order._id}`)}
              className="text-blue-500 hover:scale-110 transition-transform">
              <Eye size={20} />
            </button>
            <button
              onClick={() => {
                setSelectedOrder(order);
                onDeleteOpen();
              }}
              className="text-danger hover:scale-110 transition-transform">
              <DeleteIcon />
            </button>
          </div>
        );
      default:
        return order[columnKey];
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Input
          isClearable
          className="w-full md:max-w-[300px]"
          placeholder="Search by ID, name or email..."
          startContent={
            <Search
              size={18}
              className="text-default-300"
            />
          }
          value={filterValue}
          onValueChange={(val) => {
            setFilterValue(val);
            setPage(1);
          }}
        />
        <div className="flex gap-3 w-full md:w-auto">
          <Select
            startContent={<Filter size={16} />}
            className="w-full md:w-48"
            placeholder="Filter Status"
            selectedKeys={[statusFilter]}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}>
            {orderStatusOptions.map((opt) => (
              <SelectItem key={opt.value}>{opt.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Genius Responsive Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table
          aria-label="Admin Orders"
          shadow="none"
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center py-4 border-t">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="warning"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }>
          <TableHeader columns={columns}>
            {(col) => (
              <TableColumn
                key={col.uid}
                align={col.uid === "actions" ? "center" : "start"}>
                {col.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={items}
            emptyContent={"No orders found matching your criteria."}>
            {(item) => (
              <TableRow
                key={item._id}
                className="hover:bg-gray-50/50 transition-colors border-b last:border-0">
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

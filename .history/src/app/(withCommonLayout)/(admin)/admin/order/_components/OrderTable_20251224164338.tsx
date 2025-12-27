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
import { DeleteIcon, EditIcon } from "@/src/icons";
import { Eye, Search, Filter, Package, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateOrderStatus } from "@/src/hooks/order.hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Order status options
const orderStatusOptions: any = [
  { value: "pending", label: "Pending", color: "text-amber-500" },
  { value: "processing", label: "Processing", color: "text-blue-500" },
  { value: "shipped", label: "Shipped", color: "text-purple-500" },
  { value: "delivered", label: "Delivered", color: "text-emerald-500" },
  { value: "cancelled", label: "Cancelled", color: "text-rose-500" },
];

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
  const rowsPerPage = 10;

  const { mutate: updateOrderStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_ORDERS"] });
        toast.success("Order status updated successfully");
      },
    });

  // Filtering & Pagination Logic
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

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-amber-500 text-amber-500";
      case "processing":
        return "border-blue-500 text-blue-500";
      case "shipped":
        return "border-purple-500 text-purple-500";
      case "delivered":
        return "border-emerald-500 text-emerald-500";
      case "cancelled":
        return "border-rose-500 text-rose-500";
      default:
        return "border-default-200";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Bar: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-2">
        <Input
          isClearable
          className="w-full sm:max-w-[44%] "
          placeholder="Search by ID or name..."
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
          placeholder="All Status"
          className="w-full sm:max-w-[200px]"
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          variant="bordered"
          color="secondary">
          <SelectItem key="all">All Status</SelectItem>
          {orderStatusOptions.map((opt: any) => (
            <SelectItem
              key={opt.value}
              className={opt.color}>
              {opt.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-divider dark:border-gray-800 bg-content1 shadow-sm overflow-hidden">
        <Table
          aria-label="Admin Orders Table"
          shadow="none"
          className="min-w-[800px] md:min-w-full" // Forces scroll instead of squishing on tablet
          bottomContent={
            <div className="flex w-full justify-center py-4 border-t border-divider">
              <Pagination
                isCompact
                showControls
                color="secondary"
                page={page}
                total={Math.ceil(filteredItems.length / rowsPerPage)}
                onChange={setPage}
              />
            </div>
          }>
          <TableHeader>
            <TableColumn>ORDER ID</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>PAYMENT</TableColumn>
            <TableColumn>TOTAL</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody
            items={items}
            emptyContent={"No orders found."}>
            {(item: any) => (
              <TableRow
                key={item._id}
                className="hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                      #{item._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-default-400 uppercase tracking-tighter">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-small font-medium">
                      {item.user?.firstName} {item.user?.lastName}
                    </span>
                    <span className="text-tiny text-default-400">
                      {item.user?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.payment?.paymentStatus === "completed" ? "border-emerald-500 text-emerald-500" : "border-rose-400 text-rose-400"}`}>
                    {item.payment?.paymentStatus?.toUpperCase() || "PENDING"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-default-700 dark:text-gray-200">
                    ${item.totalPrice?.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    size="sm"
                    variant="bordered"
                    className={`min-w-[130px] font-semibold ${getStatusColor(item.status)}`}
                    selectedKeys={[item.status]}
                    onChange={(e) =>
                      updateOrderStatus({
                        id: item._id,
                        status: e.target.value,
                      })
                    }
                    isDisabled={isUpdatingStatus}>
                    {orderStatusOptions.map((opt: any) => (
                      <SelectItem
                        key={opt.value}
                        className={opt.color}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center justify-center gap-3">
                    <Tooltip
                      content="View Details"
                      color="secondary"
                      closeDelay={0}>
                      <span
                        onClick={() => router.push(`/admin/order/${item._id}`)}
                        className="text-lg text-rose-500 cursor-pointer active:opacity-50">
                        <Eye size={20} />
                      </span>
                    </Tooltip>
                    <Tooltip
                      content="Edit"
                      closeDelay={0}>
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <EditIcon />
                      </span>
                    </Tooltip>
                    <Tooltip
                      color="danger"
                      content="Delete Order"
                      closeDelay={0}>
                      <span
                        onClick={() => {
                          setSelectedOrder(item);
                          onDeleteOpen();
                        }}
                        className="text-lg text-danger cursor-pointer active:opacity-50">
                        <DeleteIcon />
                      </span>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Small Screen Hint */}
      <p className="block md:hidden text-center text-[10px] text-default-400 italic">
        Swipe left to view more columns
      </p>
    </div>
  );
}

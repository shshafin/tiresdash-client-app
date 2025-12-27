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
import { Eye, Search, Filter, Calendar, User, DollarSign } from "lucide-react";
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

  // Shared Action Buttons
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

  return (
    <div className="w-full space-y-6 text-gray-900 dark:text-gray-100">
      {/* --- Search & Filter --- */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <Input
          isClearable
          className="w-full sm:max-w-[350px]"
          placeholder="Search orders..."
          startContent={
            <Search
              size={18}
              className="text-gray-400"
            />
          }
          value={filterValue}
          onValueChange={(val) => {
            setFilterValue(val);
            setPage(1);
          }}
        />
        <Select
          labelPlacement="outside"
          startContent={<Filter size={16} />}
          className="w-full sm:w-48"
          selectedKeys={[statusFilter]}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}>
          <SelectItem key="all">All Status</SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="processing">Processing</SelectItem>
          <SelectItem key="shipped">Shipped</SelectItem>
          <SelectItem key="delivered">Delivered</SelectItem>
        </Select>
      </div>

      {/* --- Desktop Table View (Visible > 1024px) --- */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        <Table
          aria-label="Order Table"
          shadow="none"
          className="dark:bg-gray-900">
          <TableHeader>
            <TableColumn>ORDER</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>TOTAL</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item: any) => (
              <TableRow
                key={item._id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <TableCell className="font-bold text-orange-600 dark:text-orange-400">
                  #{item._id.slice(-6).toUpperCase()}
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
                <TableCell className="font-bold text-green-600 dark:text-green-400">
                  ${item.totalPrice?.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Select
                    size="sm"
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

      {/* --- Tablet & Mobile Card View (Visible < 1024px) --- */}
      {/* This handles the 768px - 1007px range perfectly by using a 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {items.map((order: any) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="font-bold text-orange-500">
                #{order._id.slice(-6).toUpperCase()}
              </span>
              <ActionButtons order={order} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User size={14} /> {order.user?.firstName}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
                <DollarSign size={14} /> ${order.totalPrice?.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={14} />{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="pt-2 border-t dark:border-gray-800">
              <Select
                size="sm"
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
              </Select>
            </div>
          </div>
        ))}
      </div>

      {/* --- Shared Pagination --- */}
      <div className="flex justify-center pb-6">
        <Pagination
          isCompact
          showControls
          color="warning"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

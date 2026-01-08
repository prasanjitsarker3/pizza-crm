"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { useGetAllOrdersQuery, useDeleteOrderMutation } from "@/redux/Api/orderApi";
import { PaginationMeta } from "@/types/IPagination";
import { formatDate } from "@/utlits/formatDate";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash2, Edit, ExternalLink, Search, X, User, Phone, MapPin, DollarSign, Package, ChevronDown, ChevronRight, Hash, Calendar } from "lucide-react";


import ConfirmationAlert from "../BackUp/Alert";
import { PaginationControl } from "../Common/Pagination";
import { TableSkeleton } from "../Common/TableSkeleton";
import { Order } from "@/types/order.type";
import { Card } from "../ui/card";
import Link from "next/link";
import OrderStatusUpdateModal from "./OrderStatusUpdateModal";
import { orderStatusColorMap } from "./orderStatusConfig";
import PaymentStatusUpdateModal from "./PaymentStatusUpdateModal";





const OrderTable = () => {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [selectOrder, setSelectOrder] = useState<Order | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openPaymentStatusModal, setOpenPaymentStatusModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  // const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  useEffect(() => setCurrentPage(1), [searchTerm]);

  const query: Record<string, any> = { page: currentPage, limit };
  if (searchTerm) query.searchTerm = searchTerm;

  const { data, isLoading } = useGetAllOrdersQuery(query);

  if (isLoading) return <TableSkeleton />;

  const orderData: Order[] = data?.data?.data || data?.data || [];
  // console.log("order data", orderData)
  const orderMeta: PaginationMeta = data?.meta || data?.data?.meta || { page: 1, limit, total: 0 };
  const totalPages = Math.ceil(orderMeta.total / orderMeta.limit);


  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId) // collapse
        : [...prev, orderId] // expand
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };



  const handleDeleteOrder = (order: Order) => {
    setSelectOrder(order);
    setOpenDeleteModal(true);
    setDropdownOpenId(null);
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectOrder(order);
    setOpenStatusModal(true);
    setDropdownOpenId(null)
  }


  const handlePaymentStatusUpdate = (order: Order) => {
    setSelectOrder(order);
    setOpenPaymentStatusModal(true);
    setDropdownOpenId(null)
  }
  const handleDeleteConfirmation = async () => {
    if (!selectOrder) return;
    const toastId = toast.loading("Deleting order...");
    try {
      const response = await deleteOrder(selectOrder.id).unwrap();
      if (response.success) {
        toast.success(response.message || "Order deleted", { id: toastId });
        setOpenDeleteModal(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete", { id: toastId });
    }
  };


  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "PROCESSING":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "COMPLETED":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "CANCELLED":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      case "PAID":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      case "UNPAID":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="space-y-4 bg-white p-3">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
        <Input
          placeholder="Search by order ID or customer..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit">
          <Search className="w-4 h-4 mr-1" /> Search
        </Button>
        {searchTerm && (
          <Button variant="ghost" onClick={clearSearch}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </form>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/50">
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderData.map((order) => {
              const isExpanded = expandedOrders.includes(order.id)
              return (
                <React.Fragment key={order.id}>
                  <TableRow className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(order.id)} className="h-8 w-8 p-0">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">{order.trxId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customerName}</span>
                        <span className="text-sm text-muted-foreground">{order.customerPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{order.items.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                        {order.discountAmount > 0 && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            -{formatCurrency(order.discountAmount)} discount
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={orderStatusColorMap[order.orderStatus] ?? "bg-gray-500/10"}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu
                        open={dropdownOpenId === order.id}
                        onOpenChange={(open) =>
                          setDropdownOpenId(open ? order.id : null)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 dark:bg-[#1F1F1F]"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/admin/orders/${order.id}/view`} className="flex items-center gap-2">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order)} asChild className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Eye className="mr-2 h-4 w-4" />
                              Status Update
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handlePaymentStatusUpdate(order)} asChild className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Eye className="mr-2 h-4 w-4" />
                              Payment Status Update
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteOrder(order)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30 p-0">
                        <div className="p-6 space-y-6">
                          {/* Customer & Delivery Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-4 space-y-3">
                              <h4 className="font-semibold text-sm flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Customer Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{order.customerName}</p>
                                    <p className="text-muted-foreground">{order.user.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{order.customerPhone}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <span className="text-balance">{order.customerAddress}</span>
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4 space-y-3">
                              <h4 className="font-semibold text-sm flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Order Summary
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                  <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(order.discountAmount)}</span>
                                  </div>
                                )}
                                {order.deliveryCharge > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span className="font-medium">{formatCurrency(order.deliveryCharge)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-border">
                                  <span className="font-semibold">Total</span>
                                  <span className="font-semibold text-lg">{formatCurrency(order.totalAmount)}</span>
                                </div>
                              </div>
                            </Card>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Order Items
                            </h4>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <Card key={idx} className="p-4">
                                  <div className="flex items-start gap-4">
                                    <img
                                      src={item.product.mainImages[0] || "/placeholder.svg"}
                                      alt={item.product.name}
                                      className="w-20 h-20 rounded-lg object-cover border border-border"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium">{item.product.name}</h5>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span>Qty: {item.quantity}</span>
                                        <span>Unit Price: {formatCurrency(item.product.price)}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Notes & Metadata */}
                          {order.notes && (
                            <Card className="p-4">
                              <h4 className="font-semibold text-sm mb-2">Delivery Notes</h4>
                              <p className="text-sm text-muted-foreground text-balance">{order.notes}</p>
                            </Card>
                          )}

                          <div className="flex items-center gap-6 text-xs text-muted-foreground pt-2 border-t border-border">
                            <div className="flex items-center gap-1.5">
                              <Hash className="h-3.5 w-3.5" />
                              <span>Order ID: {order.id}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Created: {formatDate(order.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={orderMeta.total}
        itemsPerPage={orderMeta.limit}
      />

      {/* Modals */}
      {/* {selectOrder && openViewModal && (
        <ViewOrderModal order={selectOrder} open={openViewModal} onOpenChange={setOpenViewModal} />
      )} */}

      {openDeleteModal && (
        <ConfirmationAlert
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteConfirmation}
          actionType="delete"
          itemName={selectOrder?.id}
          isLoading={isDeleting}
        />
      )}

      {
        selectOrder && openStatusModal && (
          <OrderStatusUpdateModal orderData={selectOrder} open={openStatusModal} onOpenChange={setOpenStatusModal} />
        )
      }
      {
        selectOrder && openPaymentStatusModal && (
          <PaymentStatusUpdateModal orderData={selectOrder} open={openPaymentStatusModal} onOpenChange={setOpenPaymentStatusModal} />
        )
      }
    </div>
  );
};

export default OrderTable;

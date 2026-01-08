"use client"
import { useGetSingleOrderQuery } from '@/redux/Api/orderApi';
import { Order } from '@/types/order.type';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Calendar, CreditCard, DollarSign, Mail, MapPin, Package, Phone, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useReactToPrint } from "react-to-print";
import { InvoiceTemplate } from './OrderInvoice';
import OrderStatusUpdateModal from '@/components/Order/OrderStatusUpdateModal';
import PaymentStatusUpdateModal from '@/components/Order/PaymentStatusUpdateModal';


const OrderView = () => {
  const { id } = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectOrder, setSelectOrder] = useState<Order | null>(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openPaymentStatusModal, setOpenPaymentStatusModal] = useState(false);

  const { data, isLoading } = useGetSingleOrderQuery(id as string);



  const handleDownloadPdf = useReactToPrint({
    contentRef,
    documentTitle: `Invoice-${id}`,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-xl font-semibold">Loading Order Details...</h1>
      </div>
    );
  }
  const orderData: Order = data?.data


  const handleStatusUpdate = (order: Order) => {
    setSelectOrder(order);
    setOpenStatusModal(true);
  }


  const handlePaymentStatusUpdate = (order: Order) => {
    setSelectOrder(order);
    setOpenPaymentStatusModal(true);
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "PROCESSING":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "UNPAID":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "REFUNDED":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }


  return (
    <div>
      <div className="hidden">
        <InvoiceTemplate ref={contentRef} data={orderData} />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white p-3">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Order Details</h1>
              <p className="text-sm text-muted-foreground">Transaction ID: {orderData.trxId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleDownloadPdf()}>
              Download Invoice
            </Button>
            <Button onClick={() => handleStatusUpdate(orderData)}>Update Status</Button>
            <Button onClick={() => handlePaymentStatusUpdate(orderData)}>Update Payment Status</Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 shadow-none">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Status</p>
                <div
                  className={`mt-1 inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(orderData.orderStatus)}`}
                >
                  {orderData.orderStatus}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-none">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <div
                  className={`mt-1 inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(orderData.paymentStatus)}`}
                >
                  {orderData.paymentStatus}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-none">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="mt-1 text-xl font-semibold">${orderData.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-none">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="mt-1 text-sm font-medium">{formatDate(orderData.createdAt)}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Items */}
            <Card className="p-6 shadow-none">
              <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex gap-4 rounded-lg border border-border p-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product.mainImages[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">
                        ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6 shadow-none">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-green-600">
                    {orderData.discountAmount > 0 ? `-$${orderData.discountAmount.toFixed(2)}` : "$0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span className="font-medium">
                    {orderData.deliveryCharge > 0 ? `$${orderData.deliveryCharge.toFixed(2)}` : "Free"}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-xl font-bold">${orderData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes */}
            {orderData.notes && (
              <Card className="p-6 shadow-none">
                <h2 className="mb-3 text-lg font-semibold">Order Notes</h2>
                <p className="text-sm text-muted-foreground">{orderData.notes}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="p-6 shadow-none">
              <h2 className="mb-4 text-lg font-semibold">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{orderData.customerName}</p>
                    <p className="text-xs text-muted-foreground">Customer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{orderData.user.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{orderData.customerPhone}</p>
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{orderData.customerAddress}</p>
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6 shadow-none">
              <h2 className="mb-4 text-lg font-semibold">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">Order Created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(orderData.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">{formatDate(orderData.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

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
  )
}

export default OrderView

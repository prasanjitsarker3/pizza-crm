"use client"
import React from "react";
import { Order } from "@/types/order.type";
import Image from "next/image";

interface Props {
    data: Order;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    return (
        <div ref={ref} className="p-12 bg-white text-slate-800 w-[210mm] min-h-[297mm] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
                <div>
                    <div
                        className=" p-3 inline-block"
                        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-14 w-auto block object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">INVOICE</h1>
                    <p className="text-sm text-slate-500 mt-1">Order ID: #{data.id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${data.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {data.paymentStatus}
                    </div>
                    <p className="font-semibold text-slate-900">Date Issued</p>
                    <p className="text-sm text-slate-500">{new Date(data.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-12 my-10">
                <div>
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Billed To</h3>
                    <p className="font-bold text-slate-900">{data.customerName}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {data.customerAddress}<br />
                        {data.customerPhone}<br />
                        {data.user.email}
                    </p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Shipped From</h3>
                    <p className="font-bold text-slate-900">Your Store Name</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        123 Business Street<br />
                        Dhaka, Bangladesh<br />
                        support@yourstore.com
                    </p>
                </div>
            </div>

            {/* Items Table */}
            <div className="mt-10">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-900 text-left">
                            <th className="py-3 font-bold text-sm uppercase">Item Description</th>
                            <th className="py-3 font-bold text-sm uppercase text-center">Qty</th>
                            <th className="py-3 font-bold text-sm uppercase text-right">Price</th>
                            <th className="py-3 font-bold text-sm uppercase text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-4">
                                    <p className="font-semibold text-slate-900">{item.product.name}</p>
                                </td>
                                <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                                <td className="py-4 text-right text-slate-600">${item.price.toFixed(2)}</td>
                                <td className="py-4 text-right font-semibold text-slate-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Calculation */}
            <div className="flex justify-end mt-10">
                <div className="w-full max-w-[250px] space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium">${data.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Shipping</span>
                        <span className="font-medium">${data.deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Discount</span>
                        <span className="font-medium text-green-600">-${data.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-900 pt-3">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-lg text-primary">${data.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-20 border-t border-slate-100 pt-8 text-center">
                <p className="text-sm font-semibold text-slate-900">Thank you for your purchase!</p>
                <p className="text-xs text-slate-500 mt-1">If you have any questions, please contact us at any time.</p>
            </div>
        </div>
    );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
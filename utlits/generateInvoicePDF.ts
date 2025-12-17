// import { Order } from "@/types/order.type"
// import jsPDF from "jspdf"

// const COMPANY_NAME = "Your Store"
// const COMPANY_EMAIL = "info@yourstore.com"
// const COMPANY_PHONE = "+880 1XXX XXX XXX"
// const COMPANY_ADDRESS = "Dhaka, Bangladesh"

// export const generateInvoicePDF = async (order: Order) => {
//     const pdf = new jsPDF()
//     const pageWidth = pdf.internal.pageSize.getWidth()
//     const pageHeight = pdf.internal.pageSize.getHeight()
//     let yPos = 20

//     // Header background
//     pdf.setFillColor(15, 23, 42)
//     pdf.rect(0, 0, pageWidth, 45, "F")

//     // Company name
//     pdf.setFontSize(24)
//     pdf.setFont("helvetica", "bold")
//     pdf.setTextColor(255, 255, 255)
//     pdf.text(COMPANY_NAME, 20, yPos)

//     // Invoice label
//     pdf.setFontSize(28)
//     pdf.setTextColor(148, 163, 184)
//     pdf.text("INVOICE", pageWidth - 20, yPos, { align: "right" })

//     yPos += 8

//     // Company details
//     pdf.setFontSize(9)
//     pdf.setFont("helvetica", "normal")
//     pdf.setTextColor(203, 213, 225)
//     pdf.text(COMPANY_EMAIL, 20, yPos)
//     yPos += 4
//     pdf.text(COMPANY_PHONE, 20, yPos)
//     yPos += 4
//     pdf.text(COMPANY_ADDRESS, 20, yPos)

//     yPos = 55

//     // Invoice details box
//     pdf.setFillColor(248, 250, 252)
//     pdf.roundedRect(pageWidth - 75, yPos, 55, 28, 2, 2, "F")

//     pdf.setFontSize(8)
//     pdf.setFont("helvetica", "bold")
//     pdf.setTextColor(71, 85, 105)
//     pdf.text("INVOICE NO.", pageWidth - 72, yPos + 6)
//     pdf.text("DATE", pageWidth - 72, yPos + 14)
//     pdf.text("STATUS", pageWidth - 72, yPos + 22)

//     pdf.setFont("helvetica", "normal")
//     pdf.setTextColor(15, 23, 42)
//     pdf.text(order.customerOrderId, pageWidth - 22, yPos + 6, { align: "right" })
//     pdf.text(new Date(order.createdAt).toLocaleDateString("en-GB"), pageWidth - 22, yPos + 14, { align: "right" })
//     pdf.text(order.orderStatus.toUpperCase(), pageWidth - 22, yPos + 22, {
//         align: "right",
//     })

//     // Bill to section
//     pdf.setFont("helvetica", "bold")
//     pdf.setFontSize(10)
//     pdf.setTextColor(15, 23, 42)
//     pdf.text("BILL TO", 20, yPos + 6)

//     yPos += 12

//     pdf.setDrawColor(226, 232, 240)
//     pdf.setLineWidth(0.5)
//     pdf.line(20, yPos, 110, yPos)

//     yPos += 6

//     pdf.setFont("helvetica", "bold")
//     pdf.setFontSize(11)
//     pdf.text(order.customerName, 20, yPos)

//     yPos += 6

//     pdf.setFont("helvetica", "normal")
//     pdf.setFontSize(9)
//     pdf.setTextColor(71, 85, 105)
//     pdf.text(order.customerEmail, 20, yPos)
//     yPos += 5
//     pdf.text(order.customerPhone, 20, yPos)
//     yPos += 5
//     pdf.text(`${order.customerAddress}, ${order.customerCity}`, 20, yPos, { maxWidth: 90 })
//     yPos += 5
//     pdf.text(`${order.customerState || ""} ${order.customerPostcode}`.trim(), 20, yPos)

//     yPos += 15

//     // Table header
//     pdf.setFont("helvetica", "bold")
//     pdf.setFontSize(9)
//     pdf.setTextColor(255, 255, 255)
//     pdf.setFillColor(51, 65, 85)

//     const colWidths = {
//         desc: 60,
//         variant: 28,
//         qty: 15,
//         price: 30,
//         discount: 28,
//         total: 32,
//     }

//     const colX = {
//         desc: 20,
//         variant: 82,
//         qty: 112,
//         price: 129,
//         discount: 161,
//         total: 191,
//     }

//     pdf.roundedRect(20, yPos - 5, pageWidth - 40, 9, 1, 1, "F")

//     pdf.text("DESCRIPTION", colX.desc + 2, yPos)
//     pdf.text("VARIANT", colX.variant + 2, yPos)
//     pdf.text("QTY", colX.qty + colWidths.qty / 2, yPos, { align: "center" })
//     pdf.text("PRICE", colX.price + colWidths.price - 2, yPos, { align: "right" })
//     pdf.text("DISC.", colX.discount + colWidths.discount - 2, yPos, {
//         align: "right",
//     })
//     pdf.text("TOTAL", colX.total + colWidths.total - 2, yPos, { align: "right" })

//     yPos += 8

//     pdf.setFont("helvetica", "normal")
//     pdf.setFontSize(9)
//     pdf.setTextColor(15, 23, 42)

//     let itemIndex = 0
//     order.cartOrders.forEach((cartOrder) => {
//         cartOrder.cart.items.forEach((item) => {
//             if (yPos > pageHeight - 60) {
//                 pdf.addPage()
//                 yPos = 20
//             }

//             // Alternate row background
//             if (itemIndex % 2 === 1) {
//                 pdf.setFillColor(248, 250, 252)
//                 pdf.rect(20, yPos - 4, pageWidth - 40, 11, "F")
//             }

//             const variant = item.GlobalProduct?.ProductVariant
//             const discountAmount = (item.price * (item.discount ?? 0)) / 100
//             const itemTotal = item.price * item.quantity - discountAmount * item.quantity

//             const description =
//                 item.type === "Product"
//                     ? item.GlobalProduct?.product?.name || "Product"
//                     : item.GlobalProduct?.giftcard?.code
//                         ? `Gift Card (${item.GlobalProduct.giftcard.code})`
//                         : "Gift Card"

//             const sizeColor = variant ? `${variant.sizeName} / ${variant.color.colorName}` : "N/A"

//             // Description
//             pdf.setTextColor(51, 65, 85)
//             pdf.text(description, colX.desc + 2, yPos, {
//                 maxWidth: colWidths.desc - 4,
//             })

//             // Variant
//             pdf.setTextColor(71, 85, 105)
//             pdf.setFontSize(8)
//             pdf.text(sizeColor, colX.variant + 2, yPos, {
//                 maxWidth: colWidths.variant - 4,
//             })
//             pdf.setFontSize(9)

//             // Quantity
//             pdf.setTextColor(51, 65, 85)
//             pdf.text(item.quantity.toString(), colX.qty + colWidths.qty / 2, yPos, {
//                 align: "center",
//             })

//             // Price
//             pdf.text(`${item.price.toFixed(0)}`, colX.price + colWidths.price - 2, yPos, {
//                 align: "right",
//             })

//             // Discount
//             pdf.text(`${(discountAmount * item.quantity).toFixed(2)}`, colX.discount + colWidths.discount - 2, yPos, {
//                 align: "right",
//             })

//             // Total
//             pdf.setFont("helvetica", "bold")
//             pdf.setTextColor(15, 23, 42)
//             pdf.text(`${itemTotal.toFixed(2)}`, colX.total + colWidths.total - 2, yPos, { align: "right" })
//             pdf.setFont("helvetica", "normal")

//             yPos += 11
//             itemIndex++
//         })
//     })

//     yPos += 5

//     const totalsBoxY = yPos

//     const subtotal = order.cartOrders.reduce((sum, cartOrder) => {
//         return (
//             sum +
//             cartOrder.cart.items.reduce((itemSum, item) => {
//                 return itemSum + item.price * item.quantity
//             }, 0)
//         )
//     }, 0)

//     // Calculate total discount
//     const totalDiscount = order.cartOrders.reduce((sum, cartOrder) => {
//         return (
//             sum +
//             cartOrder.cart.items.reduce((itemSum, item) => {
//                 const discountAmount = (item.price * (item.discount ?? 0)) / 100
//                 return itemSum + discountAmount * item.quantity
//             }, 0)
//         )
//     }, 0)

//     const shippingCost = order.shippingAmount || order.shipping?.shippingCost || 0
//     const finalTotal = order.totalAmount

//     // Adjust box height based on discount and shipping
//     const hasDiscount = totalDiscount > 0
//     const hasShipping = shippingCost > 0
//     const totalsBoxHeight = 28 + (hasDiscount ? 8 : 0) + (hasShipping ? 8 : 0)

//     pdf.setFillColor(248, 250, 252)
//     pdf.roundedRect(pageWidth - 95, totalsBoxY, 75, totalsBoxHeight, 2, 2, "F")

//     pdf.setDrawColor(226, 232, 240)
//     pdf.setLineWidth(0.5)
//     pdf.roundedRect(pageWidth - 95, totalsBoxY, 75, totalsBoxHeight, 2, 2, "S")

//     yPos += 10

//     const totalsLabelX = pageWidth - 90
//     const totalsValueX = pageWidth - 25

//     // Subtotal
//     pdf.setFont("helvetica", "normal")
//     pdf.setFontSize(9)
//     pdf.setTextColor(71, 85, 105)
//     pdf.text("Subtotal:", totalsLabelX, yPos)
//     pdf.setTextColor(15, 23, 42)
//     pdf.text(`BDT ${subtotal.toFixed(2)}`, totalsValueX, yPos, { align: "right" })

//     yPos += 7

//     // Discount (if applicable)
//     if (hasDiscount) {
//         pdf.setTextColor(71, 85, 105)
//         pdf.text("Discount:", totalsLabelX, yPos)
//         pdf.setTextColor(220, 38, 38)
//         pdf.text(`- BDT ${totalDiscount.toFixed(2)}`, totalsValueX, yPos, {
//             align: "right",
//         })
//         yPos += 7
//     }

//     if (hasShipping) {
//         pdf.setTextColor(71, 85, 105)
//         pdf.text("Shipping:", totalsLabelX, yPos)
//         pdf.setTextColor(15, 23, 42)
//         pdf.text(`BDT ${shippingCost.toFixed(2)}`, totalsValueX, yPos, {
//             align: "right",
//         })
//         yPos += 7
//     }

//     // Divider
//     pdf.setDrawColor(226, 232, 240)
//     pdf.line(pageWidth - 90, yPos, pageWidth - 25, yPos)
//     yPos += 7

//     // Total
//     pdf.setFont("helvetica", "bold")
//     pdf.setFontSize(12)
//     pdf.setTextColor(15, 23, 42)
//     pdf.text("TOTAL:", totalsLabelX, yPos)
//     pdf.setTextColor(22, 163, 74)
//     pdf.text(`BDT ${finalTotal.toFixed(2)}`, totalsValueX, yPos, {
//         align: "right",
//     })

//     // Footer
//     yPos = pageHeight - 30

//     pdf.setDrawColor(226, 232, 240)
//     pdf.setLineWidth(0.5)
//     pdf.line(20, yPos, pageWidth - 20, yPos)

//     yPos += 8

//     pdf.setFont("helvetica", "bold")
//     pdf.setFontSize(10)
//     pdf.setTextColor(15, 23, 42)
//     pdf.text("Thank you for your business!", pageWidth / 2, yPos, {
//         align: "center",
//     })

//     yPos += 6

//     pdf.setFont("helvetica", "normal")
//     pdf.setFontSize(8)
//     pdf.setTextColor(100, 116, 139)
//     pdf.text(`For any queries, please contact us at ${COMPANY_EMAIL}`, pageWidth / 2, yPos, { align: "center" })

//     yPos += 4

//     pdf.setFontSize(7)
//     pdf.setTextColor(148, 163, 184)
//     pdf.text("This is a computer-generated invoice and does not require a signature.", pageWidth / 2, yPos, {
//         align: "center",
//     })

//     // Save PDF
//     pdf.save(`Invoice-${order.customerOrderId}.pdf`)
// }

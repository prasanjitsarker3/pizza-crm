export interface OrderProduct {
  id: string
  name: string
  mainImages: string[]
  price: number
}

export interface OrderItem {
  product: OrderProduct
  quantity: number
  price: number
}

export interface OrderUser {
  id: string
  name: string
  email: string
}

export interface Order {
  id: string
  trxId: string
  userId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  notes: string
  subtotal: number
  totalAmount: number
  discountAmount: number
  deliveryCharge: number
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED"
  orderStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user: OrderUser
}

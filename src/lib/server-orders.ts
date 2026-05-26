import { randomUUID } from "crypto"
import { getDb } from "@/lib/mongodb"
import { getProductById } from "@/lib/server-products"
import type { AppUser } from "@/lib/auth"
import type { CheckoutInput } from "@/lib/schemas"

export type OrderDocument = {
  id: string
  buyerId?: string
  buyerEmail: string
  customer: CheckoutInput["customer"]
  status: "Processing" | "Shipped" | "Delivered"
  items: {
    productId: string
    name: string
    seller: string
    sellerId?: string
    image: string
    quantity: number
    price: number
  }[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: CheckoutInput["paymentMethod"]
  createdAt: string
  updatedAt: string
}

const collectionName = "orders"

export async function createOrder(input: CheckoutInput, user: AppUser | null) {
  const resolvedItems = await Promise.all(
    input.items.map(async (item) => {
      const product = await getProductById(item.productId)
      if (!product) return null
      if (product.stock <= 0) return null
      return {
        productId: product.id,
        name: product.name,
        seller: product.seller,
        sellerId: product.sellerId,
        image: product.image,
        quantity: Math.min(item.quantity, product.stock),
        price: product.price,
      }
    })
  )

  const items = resolvedItems.filter((item) => item !== null)
  if (!items.length) {
    return { error: "Your cart items are no longer available." }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 150 ? 0 : 12
  const tax = Number((subtotal * 0.08).toFixed(2))
  const total = Number((subtotal + shipping + tax).toFixed(2))
  const now = new Date().toISOString()
  const order: OrderDocument = {
    id: `order-${randomUUID().slice(0, 8)}`,
    buyerId: user?.id,
    buyerEmail: user?.email ?? input.customer.email.toLowerCase(),
    customer: { ...input.customer, email: input.customer.email.toLowerCase() },
    status: "Processing",
    items,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethod: input.paymentMethod,
    createdAt: now,
    updatedAt: now,
  }

  const db = await getDb()
  await db.collection<OrderDocument>(collectionName).insertOne(order)
  await db.collection("products").bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { id: item.productId },
        update: {
          $inc: { stock: -item.quantity },
          $set: { updatedAt: now },
        },
      },
    }))
  )
  return { order }
}

export async function getOrdersForUser(user: AppUser) {
  const db = await getDb()
  const query =
    user.role === "admin"
      ? {}
      : { $or: [{ buyerId: user.id }, { buyerEmail: user.email }] }

  return db
    .collection<OrderDocument>(collectionName)
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getOrderForUser(id: string, user: AppUser) {
  const db = await getDb()
  const query =
    user.role === "admin"
      ? { id }
      : { id, $or: [{ buyerId: user.id }, { buyerEmail: user.email }] }

  return db
    .collection<OrderDocument>(collectionName)
    .findOne(query, { projection: { _id: 0 } })
}

export async function getSellerOrders(user: AppUser) {
  const db = await getDb()
  const orders = await db
    .collection<OrderDocument>(collectionName)
    .find(user.role === "admin" ? {} : { "items.sellerId": user.id }, {
      projection: { _id: 0 },
    })
    .sort({ createdAt: -1 })
    .toArray()

  if (user.role === "admin") return orders

  return orders
    .map((order) => ({
      ...order,
      items: order.items.filter((item) => item.sellerId === user.id),
    }))
    .filter((order) => order.items.length > 0)
}

export async function getSellerAnalytics(user: AppUser) {
  const orders = await getSellerOrders(user)
  const revenue = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) => itemSum + item.price * item.quantity,
        0
      ),
    0
  )
  const unitsSold = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  )
  const unfulfilledOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length

  return {
    orders,
    stats: {
      revenue,
      unitsSold,
      unfulfilledOrders,
      orderCount: orders.length,
    },
  }
}

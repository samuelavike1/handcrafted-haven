import { randomUUID } from "crypto"
import { getDb } from "@/lib/mongodb"
import { products } from "@/lib/market-data"
import type { ProductInput } from "@/lib/schemas"
import type { AppUser } from "@/lib/auth"

export type ProductDocument = ProductInput & {
  id: string
  sellerId?: string
  rating: number
  reviews: number
  reviewItems?: {
    id: string
    author: string
    rating: number
    title: string
    comment: string
    createdAt: string
  }[]
  imageSource?: string
  createdAt: string
  updatedAt: string
}

const collectionName = "products"

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function ensureSeedProducts() {
  const db = await getDb()
  const collection = db.collection<ProductDocument>(collectionName)
  const count = await collection.countDocuments()

  if (count > 0) return

  const now = new Date().toISOString()
  await collection.insertMany(
    products.map((product, index) => ({
      ...product,
      id: product.id,
      stock: index === 3 ? 2 : 12 - index * 2,
      status: index === 3 ? "Low stock" : "Active",
      rating: product.rating,
      reviews: product.reviews ?? 0,
      createdAt: now,
      updatedAt: now,
    }))
  )
}

export async function getProducts(options: { sellerId?: string } = {}) {
  await ensureSeedProducts()
  const db = await getDb()
  const query = options.sellerId ? { sellerId: options.sellerId } : {}
  return db
    .collection<ProductDocument>(collectionName)
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getProductById(id: string) {
  await ensureSeedProducts()
  const db = await getDb()
  return db
    .collection<ProductDocument>(collectionName)
    .findOne({ id }, { projection: { _id: 0 } })
}

export async function getRelatedProducts(product: ProductDocument, limit = 3) {
  await ensureSeedProducts()
  const db = await getDb()
  return db
    .collection<ProductDocument>(collectionName)
    .find(
      { id: { $ne: product.id }, category: product.category },
      { projection: { _id: 0 } }
    )
    .sort({ rating: -1, reviews: -1 })
    .limit(limit)
    .toArray()
}

export async function createProduct(input: ProductInput, user: AppUser) {
  const db = await getDb()
  const now = new Date().toISOString()
  const baseId = input.id || slugify(input.name)
  const id = `${baseId}-${randomUUID().slice(0, 8)}`
  const product: ProductDocument = {
    ...input,
    id,
    sellerId: user.role === "seller" ? user.id : undefined,
    seller:
      user.role === "seller" ? (user.studioName ?? user.name) : input.seller,
    sellerLocation:
      user.role === "seller"
        ? (user.location ?? input.sellerLocation)
        : input.sellerLocation,
    rating: 0,
    reviews: 0,
    createdAt: now,
    updatedAt: now,
  }

  const collection = db.collection<ProductDocument>(collectionName)
  await collection.insertOne(product)

  return collection.findOne({ id }, { projection: { _id: 0 } })
}

export async function updateProduct(
  id: string,
  input: ProductInput,
  user: AppUser
) {
  const db = await getDb()
  const existing = await db
    .collection<ProductDocument>(collectionName)
    .findOne({ id })
  if (!existing) return null
  if (user.role !== "admin" && existing.sellerId !== user.id) return "forbidden"

  const updatedAt = new Date().toISOString()
  const update = {
    ...input,
    id,
    sellerId: existing.sellerId,
    seller:
      user.role === "seller" ? (user.studioName ?? user.name) : input.seller,
    sellerLocation:
      user.role === "seller"
        ? (user.location ?? input.sellerLocation)
        : input.sellerLocation,
    updatedAt,
  }

  await db
    .collection<ProductDocument>(collectionName)
    .updateOne({ id }, { $set: update })

  return db
    .collection<ProductDocument>(collectionName)
    .findOne({ id }, { projection: { _id: 0 } })
}

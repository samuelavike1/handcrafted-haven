"use client"

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import {
  BadgeCheck,
  BarChart3,
  Edit3,
  Eye,
  Info,
  Loader2,
  MapPin,
  PackageCheck,
  PackagePlus,
  Star,
  Truck,
} from "lucide-react"
import { toast } from "sonner"
import { featuredSeller } from "@/lib/market-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableSkeleton } from "@/components/ui/loading"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Listing = {
  id: string
  name: string
  seller: string
  sellerLocation?: string
  price: number
  rating: number
  reviews: number
  category: string
  image: string
  badge?: string
  materials: string[]
  description: string
  stock: number
  status: "Active" | "Low stock" | "Draft"
}

type FieldErrors = Partial<Record<keyof Listing, string[]>>

type SellerOrder = {
  id: string
  status: "Processing" | "Shipped" | "Delivered"
  total: number
  createdAt: string
  items: {
    productId: string
    name: string
    quantity: number
    price: number
  }[]
}

type DashboardStats = {
  revenue: number
  unitsSold: number
  unfulfilledOrders: number
  orderCount: number
  activeListings: number
  lowStockCount: number
}

const emptyListing: Listing = {
  id: "",
  name: "",
  seller: featuredSeller.name,
  sellerLocation: featuredSeller.location,
  price: 0,
  rating: 0,
  reviews: 0,
  category: "Ceramics",
  image: "",
  badge: "New",
  materials: [],
  description: "",
  stock: 1,
  status: "Draft",
}

type SellerDashboardUser = {
  name: string
  email: string
  studioName?: string
  location?: string
  story?: string
}

export default function SellerDashboardClient({
  user,
}: {
  user: SellerDashboardUser
}) {
  const [listings, setListings] = useState<Listing[]>([])
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [lowStock, setLowStock] = useState<Listing[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    revenue: 0,
    unitsSold: 0,
    unfulfilledOrders: 0,
    orderCount: 0,
    activeListings: 0,
    lowStockCount: 0,
  })
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null)
  const [draft, setDraft] = useState<Listing>(emptyListing)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [statusMessage, setStatusMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setIsLoading(true)
      try {
        const response = await fetch("/api/sellers/dashboard", {
          cache: "no-store",
        })
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)
        if (active) {
          setListings(data.products)
          setOrders(data.orders)
          setLowStock(data.lowStock)
          setDashboardStats(data.stats)
          setStatusMessage("")
        }
      } catch {
        if (active) {
          setListings([])
          setOrders([])
          setLowStock([])
          setStatusMessage(
            "Dashboard data could not be loaded. Start MongoDB locally to manage seller listings and orders."
          )
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadDashboard()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const stats = useMemo(
    () => [
      {
        label: "Total revenue",
        value: `$${dashboardStats.revenue.toFixed(2)}`,
        hint: `${dashboardStats.unitsSold} units sold`,
        icon: BarChart3,
      },
      {
        label: "Active listings",
        value: dashboardStats.activeListings.toString(),
        hint: "Seller inventory",
        icon: PackagePlus,
      },
      {
        label: "Unfulfilled orders",
        value: dashboardStats.unfulfilledOrders.toString(),
        hint: `${dashboardStats.orderCount} total orders`,
        icon: Truck,
      },
      {
        label: "Low stock",
        value: dashboardStats.lowStockCount.toString(),
        hint: "Needs inventory review",
        icon: Eye,
      },
    ],
    [dashboardStats]
  )

  const openAddModal = () => {
    setDraft(emptyListing)
    setImageFile(null)
    setImagePreview("")
    setErrors({})
    setStatusMessage("")
    setModalMode("add")
  }

  const openEditModal = (listing: Listing) => {
    setDraft({ ...listing, materials: [...listing.materials] })
    setImageFile(null)
    setImagePreview("")
    setErrors({})
    setStatusMessage("")
    setModalMode("edit")
  }

  const closeModal = () => {
    if (isSaving) return
    setModalMode(null)
    setImageFile(null)
    setImagePreview("")
    setErrors({})
  }

  const updateDraft = (field: keyof Listing, value: string | number) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const updateMaterials = (value: string) => {
    setDraft((current) => ({
      ...current,
      materials: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }))
  }

  const updateImageFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : "")
    setErrors((current) => ({ ...current, image: undefined }))
  }

  const uploadImage = async () => {
    if (!imageFile) return draft.image

    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await fetch("/api/uploads/products", {
      method: "POST",
      body: formData,
    })
    const data = await response.json()

    if (!response.ok) {
      if (data.errors) setErrors(data.errors)
      throw new Error(data.error ?? "Product image could not be uploaded.")
    }

    return data.imageUrl as string
  }

  const saveListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setErrors({})
    setStatusMessage("")

    const endpoint =
      modalMode === "edit" ? `/api/products/${draft.id}` : "/api/products"
    const method = modalMode === "edit" ? "PUT" : "POST"

    try {
      const uploadedImage = await uploadImage()
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, image: uploadedImage }),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) setErrors(data.errors)
        throw new Error(data.error ?? "Please review the form fields.")
      }

      if (modalMode === "add") {
        setListings((current) => [data.product, ...current])
        if (data.product.stock <= 3 || data.product.status === "Low stock") {
          setLowStock((current) => [data.product, ...current])
        }
        setDashboardStats((current) => ({
          ...current,
          activeListings:
            data.product.status === "Active"
              ? current.activeListings + 1
              : current.activeListings,
          lowStockCount:
            data.product.stock <= 3 || data.product.status === "Low stock"
              ? current.lowStockCount + 1
              : current.lowStockCount,
        }))
        toast.success("Product added", {
          description: "The listing was saved to MongoDB.",
        })
      } else {
        setListings((current) =>
          current.map((item) =>
            item.id === data.product.id ? data.product : item
          )
        )
        setLowStock((current) => {
          const withoutUpdated = current.filter(
            (item) => item.id !== data.product.id
          )
          return data.product.stock <= 3 || data.product.status === "Low stock"
            ? [data.product, ...withoutUpdated]
            : withoutUpdated
        })
        toast.success("Product updated", {
          description: "The listing changes were saved to MongoDB.",
        })
      }
      setModalMode(null)
      setImageFile(null)
      setImagePreview("")
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Product could not be saved. Check MongoDB and try again."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-white">
        <div className="relative h-40">
          <Image
            src={featuredSeller.cover}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative -mt-12 h-20 w-20 shrink-0 overflow-hidden rounded-lg border-4 border-white shadow-xl">
              <Image
                src={featuredSeller.avatar}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              <span className="absolute right-1.5 bottom-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-[#063f34] text-white">
                <BadgeCheck size={14} />
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#063f34]">
                {user.studioName ?? user.name}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-[#53615c]">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} /> {user.location ?? "Studio location"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="fill-[#c8651b] text-[#c8651b]" />{" "}
                  {featuredSeller.rating} ({featuredSeller.reviews} reviews)
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#53615c]">
                {user.story ??
                  "Manage listings, orders, inventory, and seller performance from this workspace."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:self-start">
            <Link
              href="/sell/login"
              className="rounded-lg border border-[#063f34] px-3 py-2 text-sm font-black text-[#063f34]"
            >
              Seller login
            </Link>
            <Link
              href="/sell/register"
              className="rounded-lg bg-[#f28a35] px-3 py-2 text-sm font-black text-white"
            >
              Register studio
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon }, index) => (
          <div
            key={label}
            className={`rounded-lg border p-4 ${index === 0 ? "border-[#063f34] bg-[#063f34] text-white" : "border-[#d8dfdc] bg-white"}`}
          >
            <Icon
              size={22}
              className={index === 0 ? "text-white/70" : "text-[#063f34]"}
            />
            <p
              className={`mt-4 text-xs font-black uppercase ${index === 0 ? "text-white/62" : "text-[#9a4d10]"}`}
            >
              {label}
            </p>
            <p className="mt-2 text-2xl font-black">{value}</p>
            <p
              className={`mt-2 text-sm ${index === 0 ? "text-white/72" : "text-[#53615c]"}`}
            >
              {hint}
            </p>
          </div>
        ))}
      </section>

      {lowStock.length > 0 && (
        <section className="mt-4 rounded-lg border border-[#f1c9a5] bg-[#fff8f1] p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 text-[#9a4d10]" size={20} />
            <div>
              <h2 className="font-black text-[#7a3907]">
                Inventory needs attention
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#7a5a40]">
                {lowStock.length} listing{lowStock.length === 1 ? "" : "s"} are
                low on stock. Update quantities before they sell out.
              </p>
            </div>
          </div>
        </section>
      )}

      {statusMessage && (
        <Alert className="mt-4 border-[#d8dfdc] bg-white text-[#53615c]">
          <Info />
          <AlertTitle>Seller dashboard notice</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      <section className="mt-4 rounded-lg border border-[#d8dfdc] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#d8dfdc] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Seller tools
            </p>
            <h2 className="text-2xl font-black text-[#063f34]">
              Product listings
            </h2>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-lg bg-[#063f34] px-3 py-2 text-sm font-black text-white focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
          >
            <PackagePlus className="mr-2" size={18} /> Add product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#f0f3ef] text-xs font-black tracking-[0.12em] text-[#53615c] uppercase">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8dfdc]">
              {isLoading ? (
                <TableSkeleton rows={5} />
              ) : listings.length ? (
                listings.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fbfbf8]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#edf2ef]">
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-black text-[#1b211f]">
                            {product.name}
                          </p>
                          <p className="text-sm text-[#53615c]">
                            {product.category} ·{" "}
                            {product.materials?.[0] ?? "Material"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-black ${product.status === "Low stock" ? "bg-[#fff4e8] text-[#9a4d10]" : product.status === "Draft" ? "bg-[#edf2ef] text-[#53615c]" : "bg-[#e6f3ef] text-[#063f34]"}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#53615c]">
                      {product.stock} in stock
                    </td>
                    <td className="px-4 py-3 font-black">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="inline-flex items-center gap-1 rounded-lg p-2 text-[#53615c] hover:bg-[#edf2ef] focus:ring-4 focus:ring-[#063f34]/10 focus:outline-none"
                      >
                        <Edit3 size={17} />
                        <span className="text-xs font-bold">Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm font-semibold text-[#53615c]"
                  >
                    No seller listings yet. Add your first product to publish it
                    to the marketplace.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-[#d8dfdc] bg-white">
        <div className="border-b border-[#d8dfdc] p-4">
          <p className="text-xs font-black text-[#9a4d10] uppercase">
            Seller orders
          </p>
          <h2 className="text-2xl font-black text-[#063f34]">Recent orders</h2>
        </div>
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={3} />
          </div>
        ) : orders.length ? (
          <div className="divide-y divide-[#d8dfdc]">
            {orders.slice(0, 6).map((order) => (
              <article
                key={order.id}
                className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-black text-[#063f34]">{order.id}</p>
                  <p className="mt-1 text-sm font-semibold text-[#53615c]">
                    {order.items
                      .map((item) => `${item.quantity} x ${item.name}`)
                      .join(", ")}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-black text-[#1b211f]">
                    $
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-[#edf2ef] px-2 py-1 text-xs font-black text-[#063f34]">
                    <PackageCheck size={13} /> {order.status}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm font-semibold text-[#53615c]">
            Orders for your seller studio will appear here after checkout.
          </div>
        )}
      </section>

      <Dialog
        open={Boolean(modalMode)}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
      >
        <DialogContent className="max-w-[760px] gap-0 overflow-hidden border-[#cfd9d4] bg-[#fbfbf8] p-0 text-[#191c1c] shadow-[0_24px_80px_rgba(18,40,33,0.28)] sm:max-w-[760px]">
          <form onSubmit={saveListing} className="grid">
            <div className="border-b border-[#d8dfdc] bg-white p-5">
              <DialogHeader className="pr-10">
                <p className="text-xs font-black text-[#9a4d10] uppercase">
                  {modalMode === "add" ? "New listing" : "Edit listing"}
                </p>
                <DialogTitle>
                  {modalMode === "add" ? "Add product" : draft.name}
                </DialogTitle>
                <DialogDescription>
                  Add enough detail for buyers to understand materials,
                  condition, pricing, and availability.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="grid gap-4 bg-[#fbfbf8] p-5 sm:grid-cols-2">
              <FormInput
                label="Product name"
                value={draft.name}
                error={errors.name?.[0]}
                onChange={(value) => updateDraft("name", value)}
                className="sm:col-span-2"
              />
              <ProductImageUpload
                image={draft.image}
                preview={imagePreview}
                imageFile={imageFile}
                error={errors.image?.[0]}
                onChange={updateImageFile}
              />
              <FormSelect
                label="Category"
                value={draft.category}
                options={["Ceramics", "Textiles", "Woodwork", "Jewelry"]}
                error={errors.category?.[0]}
                onChange={(value) => updateDraft("category", value)}
              />
              <FormSelect
                label="Status"
                value={draft.status}
                options={["Active", "Low stock", "Draft"]}
                error={errors.status?.[0]}
                onChange={(value) => updateDraft("status", value)}
              />
              <FormInput
                label="Price"
                type="number"
                value={draft.price}
                error={errors.price?.[0]}
                onChange={(value) => updateDraft("price", Number(value))}
              />
              <FormInput
                label="Stock"
                type="number"
                value={draft.stock}
                error={errors.stock?.[0]}
                onChange={(value) => updateDraft("stock", Number(value))}
              />
              <FormInput
                label="Materials"
                value={draft.materials.join(", ")}
                helper="Separate materials with commas."
                onChange={updateMaterials}
                className="sm:col-span-2"
              />
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
                  Description
                </span>
                <textarea
                  required
                  value={draft.description}
                  onChange={(event) =>
                    updateDraft("description", event.target.value)
                  }
                  rows={4}
                  className={`w-full rounded-lg border bg-[#fbfbf8] px-3 py-2 text-sm outline-none focus:border-[#063f34] ${errors.description ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
                />
                {errors.description?.[0] ? (
                  <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
                    {errors.description[0]}
                  </span>
                ) : (
                  <span className="mt-1 block text-xs text-[#6d7a75]">
                    Include material, process, care, and what makes it unique.
                  </span>
                )}
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#d8dfdc] bg-white p-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-[#d8dfdc] px-4 py-2 text-sm font-black text-[#53615c]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving && (
                  <Loader2 className="mr-2 animate-spin" size={15} />
                )}
                {modalMode === "add" ? "Add product" : "Save changes"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ProductImageUpload({
  image,
  preview,
  imageFile,
  error,
  onChange,
}: {
  image: string
  preview: string
  imageFile: File | null
  error?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const previewImage = preview || image

  return (
    <label className="sm:col-span-2">
      <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
        Product image
      </span>
      <div
        className={`grid gap-4 rounded-lg border bg-white p-3 sm:grid-cols-[150px_1fr] ${
          error ? "border-[#ba1a1a]" : "border-[#d8dfdc]"
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#edf2ef]">
          {previewImage ? (
            <Image
              src={previewImage}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs font-bold text-[#6d7a75]">
              Image preview
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onChange}
            className="block w-full text-sm text-[#53615c] file:mr-3 file:rounded-lg file:border-0 file:bg-[#063f34] file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
          />
          <span className="mt-2 text-xs text-[#6d7a75]">
            Upload a JPG, PNG, or WebP image up to 3MB.
          </span>
          {imageFile && (
            <span className="mt-2 text-xs font-bold text-[#063f34]">
              Selected: {imageFile.name}
            </span>
          )}
        </div>
      </div>
      {error && (
        <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
          {error}
        </span>
      )}
    </label>
  )
}

function FormInput({
  label,
  value,
  onChange,
  error,
  helper,
  type = "text",
  className = "",
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  error?: string
  helper?: string
  type?: string
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        min={type === "number" ? 0 : undefined}
        step={label === "Price" ? "0.01" : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`h-9 w-full rounded-lg border bg-[#fbfbf8] px-3 text-sm outline-none focus:border-[#063f34] ${error ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
      />
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
          {error}
        </span>
      ) : helper ? (
        <span className="mt-1 block text-xs text-[#6d7a75]">{helper}</span>
      ) : null}
    </label>
  )
}

function FormSelect({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`w-full bg-white text-[#191c1c] ${error ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
        >
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="z-[120] border border-[#cfd9d4] bg-white text-[#191c1c] shadow-[0_16px_40px_rgba(18,40,33,0.18)]">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-[#25332e] focus:bg-[#edf2ef] focus:text-[#063f34]"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
          {error}
        </span>
      )}
    </label>
  )
}

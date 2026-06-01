"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Edit3,
  Eye,
  Info,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  PackagePlus,
  Search,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  TrendingUp,
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
import { Skeleton, TableSkeleton } from "@/components/ui/loading"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ShimmerImage from "@/components/ui/shimmer-image"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

/* ── Types ─────────────────────────────────────────── */

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
  galleryImages: string[]
  badge?: string
  materials: string[]
  description: string
  stock: number
  status: "Active" | "Low stock" | "Draft"
}

type ListingDraft = Omit<Listing, "price" | "stock"> & {
  price: string
  stock: string
}

type FieldErrors = Partial<Record<keyof Listing, string[]>>

const pricePattern = /^\d+(\.\d{1,2})?$/

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

type DashView = "overview" | "listings" | "orders"

/* ── Constants ─────────────────────────────────────── */

const emptyListing: ListingDraft = {
  id: "",
  name: "",
  seller: featuredSeller.name,
  sellerLocation: featuredSeller.location,
  price: "",
  rating: 0,
  reviews: 0,
  category: "Ceramics",
  image: "",
  galleryImages: [],
  badge: "New",
  materials: [],
  description: "",
  stock: "1",
  status: "Draft",
}

function normalizeListing(listing: Listing): Listing {
  return {
    ...listing,
    materials: listing.materials ?? [],
    galleryImages: listing.galleryImages ?? [],
  }
}

type SellerDashboardUser = {
  name: string
  email: string
  studioName?: string
  location?: string
  story?: string
}

/* ── Main Component ────────────────────────────────── */

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
  const [activeView, setActiveView] = useState<DashView>("overview")
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null)
  const [draft, setDraft] = useState<ListingDraft>(emptyListing)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [statusMessage, setStatusMessage] = useState("")
  const [formMessage, setFormMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [listingQuery, setListingQuery] = useState("")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    let active = true
    async function loadDashboard() {
      setIsLoading(true)
      try {
        const response = await fetch("/api/sellers/dashboard", { cache: "no-store" })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        if (active) {
          setListings(data.products.map(normalizeListing))
          setOrders(data.orders)
          setLowStock(data.lowStock.map(normalizeListing))
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
    return () => { active = false }
  }, [])

  useEffect(() => {
    return () => { imagePreviews.forEach((p) => URL.revokeObjectURL(p)) }
  }, [imagePreviews])

  /* ── Derived stats ─── */
  const statCards = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: `$${dashboardStats.revenue.toFixed(2)}`,
        hint: `${dashboardStats.unitsSold} units sold`,
        icon: TrendingUp,
        accent: "#0b5345",
        bg: "#edf7f4",
      },
      {
        label: "Active Listings",
        value: dashboardStats.activeListings.toString(),
        hint: "Live on marketplace",
        icon: Package,
        accent: "#1d4ed8",
        bg: "#eff6ff",
      },
      {
        label: "Unfulfilled Orders",
        value: dashboardStats.unfulfilledOrders.toString(),
        hint: `${dashboardStats.orderCount} total orders`,
        icon: Truck,
        accent: dashboardStats.unfulfilledOrders > 0 ? "#9a4d10" : "#0b5345",
        bg: dashboardStats.unfulfilledOrders > 0 ? "#fff4ec" : "#edf7f4",
      },
      {
        label: "Low Stock Alerts",
        value: dashboardStats.lowStockCount.toString(),
        hint: "Needs inventory review",
        icon: Eye,
        accent: dashboardStats.lowStockCount > 0 ? "#ba1a1a" : "#0b5345",
        bg: dashboardStats.lowStockCount > 0 ? "#fff0f0" : "#edf7f4",
      },
    ],
    [dashboardStats]
  )

  /* ── Category breakdown for analytics ─── */
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {}
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const listing = listings.find((l) => l.id === item.productId)
        const cat = listing?.category ?? "Other"
        if (!map[cat]) map[cat] = { count: 0, revenue: 0 }
        map[cat].count += item.quantity
        map[cat].revenue += item.price * item.quantity
      })
    })
    return Object.entries(map)
      .map(([cat, data]) => ({ cat, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [orders, listings])

  const maxCategoryRevenue = Math.max(...categoryBreakdown.map((c) => c.revenue), 1)

  /* ── Top products ─── */
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; units: number; revenue: number }> = {}
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map[item.productId]) map[item.productId] = { name: item.name, units: 0, revenue: 0 }
        map[item.productId].units += item.quantity
        map[item.productId].revenue += item.price * item.quantity
      })
    })
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [orders])

  const revenueByDay = useMemo(() => {
  const days: Record<string, { date: string; revenue: number; orders: number; units: number }> = {}

  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    days[key] = { date: label, revenue: 0, orders: 0, units: 0 }
  }

  orders.forEach((order) => {
    const key = order.createdAt.slice(0, 10)
    if (days[key]) {
      days[key].revenue += order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      days[key].orders += 1
      days[key].units += order.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  })

  return Object.values(days)
}, [orders])

const thisMonthRevenue = useMemo(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return orders
    .filter((order) => {
      const date = new Date(order.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
    }, 0)
}, [orders])


const [revenueGoal, setRevenueGoal] = useState<number>(() => {
  if (typeof window === "undefined") return 0
  return Number(localStorage.getItem("seller_revenue_goal") ?? 0)
})
const [goalInput, setGoalInput] = useState<string>(() => {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("seller_revenue_goal") ?? ""
})

  /* ── Filtered listings ─── */
  const filteredListings = useMemo(() => {
    const q = listingQuery.trim().toLowerCase()
    if (!q) return listings
    return listings.filter((l) =>
      [l.name, l.category, l.status, ...(l.materials ?? [])].join(" ").toLowerCase().includes(q)
    )
  }, [listings, listingQuery])

  /* ── Modal helpers ─── */
  const openAddModal = () => {
    setDraft(emptyListing)
    setImageFiles([])
    setImagePreviews([])
    setErrors({})
    setStatusMessage("")
    setFormMessage("")
    setModalMode("add")
  }

  const openEditModal = (listing: Listing) => {
    setDraft({
      ...listing,
      price: String(listing.price),
      stock: String(listing.stock),
      materials: [...(listing.materials ?? [])],
      galleryImages: [...(listing.galleryImages ?? [])],
    })
    setImageFiles([])
    setImagePreviews([])
    setErrors({})
    setStatusMessage("")
    setFormMessage("")
    setModalMode("edit")
  }

  const closeModal = () => {
    if (isSaving) return
    setModalMode(null)
    setImageFiles([])
    setImagePreviews([])
    setErrors({})
    setFormMessage("")
  }

  const updateDraft = (field: keyof ListingDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormMessage("")
  }

  const focusFirstError = () => {
    window.setTimeout(() => {
      const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      target?.focus()
    }, 0)
  }

  const validateDraft = () => {
    const nextErrors: FieldErrors = {}
    const price = draft.price.trim()
    const stock = draft.stock.trim()
    if (draft.name.trim().length < 3) nextErrors.name = ["Product name must be at least 3 characters."]
    if (!draft.image && !imageFiles.length) nextErrors.image = ["Choose at least one product image."]
    if (!draft.category) nextErrors.category = ["Choose a category."]
    if (!price) nextErrors.price = ["Price is required."]
    else if (!pricePattern.test(price) || Number(price) <= 0) nextErrors.price = ["Price must be greater than 0."]
    if (!stock) nextErrors.stock = ["Stock is required."]
    else if (!Number.isInteger(Number(stock)) || Number(stock) < 0) nextErrors.stock = ["Stock cannot be negative."]
    if (draft.description.trim().length < 20) nextErrors.description = ["Description must be at least 20 characters."]
    return nextErrors
  }

  const buildProductPayload = (uploadedImages: { image: string; galleryImages: string[] }) => ({
    ...(modalMode === "edit" && draft.id ? { id: draft.id } : {}),
    name: draft.name.trim(),
    seller: draft.seller,
    sellerLocation: draft.sellerLocation,
    price: draft.price.trim(),
    category: draft.category,
    image: uploadedImages.image,
    galleryImages: uploadedImages.galleryImages,
    badge: draft.badge,
    materials: draft.materials,
    description: draft.description.trim(),
    stock: draft.stock.trim(),
    status: draft.status,
  })

  const updateMaterials = (value: string) => {
    setDraft((current) => ({
      ...current,
      materials: value.split(",").map((item) => item.trim()).filter(Boolean),
    }))
    setErrors((current) => ({ ...current, materials: undefined }))
    setFormMessage("")
  }

  const updateImageFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 6)
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    setImageFiles(files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
    setErrors((current) => ({ ...current, image: undefined }))
    setFormMessage("")
  }

  const uploadImages = async () => {
    const existingImages = [draft.image, ...(draft.galleryImages ?? [])].filter(Boolean)
    if (!imageFiles.length) return { image: draft.image, galleryImages: draft.galleryImages ?? [] }
    const formData = new FormData()
    imageFiles.forEach((file) => formData.append("images", file))
    const response = await fetch("/api/uploads/products", { method: "POST", body: formData })
    const data = await response.json()
    if (!response.ok) {
      if (data.errors) setErrors(data.errors)
      throw new Error(data.error ?? "Product image could not be uploaded.")
    }
    const imageUrls = data.imageUrls as string[]
    if (existingImages.length) {
      const image = draft.image || imageUrls[0]
      const galleryImages = [...(draft.galleryImages ?? []), ...imageUrls.filter((url) => url !== image)]
      return { image, galleryImages }
    }
    return { image: imageUrls[0], galleryImages: imageUrls.slice(1) }
  }

  const saveListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setErrors({})
    setFormMessage("")
    const validationErrors = validateDraft()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setFormMessage("Fix the highlighted fields before saving the product.")
      setIsSaving(false)
      focusFirstError()
      return
    }
    const endpoint = modalMode === "edit" ? `/api/products/${draft.id}` : "/api/products"
    const method = modalMode === "edit" ? "PUT" : "POST"
    try {
      const uploadedImages = await uploadImages()
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildProductPayload(uploadedImages)),
      })
      const data = await response.json()
      if (!response.ok) {
        if (data.errors) setErrors(data.errors)
        focusFirstError()
        throw new Error(data.error ?? "Please review the form fields.")
      }
      if (modalMode === "add") {
        const savedProduct = normalizeListing(data.product)
        setListings((current) => [savedProduct, ...current])
        if (data.product.stock <= 3 || data.product.status === "Low stock") {
          setLowStock((current) => [savedProduct, ...current])
        }
        setDashboardStats((current) => ({
          ...current,
          activeListings: data.product.status === "Active" ? current.activeListings + 1 : current.activeListings,
          lowStockCount: data.product.stock <= 3 || data.product.status === "Low stock" ? current.lowStockCount + 1 : current.lowStockCount,
        }))
        toast.success("Product added", { description: "The listing was saved to MongoDB." })
      } else {
        setListings((current) =>
          current.map((item) => (item.id === data.product.id ? normalizeListing(data.product) : item))
        )
        setLowStock((current) => {
          const withoutUpdated = current.filter((item) => item.id !== data.product.id)
          return data.product.stock <= 3 || data.product.status === "Low stock"
            ? [normalizeListing(data.product), ...withoutUpdated]
            : withoutUpdated
        })
        toast.success("Product updated", { description: "The listing changes were saved to MongoDB." })
      }
      setModalMode(null)
      setImageFiles([])
      setImagePreviews([])
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "Product could not be saved. Check MongoDB and try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const confirmDeleteListing = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    setStatusMessage("")
    try {
      const response = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Product could not be deleted.")
      setListings((current) => current.filter((item) => item.id !== deleteTarget.id))
      setLowStock((current) => current.filter((item) => item.id !== deleteTarget.id))
      setDashboardStats((current) => ({
        ...current,
        activeListings: deleteTarget.status === "Active" ? Math.max(0, current.activeListings - 1) : current.activeListings,
        lowStockCount: deleteTarget.stock <= 3 || deleteTarget.status === "Low stock" ? Math.max(0, current.lowStockCount - 1) : current.lowStockCount,
      }))
      setDeleteTarget(null)
      toast.success("Product deleted", { description: `${deleteTarget.name} was removed from MongoDB.` })
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Product could not be deleted. Check MongoDB and try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const saveRevenueGoal = () => {
  const value = Number(goalInput)
  if (!value || value <= 0) return
  localStorage.setItem("seller_revenue_goal", String(value))
  setRevenueGoal(value)
  toast.success("Goal saved", { description: `Monthly target set to $${value.toFixed(2)}` })
}

  /* ── Navigation tabs ─── */
  const tabs: { id: DashView; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "listings", label: "Listings", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
  ]

  return (
    <>
      {/* ── Studio Profile Card ───────────────────────── */}
      <section className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-white shadow-sm">
        {/* Cover */}
        <div className="relative h-36 sm:h-44">
          <ShimmerImage src={featuredSeller.cover} alt="" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>

        <div className="px-5 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar + info */}
            <div className="flex items-end gap-4">
              <div className="relative -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-lg border-4 border-white shadow-lg">
                <ShimmerImage src={featuredSeller.avatar} alt="" fill className="object-cover" unoptimized />
                <span className="absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded bg-[#063f34] text-white">
                  <BadgeCheck size={12} />
                </span>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-[#063f34]">
                    {user.studioName ?? user.name}
                  </h1>
                  <span className="rounded bg-[#edf7f4] px-2 py-0.5 text-[10px] font-black text-[#063f34] uppercase tracking-wide">
                    Verified Seller
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-[#6d7a75]">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {user.location ?? "Studio location"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-[#c8651b] text-[#c8651b]" />
                    {featuredSeller.rating} · {featuredSeller.reviews} reviews
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    {dashboardStats.activeListings} active listings
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-lg bg-[#063f34] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#075144] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
              >
                <PackagePlus size={15} />
                Add product
              </button>
            </div>
          </div>

          {user.story && (
            <p className="mt-3 text-sm leading-6 text-[#53615c] max-w-2xl">
              {user.story}
            </p>
          )}
        </div>

        {/* Tab navigation */}
        <div className="border-t border-[#e8edeb] px-5">
          <div className="flex gap-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveView(id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors -mb-px ${
                  activeView === id
                    ? "border-[#063f34] text-[#063f34]"
                    : "border-transparent text-[#6d7a75] hover:text-[#063f34]"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Low stock alert banner ─── */}
      {lowStock.length > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
          <Eye size={16} className="mt-0.5 shrink-0 text-[#92400e]" />
          <div>
            <p className="text-sm font-bold text-[#78350f]">
              {lowStock.length} listing{lowStock.length > 1 ? "s" : ""} running low
            </p>
            <p className="mt-0.5 text-xs text-[#92400e]">
              {lowStock.map((l) => l.name).join(", ")} — update quantities before they sell out.
            </p>
          </div>
        </div>
      )}

      {statusMessage && (
        <Alert className="mt-4 border-[#d8dfdc] bg-white text-[#53615c]">
          <Info />
          <AlertTitle>Seller dashboard notice</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* OVERVIEW TAB                                 */}
      {/* ════════════════════════════════════════════ */}
      {activeView === "overview" && (
        <div className="mt-4 space-y-4">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, value, hint, icon: Icon, accent, bg }) => (
              <div
                key={label}
                className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-white shadow-sm"
              >
                <div className="h-1 w-full" style={{ backgroundColor: accent }} />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: bg, color: accent }}
                    >
                      <Icon size={17} />
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#9aada8]">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-black text-[#191c1c]">{value}</p>
                  <p className="mt-0.5 text-xs text-[#6d7a75]">{hint}</p>
                </div>
              </div>
            ))}
          </div>


            <section className="rounded-lg border border-[#d8dfdc] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Performance</p>
                <h2 className="mt-1 text-base font-black text-[#063f34]">Revenue — Last 7 Days</h2>
              </div>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef1ef" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9aada8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#9aada8" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#063f34" strokeWidth={2} dot={false} name="Revenue ($)" />
                    <Line type="monotone" dataKey="orders" stroke="#c8651b" strokeWidth={2} dot={false} name="Orders" />
                    <Line type="monotone" dataKey="units" stroke="#1d4ed8" strokeWidth={2} dot={false} name="Units Sold" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Revenue Goal */}
<section className="rounded-lg border border-[#d8dfdc] bg-white shadow-sm overflow-hidden">
  <div className="border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
    <p className="text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Monthly Target</p>
    <h2 className="mt-1 text-base font-black text-[#063f34]">Revenue Goal</h2>
  </div>
  <div className="p-5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-[#191c1c]">
        ${thisMonthRevenue.toFixed(2)} earned this month
      </span>
      <span className="text-xs font-bold text-[#9aada8]">
        Goal: ${revenueGoal > 0 ? revenueGoal.toFixed(2) : "—"}
      </span>
    </div>

    {revenueGoal > 0 && (
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#f4f6f5]">
        <div
          className="h-full rounded-full bg-[#0b5345] transition-all duration-500"
          style={{ width: `${Math.min((thisMonthRevenue / revenueGoal) * 100, 100)}%` }}
        />
      </div>
    )}

    <div className="mt-4 flex gap-2">
      <input
        type="number"
        value={goalInput}
        onChange={(e) => setGoalInput(e.target.value)}
        placeholder="Set monthly goal ($)"
        className="h-9 flex-1 rounded-lg border border-[#d8dfdc] bg-white px-3 text-sm outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
      />
      <button
        onClick={saveRevenueGoal}
        className="rounded-lg bg-[#063f34] px-4 py-2 text-sm font-bold text-white hover:bg-[#075144]"
      >
        Save
      </button>
    </div>
  </div>
</section>
          {/* Bottom row: top products + category breakdown */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Top Products */}
            <section className="rounded-lg border border-[#d8dfdc] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Performance</p>
                <h2 className="mt-1 text-base font-black text-[#063f34]">Top Products</h2>
              </div>
              <div className="divide-y divide-[#eef1ef]">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-14" />
                    </div>
                  ))
                ) : topProducts.length > 0 ? (
                  topProducts.map((product, i) => (
                    <div key={product.name} className="flex items-center gap-3 px-5 py-3 hover:bg-[#f9faf9]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f5] text-xs font-black text-[#9aada8]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#191c1c]">{product.name}</p>
                        <p className="text-xs text-[#9aada8]">{product.units} units sold</p>
                      </div>
                      <p className="text-sm font-black text-[#063f34]">${product.revenue.toFixed(2)}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <ShoppingBag size={24} className="text-[#d8dfdc]" />
                    <p className="text-sm font-semibold text-[#9aada8]">No sales yet</p>
                    <p className="text-xs text-[#bfc9c4]">Revenue by product will appear after your first order</p>
                  </div>
                )}
              </div>
            </section>

            {/* Revenue by category */}
            <section className="rounded-lg border border-[#d8dfdc] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Breakdown</p>
                <h2 className="mt-1 text-base font-black text-[#063f34]">Revenue by Category</h2>
              </div>
              <div className="p-5 space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  ))
                ) : categoryBreakdown.length > 0 ? (
                  categoryBreakdown.map(({ cat, revenue, count }) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-[#191c1c]">{cat}</span>
                        <span className="text-xs font-bold text-[#063f34]">${revenue.toFixed(2)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4f6f5]">
                        <div
                          className="h-full rounded-full bg-[#0b5345] transition-all duration-500"
                          style={{ width: `${(revenue / maxCategoryRevenue) * 100}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-[#9aada8]">{count} unit{count !== 1 ? "s" : ""} sold</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <BarChart3 size={24} className="text-[#d8dfdc]" />
                    <p className="text-sm font-semibold text-[#9aada8]">No data yet</p>
                    <p className="text-xs text-[#bfc9c4]">Category breakdown appears after your first sale</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Recent orders mini-table */}
          <section className="rounded-lg border border-[#d8dfdc] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Recent Activity</p>
                <h2 className="mt-1 text-base font-black text-[#063f34]">Latest Orders</h2>
              </div>
              <button
                onClick={() => setActiveView("orders")}
                className="flex items-center gap-1 text-xs font-bold text-[#063f34] hover:underline"
              >
                View all <ChevronRight size={13} />
              </button>
            </div>
            <OrdersList orders={orders.slice(0, 4)} isLoading={isLoading} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} />
          </section>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* LISTINGS TAB                                 */}
      {/* ════════════════════════════════════════════ */}
      {activeView === "listings" && (
        <div className="mt-4">
          <section className="rounded-lg border border-[#d8dfdc] bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Seller Tools</p>
                <h2 className="mt-1 flex items-center gap-2 text-base font-black text-[#063f34]">
                  Product Listings
                  <span className="rounded bg-[#edf7f4] px-2 py-0.5 text-xs font-black text-[#063f34]">
                    {listings.length}
                  </span>
                </h2>
              </div>
              <div className="flex gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[#9aada8]" size={13} />
                  <input
                    value={listingQuery}
                    onChange={(e) => setListingQuery(e.target.value)}
                    placeholder="Search listings…"
                    className="h-9 rounded-lg border border-[#d8dfdc] bg-white pl-8 pr-3 text-sm font-medium outline-none placeholder:text-[#bfc9c4] focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8 w-48 transition-all"
                  />
                </div>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#063f34] px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#075144] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
                >
                  <PackagePlus size={14} />
                  Add
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e8edeb] bg-[#f4f6f5]">
                    {["Product", "Status", "Stock", "Price", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#9aada8]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef1ef]">
                  {isLoading ? (
                    <TableSkeleton rows={5} />
                  ) : filteredListings.length > 0 ? (
                    filteredListings.map((product) => (
                      <tr key={product.id} className="group transition-colors hover:bg-[#f9faf9]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#f4f6f5]">
                              <ShimmerImage src={product.image} alt="" fill className="object-cover" unoptimized />
                            </div>
                            <div>
                              <p className="font-bold text-[#191c1c]">{product.name}</p>
                              <p className="text-xs text-[#9aada8] uppercase tracking-wide font-medium">
                                {product.category}
                                {product.materials?.[0] ? ` · ${product.materials[0]}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <ListingStatusBadge status={product.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                              product.stock <= 3
                                ? "bg-[#fff0f0] text-[#ba1a1a]"
                                : "bg-[#f4f6f5] text-[#53615c]"
                            }`}
                          >
                            {product.stock} left
                          </span>
                        </td>
                        <td className="px-4 py-3 font-black text-[#191c1c]">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditModal(product)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#53615c] transition-colors hover:bg-[#edf7f4] hover:text-[#063f34]"
                            >
                              <Edit3 size={13} />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(product)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#8b1f1f] transition-colors hover:bg-[#fff0f0]"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Package size={28} className="text-[#d8dfdc]" />
                          <p className="text-sm font-bold text-[#9aada8]">
                            {listingQuery ? "No listings match your search" : "No listings yet"}
                          </p>
                          <p className="text-xs text-[#bfc9c4]">
                            {listingQuery ? "Try a different search term" : "Add your first product to publish it to the marketplace"}
                          </p>
                          {!listingQuery && (
                            <button
                              onClick={openAddModal}
                              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#063f34] px-4 py-2 text-sm font-bold text-white shadow-sm"
                            >
                              <PackagePlus size={14} />
                              Add first product
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* ORDERS TAB                                   */}
      {/* ════════════════════════════════════════════ */}
      {activeView === "orders" && (
        <div className="mt-4">
          <section className="rounded-lg border border-[#d8dfdc] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Seller Orders</p>
              <h2 className="mt-1 flex items-center gap-2 text-base font-black text-[#063f34]">
                All Orders
                <span className="rounded bg-[#edf7f4] px-2 py-0.5 text-xs font-black text-[#063f34]">
                  {orders.length}
                </span>
              </h2>
            </div>
            <OrdersList orders={orders} isLoading={isLoading} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} />
          </section>
        </div>
      )}

      {/* ── Add / Edit product dialog ─── */}
      <Dialog open={Boolean(modalMode)} onOpenChange={(open) => { if (!open) closeModal() }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[760px] gap-0 overflow-hidden border-[#cfd9d4] bg-[#f4f6f5] p-0 text-[#191c1c] shadow-2xl sm:max-w-[760px] rounded-lg">
          <form
            ref={formRef}
            onSubmit={saveListing}
            className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto]"
            noValidate
          >
            <div className="border-b border-[#d8dfdc] bg-white px-5 py-4">
              <DialogHeader className="pr-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#9a4d10]">
                  {modalMode === "add" ? "New listing" : "Edit listing"}
                </p>
                <DialogTitle className="text-lg font-black text-[#063f34]">
                  {modalMode === "add" ? "Add product" : draft.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-[#6d7a75]">
                  Add enough detail for buyers to understand materials, condition, pricing, and availability.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="grid gap-4 overflow-y-auto bg-[#f4f6f5] p-5 sm:grid-cols-2">
              <FormInput label="Product name" name="name" value={draft.name} error={errors.name?.[0]} onChange={(value) => updateDraft("name", value)} className="sm:col-span-2" />
              <ProductImageUpload image={draft.image} galleryImages={draft.galleryImages ?? []} previews={imagePreviews} imageFiles={imageFiles} error={errors.image?.[0]} onChange={updateImageFiles} />
              <FormSelect label="Category" name="category" value={draft.category} options={["Ceramics", "Textiles", "Woodwork", "Jewelry"]} error={errors.category?.[0]} onChange={(value) => updateDraft("category", value)} />
              <FormSelect label="Status" name="status" value={draft.status} options={["Active", "Low stock", "Draft"]} error={errors.status?.[0]} onChange={(value) => updateDraft("status", value)} />
              <FormInput label="Price ($)" name="price" type="number" value={draft.price} error={errors.price?.[0]} onChange={(value) => updateDraft("price", value)} />
              <FormInput label="Stock quantity" name="stock" type="number" value={draft.stock} error={errors.stock?.[0]} onChange={(value) => updateDraft("stock", value)} />
              <FormInput label="Materials" name="materials" value={draft.materials.join(", ")} helper="Separate materials with commas." onChange={updateMaterials} className="sm:col-span-2" />
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53615c]">Description</span>
                <textarea
                  id="product-description"
                  name="description"
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "product-description-error" : "product-description-help"}
                  value={draft.description}
                  onChange={(event) => updateDraft("description", event.target.value)}
                  rows={4}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8 ${errors.description ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
                />
                {errors.description?.[0] ? (
                  <span id="product-description-error" className="mt-1 block text-xs font-semibold text-[#ba1a1a]">{errors.description[0]}</span>
                ) : (
                  <span id="product-description-help" className="mt-1 block text-xs text-[#9aada8]">Include material, process, care, and what makes it unique.</span>
                )}
              </label>
              {formMessage && (
                <Alert variant="destructive" className="border-[#f0b8b8] bg-[#fff7f7] text-[#7a1d1d] sm:col-span-2 rounded-lg">
                  <Info />
                  <AlertTitle>Product was not saved</AlertTitle>
                  <AlertDescription>{formMessage}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-[#d8dfdc] bg-white px-5 py-4">
              <button type="button" onClick={closeModal} className="rounded-lg border border-[#d8dfdc] px-4 py-2 text-sm font-bold text-[#53615c] transition-colors hover:bg-[#f4f6f5]">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#063f34] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#075144] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving && <Loader2 className="animate-spin" size={14} />}
                {modalMode === "add" ? "Add product" : "Save changes"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm dialog ─── */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open && !isDeleting) setDeleteTarget(null) }}>
        <DialogContent className="max-w-[420px] border-[#f0b8b8] bg-white text-[#191c1c] rounded-lg overflow-hidden p-0">
          <div className="bg-[#fff7f7] px-6 pt-6 pb-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffe4e4]">
              <AlertTriangle size={20} className="text-[#ba1a1a]" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-base font-black text-[#191c1c]">Delete product?</DialogTitle>
              <DialogDescription className="text-sm text-[#53615c] mt-1">
                This will permanently remove <span className="font-bold text-[#191c1c]">{deleteTarget?.name}</span> from your seller listings.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="rounded-lg border border-[#d8dfdc] px-4 py-2 text-sm font-bold text-[#53615c] transition-colors hover:bg-[#f4f6f5] disabled:opacity-70">
              Cancel
            </button>
            <button type="button" onClick={confirmDeleteListing} disabled={isDeleting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ba1a1a] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#9e1515] disabled:opacity-70">
              {isDeleting && <Loader2 className="animate-spin" size={14} />}
              Delete product
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ── Orders List Component ─────────────────────────── */

function OrdersList({
  orders,
  isLoading,
  expandedOrder,
  setExpandedOrder,
}: {
  orders: SellerOrder[]
  isLoading: boolean
  expandedOrder: string | null
  setExpandedOrder: (id: string | null) => void
}) {
  if (isLoading) {
    return (
      <div className="divide-y divide-[#eef1ef]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-40" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <ShoppingBag size={28} className="text-[#d8dfdc]" />
        <p className="text-sm font-bold text-[#9aada8]">No orders yet</p>
        <p className="text-xs text-[#bfc9c4]">Orders for your studio will appear here after checkout</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#eef1ef]">
      {orders.map((order) => {
        const isExpanded = expandedOrder === order.id
        const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        return (
          <div key={order.id}>
            <button
              type="button"
              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f9faf9]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f5]">
                <Package size={16} className="text-[#9aada8]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-black text-[#063f34]">{order.id}</p>
                <p className="mt-0.5 truncate text-xs text-[#9aada8]">
                  {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
              <p className="text-sm font-black text-[#191c1c] shrink-0">${orderTotal.toFixed(2)}</p>
              <span className="text-[#9aada8]">
                {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </span>
            </button>

            {isExpanded && (
              <div className="border-t border-[#eef1ef] bg-[#f9faf9] px-5 py-3">
                <div className="ml-0 rounded-lg border border-[#e8edeb] bg-white overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#eef1ef] bg-[#f4f6f5]">
                        <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Item</th>
                        <th className="px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Qty</th>
                        <th className="px-4 py-2 text-right text-[10px] font-black uppercase tracking-widest text-[#9aada8]">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef1ef]">
                      {order.items.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-4 py-2.5 font-medium text-[#191c1c]">{item.name}</td>
                          <td className="px-4 py-2.5 text-center text-[#53615c]">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-[#191c1c]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-[#e8edeb] bg-[#f9faf9]">
                        <td colSpan={2} className="px-4 py-2 text-right text-xs font-black uppercase tracking-wide text-[#9aada8]">Order total</td>
                        <td className="px-4 py-2 text-right font-black text-[#063f34]">${orderTotal.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Status Badges ─────────────────────────────────── */

function ListingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-[#edf7f4] text-[#063f34]",
    "Low stock": "bg-[#fff4ec] text-[#9a4d10]",
    Draft: "bg-[#f4f6f5] text-[#6d7a75]",
  }
  return (
    <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${styles[status] ?? "bg-[#f4f6f5] text-[#6d7a75]"}`}>
      {status}
    </span>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-[#fff4ec] text-[#9a4d10]",
    Shipped: "bg-[#eff6ff] text-[#1d4ed8]",
    Delivered: "bg-[#edf7f4] text-[#063f34]",
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-bold ${styles[status] ?? "bg-[#f4f6f5] text-[#6d7a75]"}`}>
      <PackageCheck size={11} />
      {status}
    </span>
  )
}

/* ── Product Image Upload ──────────────────────────── */

function ProductImageUpload({
  image, galleryImages, previews, imageFiles, error, onChange,
}: {
  image: string
  galleryImages: string[]
  previews: string[]
  imageFiles: File[]
  error?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const currentImages = [image, ...galleryImages].filter(Boolean)
  const previewImages = previews.length ? [...currentImages, ...previews] : currentImages
  const displayImage = previewImages[0]

  return (
    <label className="sm:col-span-2">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53615c]">Product images</span>
      <div className={`grid gap-4 rounded-lg border bg-white p-3 sm:grid-cols-[160px_1fr] ${error ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f4f6f5]">
          {displayImage ? (
            <ShimmerImage src={displayImage} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-xs font-semibold text-[#9aada8] px-3">
              Display image preview
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <input
            id="product-images"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "product-images-error" : "product-images-help"}
            onChange={onChange}
            className="block w-full text-sm text-[#53615c] file:mr-3 file:rounded-lg file:border-0 file:bg-[#063f34] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
          />
          <span id="product-images-help" className="mt-2 text-xs text-[#9aada8]">
            Upload up to 6 JPG, PNG, or WebP images. The first image becomes the display image.
          </span>
          {imageFiles.length > 0 && (
            <span className="mt-1.5 text-xs font-bold text-[#063f34]">
              {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""} selected
            </span>
          )}
          {previewImages.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {previewImages.slice(1, 6).map((previewImage, index) => (
                <div key={`${previewImage}-${index}`} className="relative aspect-square overflow-hidden rounded bg-[#f4f6f5]">
                  <ShimmerImage src={previewImage} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <span id="product-images-error" className="mt-1 block text-xs font-semibold text-[#ba1a1a]">{error}</span>}
    </label>
  )
}

/* ── Form Input ────────────────────────────────────── */

function FormInput({
  label, name, value, onChange, error, helper, type = "text", className = "",
}: {
  label: string
  name: string
  value: string | number
  onChange: (value: string) => void
  error?: string
  helper?: string
  type?: string
  className?: string
}) {
  const inputId = `product-${name}`
  const errorId = `${inputId}-error`
  const helpId = `${inputId}-help`

  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53615c]">{label}</span>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        min={type === "number" ? 0 : undefined}
        step={label.toLowerCase().includes("price") ? "0.01" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helper ? helpId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`h-9 w-full rounded-lg border bg-white px-3 text-sm font-medium outline-none transition-all focus:ring-4 ${
          error
            ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/10"
            : "border-[#d8dfdc] focus:border-[#063f34] focus:ring-[#063f34]/8"
        }`}
      />
      {error ? (
        <span id={errorId} className="mt-1 block text-xs font-semibold text-[#ba1a1a]">{error}</span>
      ) : helper ? (
        <span id={helpId} className="mt-1 block text-xs text-[#9aada8]">{helper}</span>
      ) : null}
    </label>
  )
}

/* ── Form Select ───────────────────────────────────── */

function FormSelect({
  label, name, value, options, onChange, error,
}: {
  label: string
  name: string
  value: string
  options: string[]
  onChange: (value: string) => void
  error?: string
}) {
  const selectId = `product-${name}`
  const errorId = `${selectId}-error`

  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#53615c]">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full bg-white text-[#191c1c] text-sm font-medium ${error ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
        >
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="z-[120] border border-[#cfd9d4] bg-white text-[#191c1c] shadow-xl">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-sm font-medium text-[#25332e] focus:bg-[#edf7f4] focus:text-[#063f34]">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span id={errorId} className="mt-1 block text-xs font-semibold text-[#ba1a1a]">{error}</span>}
    </label>
  )
}

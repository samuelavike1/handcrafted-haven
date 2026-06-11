"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Users,
  TrendingUp,
  Package,
  Bell,
  ChevronRight,
  Circle,
  Menu,
  X,
} from "lucide-react"
import { toast } from "sonner"
import AdminCreateForm from "@/components/admin-create-form"
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
import type { AppUser } from "@/lib/auth"
import type { OrderDocument } from "@/lib/server-orders"
import type { ProductDocument } from "@/lib/server-products"

type AdminStats = {
  revenue: number
  users: number
  sellers: number
  products: number
  orders: number
  lowStock: number
  unfulfilled: number
}

type AdminView = "overview" | "orders" | "products" | "users" | "access"

type DeleteTarget =
  | { type: "user"; id: string; label: string }
  | { type: "product"; id: string; label: string }
  | { type: "order"; id: string; label: string }

export default function AdminWorkspaceClient({
  currentUserId,
  initialUsers,
  initialProducts,
  initialOrders,
  initialStats,
}: {
  currentUserId: string
  initialUsers: AppUser[]
  initialProducts: ProductDocument[]
  initialOrders: OrderDocument[]
  initialStats: AdminStats
}) {
  const [users, setUsers] = useState(initialUsers)
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [activeView, setActiveView] = useState<AdminView>("overview")
  const [query, setQuery] = useState("")
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0)
    return {
      ...initialStats,
      revenue,
      users: users.length,
      sellers: users.filter((user) => user.role === "seller").length,
      products: products.length,
      orders: orders.length,
      lowStock: products.filter(
        (product) => product.stock <= 3 || product.status === "Low stock"
      ).length,
      unfulfilled: orders.filter((order) => order.status === "Processing")
        .length,
    }
  }, [initialStats, orders, products, users])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredOrders = orders.filter((order) =>
    [
      order.id,
      order.buyerEmail,
      order.status,
      order.customer?.name ?? "",
      order.customer?.city ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  )
  const filteredProducts = products.filter((product) =>
    [product.name, product.seller, product.category, product.status]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  )
  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.role, user.studioName ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  )

  const statCards = [
    {
      label: "Gross Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      hint: `${stats.orders} total orders`,
      icon: TrendingUp,
      accent: "#0b5345",
      bg: "#edf7f4",
      trend: "+12.5%",
    },
    {
      label: "Open Fulfillment",
      value: stats.unfulfilled.toString(),
      hint: "Awaiting shipment",
      icon: ClipboardList,
      accent: "#9a4d10",
      bg: "#fff4ec",
      trend: stats.unfulfilled > 0 ? "Needs attention" : "All clear",
    },
    {
      label: "Marketplace Users",
      value: stats.users.toString(),
      hint: `${stats.sellers} seller accounts`,
      icon: Users,
      accent: "#1d4ed8",
      bg: "#eff6ff",
      trend: "+3 this week",
    },
    {
      label: "Inventory Alerts",
      value: stats.lowStock.toString(),
      hint: `${stats.products} products tracked`,
      icon: Boxes,
      accent: "#7c3aed",
      bg: "#f5f3ff",
      trend: stats.lowStock > 0 ? "Review needed" : "Healthy",
    },
  ]

  const navigation = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "products", label: "Products", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "access", label: "Admin Access", icon: ShieldCheck },
  ] satisfies { id: AdminView; label: string; icon: typeof LayoutDashboard }[]

  const updateOrder = async (
    orderId: string,
    status: OrderDocument["status"]
  ) => {
    setUpdatingOrderId(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Order update failed.")

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.order : order))
      )
      toast.success("Order updated", {
        description: `${orderId} is now ${status}.`,
      })
    } catch (error) {
      toast.error("Order was not updated", {
        description:
          error instanceof Error ? error.message : "Try updating it again.",
      })
    } finally {
      setUpdatingOrderId("")
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const endpoint =
      deleteTarget.type === "user"
        ? `/api/admin/users/${deleteTarget.id}`
        : deleteTarget.type === "product"
          ? `/api/products/${deleteTarget.id}`
          : `/api/admin/orders/${deleteTarget.id}`

    setIsDeleting(true)
    try {
      const response = await fetch(endpoint, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Delete failed.")

      if (deleteTarget.type === "user") {
        setUsers((current) =>
          current.filter((user) => user.id !== deleteTarget.id)
        )
      }
      if (deleteTarget.type === "product") {
        setProducts((current) =>
          current.filter((product) => product.id !== deleteTarget.id)
        )
      }
      if (deleteTarget.type === "order") {
        setOrders((current) =>
          current.filter((order) => order.id !== deleteTarget.id)
        )
      }

      toast.success("Deleted", {
        description: `${deleteTarget.label} was removed.`,
      })
      setDeleteTarget(null)
    } catch (error) {
      toast.error("Delete failed", {
        description:
          error instanceof Error ? error.message : "Try the action again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const currentNavItem = navigation.find((item) => item.id === activeView)

  return (
    <div className="min-h-screen bg-[#f4f6f5] text-[#191c1c]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#062f28] text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f7b071]">
                  <ShoppingBag size={16} className="text-[#062f28]" />
                </div>
                <div>
                  <p className="text-[11px] font-black tracking-[0.14em] text-[#f7b071] uppercase">
                    Handcrafted Haven
                  </p>
                  <p className="text-base leading-tight font-black text-white">
                    Admin Console
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 text-white/60 hover:text-white lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Alerts pill */}
          {(stats.unfulfilled > 0 || stats.lowStock > 0) && (
            <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-[#f7b071]/15 px-3 py-2.5">
              <Bell size={13} className="shrink-0 text-[#f7b071]" />
              <p className="text-xs font-semibold text-[#f7b071]">
                {stats.unfulfilled > 0
                  ? `${stats.unfulfilled} orders need action`
                  : `${stats.lowStock} items low stock`}
              </p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 pt-4">
            <p className="mb-2 px-3 text-[10px] font-black tracking-widest text-white/35 uppercase">
              Navigation
            </p>
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveView(id)
                  setSidebarOpen(false)
                }}
                className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 ${
                  activeView === id
                    ? "bg-white text-[#063f34] shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    activeView === id
                      ? "bg-[#063f34]/10 text-[#063f34]"
                      : "bg-white/10 text-white/70 group-hover:bg-white/15 group-hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                </span>
                {label}
                {activeView === id && (
                  <ChevronRight
                    size={14}
                    className="ml-auto text-[#063f34]/60"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* System status footer */}
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Circle size={7} className="fill-emerald-400 text-emerald-400" />
              <p className="text-xs font-bold text-white/80">System online</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white/8 px-3 py-2">
                <p className="text-[10px] text-white/45">Orders</p>
                <p className="text-sm font-black text-white">{stats.orders}</p>
              </div>
              <div className="rounded-lg bg-white/8 px-3 py-2">
                <p className="text-[10px] text-white/45">Products</p>
                <p className="text-sm font-black text-white">
                  {stats.products}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b border-[#d8dfdc] bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-[#d8dfdc] p-2 text-[#53615c] hover:bg-[#f4f6f5] lg:hidden"
              >
                <Menu size={18} />
              </button>

              {/* Breadcrumb */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-xs text-[#9a7a6a]">
                  <span className="font-medium">Admin</span>
                  <ChevronRight size={12} />
                  <span className="font-bold text-[#063f34]">
                    {currentNavItem?.label}
                  </span>
                </div>
                <h2 className="mt-0.5 text-lg leading-tight font-black text-[#063f34]">
                  Marketplace Control Center
                </h2>
              </div>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[#9aada8]"
                  size={15}
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-9 w-[300px] rounded-md border border-[#d8dfdc] bg-[#f4f6f5] pr-3 pl-9 text-sm font-medium transition-all outline-none placeholder:text-[#9aada8] focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
                  placeholder="Search orders, products, users…"
                />
              </div>
            </div>

            {/* Mobile search */}
            <div className="border-t border-[#d8dfdc] px-4 py-2.5 md:hidden">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[#9aada8]"
                  size={15}
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-9 w-full rounded-md border border-[#d8dfdc] bg-[#f4f6f5] pr-3 pl-9 text-sm font-medium transition-all outline-none placeholder:text-[#9aada8] focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
                  placeholder="Search…"
                />
              </div>
            </div>
          </header>

          {/* Page body */}
          <div className="flex-1 space-y-5 p-4 sm:p-6">
            {/* ── Stat cards ── */}
            {(activeView === "overview" || activeView === "orders") && (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map(
                  ({ label, value, hint, icon: Icon, accent, bg, trend }) => (
                    <article
                      key={label}
                      className="group relative overflow-hidden rounded-lg border border-[#d8dfdc] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* Coloured top strip */}
                      <div
                        className="h-1 w-full"
                        style={{ backgroundColor: accent }}
                      />

                      <div className="p-5">
                        {/* Icon row */}
                        <div className="flex items-center justify-between">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{ backgroundColor: bg, color: accent }}
                          >
                            <Icon size={18} />
                          </div>
                          <span
                            className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                            style={{ backgroundColor: bg, color: accent }}
                          >
                            {trend}
                          </span>
                        </div>

                        {/* Text */}
                        <p className="mt-4 text-[11px] font-bold tracking-widest text-[#9aada8] uppercase">
                          {label}
                        </p>
                        <p className="mt-1 text-2xl font-black text-[#191c1c]">
                          {value}
                        </p>
                        <p className="mt-1 text-xs text-[#6d7a75]">{hint}</p>
                      </div>
                    </article>
                  )
                )}
              </section>
            )}

            {/* ── Overview ── */}
            {activeView === "overview" && (
              <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
                <OrdersTable
                  orders={filteredOrders.slice(0, 8)}
                  updatingOrderId={updatingOrderId}
                  onStatusChange={updateOrder}
                  onDelete={(order) =>
                    setDeleteTarget({
                      type: "order",
                      id: order.id,
                      label: order.id,
                    })
                  }
                />
                <div className="grid content-start gap-5">
                  <OperationsPanel
                    title="Operational Alerts"
                    items={[
                      {
                        text: `${stats.unfulfilled} orders are still processing`,
                        type: stats.unfulfilled > 0 ? "warning" : "ok",
                      },
                      {
                        text: `${stats.lowStock} listings need inventory review`,
                        type: stats.lowStock > 0 ? "warning" : "ok",
                      },
                      {
                        text: `${stats.sellers} sellers have marketplace access`,
                        type: "info",
                      },
                    ]}
                  />
                </div>
              </div>
            )}

            {activeView === "orders" && (
              <OrdersTable
                orders={filteredOrders}
                updatingOrderId={updatingOrderId}
                onStatusChange={updateOrder}
                onDelete={(order) =>
                  setDeleteTarget({
                    type: "order",
                    id: order.id,
                    label: order.id,
                  })
                }
              />
            )}

            {activeView === "products" && (
              <ProductsTable
                products={filteredProducts}
                onDelete={(product) =>
                  setDeleteTarget({
                    type: "product",
                    id: product.id,
                    label: product.name,
                  })
                }
              />
            )}

            {activeView === "users" && (
              <UsersTable
                users={filteredUsers}
                currentUserId={currentUserId}
                onAddUser={() => setCreateUserOpen(true)}
                onDelete={(user) =>
                  setDeleteTarget({
                    type: "user",
                    id: user.id,
                    label: user.email,
                  })
                }
              />
            )}

            {activeView === "access" && (
              <section className="grid gap-5 lg:grid-cols-2">
                <OperationsPanel
                  title="Access Policy"
                  items={[
                    {
                      text: "Admin accounts can only be created by signed-in admins.",
                      type: "info",
                    },
                    {
                      text: "Deleting an account also clears active sessions for that user.",
                      type: "warning",
                    },
                    {
                      text: "The currently signed-in admin cannot delete their own account.",
                      type: "info",
                    },
                  ]}
                />
                <OperationsPanel
                  title="Account Controls"
                  items={[
                    {
                      text: "Use the Users section to create admin users.",
                      type: "info",
                    },
                    {
                      text: "User deletion is protected by a confirmation dialog.",
                      type: "ok",
                    },
                    {
                      text: "Search filters accounts, products, and orders across the current view.",
                      type: "ok",
                    },
                  ]}
                />
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ── Add user dialog ── */}
      <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
        <DialogContent className="max-w-[760px] overflow-hidden rounded-lg border-[#d8dfdc] bg-[#f4f6f5] p-0 text-[#191c1c]">
          <DialogHeader className="border-b border-[#d8dfdc] bg-white px-6 py-5 pr-14">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf7f4]">
                <ShieldCheck size={18} className="text-[#063f34]" />
              </div>
              <div>
                <DialogTitle className="text-base font-black text-[#063f34]">
                  Add Admin User
                </DialogTitle>
                <DialogDescription className="text-sm text-[#53615c]">
                  Create an admin account that can access this workspace.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-5">
            <AdminCreateForm
              onCreated={(user) => {
                setUsers((current) => [user, ...current])
                setCreateUserOpen(false)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Confirm delete dialog ── */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteTarget(null)
        }}
      >
        <DialogContent className="max-w-[420px] overflow-hidden rounded-lg border-[#f0b8b8] bg-white p-0 text-[#191c1c]">
          <div className="bg-[#fff7f7] px-6 pt-6 pb-4">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#ffe4e4]">
              <AlertTriangle size={22} className="text-[#ba1a1a]" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-[#191c1c]">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-[#53615c]">
                This action is permanent and cannot be undone. This will remove{" "}
                <span className="font-bold text-[#191c1c]">
                  {deleteTarget?.label}
                </span>{" "}
                from the system.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="rounded-lg border border-[#d8dfdc] px-5 py-2.5 text-sm font-bold text-[#53615c] transition-colors hover:bg-[#f4f6f5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-lg bg-[#ba1a1a] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#9e1515] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting && (
                <Loader2 className="mr-2 animate-spin" size={15} />
              )}
              Delete permanently
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ─────────────── Orders Table ─────────────── */

function OrdersTable({
  orders,
  updatingOrderId,
  onStatusChange,
  onDelete,
}: {
  orders: OrderDocument[]
  updatingOrderId: string
  onStatusChange: (id: string, status: OrderDocument["status"]) => void
  onDelete: (order: OrderDocument) => void
}) {
  return (
    <AdminTable
      title="Orders"
      eyebrow="Fulfillment Queue"
      count={orders.length}
    >
      {orders.length === 0 ? (
        <EmptyState message="No orders found" />
      ) : (
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e8edeb] bg-[#f4f6f5]">
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef1ef]">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="group transition-colors hover:bg-[#f9faf9]"
              >
                <td className="px-4 py-3.5">
                  <p className="font-mono text-xs font-black text-[#063f34]">
                    {order.id}
                  </p>
                  <p className="mt-0.5 text-xs text-[#9aada8]">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-[#191c1c]">
                    {order.customer?.name ?? "Guest buyer"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#9aada8]">
                    {order.buyerEmail}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full bg-[#edf7f4] px-2.5 py-0.5 text-xs font-bold text-[#063f34]">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-black text-[#191c1c]">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-4 py-3.5">
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      onStatusChange(order.id, value as OrderDocument["status"])
                    }
                    disabled={updatingOrderId === order.id}
                  >
                    <SelectTrigger className="h-8 w-[140px] rounded-lg border-[#d8dfdc] bg-white text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3.5">
                  <IconButton
                    label="Delete order"
                    onClick={() => onDelete(order)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminTable>
  )
}

/* ─────────────── Products Table ─────────────── */

function ProductsTable({
  products,
  onDelete,
}: {
  products: ProductDocument[]
  onDelete: (product: ProductDocument) => void
}) {
  return (
    <AdminTable
      title="Products"
      eyebrow="Inventory & Moderation"
      count={products.length}
    >
      {products.length === 0 ? (
        <EmptyState message="No products found" />
      ) : (
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e8edeb] bg-[#f4f6f5]">
              <Th>Product</Th>
              <Th>Seller</Th>
              <Th>Stock</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef1ef]">
            {products.map((product) => (
              <tr
                key={product.id}
                className="group transition-colors hover:bg-[#f9faf9]"
              >
                <td className="px-4 py-3.5">
                  <p className="font-bold text-[#191c1c]">{product.name}</p>
                  <p className="mt-0.5 text-xs font-medium tracking-wide text-[#9aada8] uppercase">
                    {product.category}
                  </p>
                </td>
                <td className="px-4 py-3.5 font-medium text-[#53615c]">
                  {product.seller}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      product.stock <= 3
                        ? "bg-[#fff0f0] text-[#ba1a1a]"
                        : "bg-[#edf7f4] text-[#063f34]"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </td>
                <td className="px-4 py-3.5 font-black text-[#191c1c]">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3.5">
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3.5">
                  <IconButton
                    label="Delete product"
                    onClick={() => onDelete(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminTable>
  )
}

/* ─────────────── Users Table ─────────────── */

function UsersTable({
  users,
  currentUserId,
  onAddUser,
  onDelete,
}: {
  users: AppUser[]
  currentUserId: string
  onAddUser: () => void
  onDelete: (user: AppUser) => void
}) {
  return (
    <AdminTable
      title="Users"
      eyebrow="Account Management"
      count={users.length}
      action={
        <button
          type="button"
          onClick={onAddUser}
          className="inline-flex items-center gap-2 rounded-lg bg-[#063f34] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#075144] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
        >
          <ShieldCheck size={15} />
          Add admin user
        </button>
      }
    >
      {users.length === 0 ? (
        <EmptyState message="No users found" />
      ) : (
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e8edeb] bg-[#f4f6f5]">
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Studio</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef1ef]">
            {users.map((user) => (
              <tr
                key={user.id}
                className="group transition-colors hover:bg-[#f9faf9]"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0b5345] to-[#063f34] text-xs font-black text-white uppercase">
                      {user.name?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="font-bold text-[#191c1c]">{user.name}</p>
                      <p className="mt-0.5 text-xs text-[#9aada8]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3.5 font-medium text-[#53615c]">
                  {user.studioName ?? <span className="text-[#bfc9c4]">—</span>}
                </td>
                <td className="px-4 py-3.5 font-medium text-[#9aada8]">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3.5">
                  <IconButton
                    label="Delete user"
                    disabled={user.id === currentUserId}
                    onClick={() => onDelete(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminTable>
  )
}

/* ─────────────── Operations Panel ─────────────── */

type AlertItem = {
  text: string
  type: "ok" | "warning" | "info"
}

function OperationsPanel({
  title,
  items,
}: {
  title: string
  items: AlertItem[]
}) {
  const typeStyles = {
    ok: {
      dot: "bg-emerald-400",
      bg: "bg-[#f4fdf8]",
      border: "border-[#c6ead9]",
      text: "text-[#1a5c3a]",
    },
    warning: {
      dot: "bg-amber-400",
      bg: "bg-[#fffbeb]",
      border: "border-[#fde68a]",
      text: "text-[#78350f]",
    },
    info: {
      dot: "bg-blue-400",
      bg: "bg-[#eff6ff]",
      border: "border-[#bfdbfe]",
      text: "text-[#1e40af]",
    },
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-white">
      <div className="border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
        <p className="text-[10px] font-black tracking-widest text-[#9aada8] uppercase">
          Admin Briefing
        </p>
        <h3 className="mt-1 text-base font-black text-[#063f34]">{title}</h3>
      </div>
      <div className="grid gap-3 p-4">
        {items.map((item, i) => {
          const s = typeStyles[item.type]
          return (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-lg border p-3.5 ${s.bg} ${s.border}`}
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.dot}`}
              />
              <p className={`text-sm leading-relaxed font-semibold ${s.text}`}>
                {item.text}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─────────────── Admin Table Wrapper ─────────────── */

function AdminTable({
  eyebrow,
  title,
  count,
  action,
  children,
}: {
  eyebrow: string
  title: string
  count?: number
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black tracking-widest text-[#9aada8] uppercase">
            {eyebrow}
          </p>
          <h3 className="mt-1 flex items-center gap-2 text-base font-black text-[#063f34]">
            {title}
            {count !== undefined && (
              <span className="rounded-full bg-[#edf7f4] px-2 py-0.5 text-xs font-black text-[#063f34]">
                {count}
              </span>
            )}
          </h3>
        </div>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}

/* ─────────────── Table Header Cell ─────────────── */

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-[10px] font-black tracking-widest text-[#9aada8] uppercase">
      {children}
    </th>
  )
}

/* ─────────────── Status Badges ─────────────── */

function ProductStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    "In stock": "bg-[#edf7f4] text-[#063f34]",
    "Low stock": "bg-[#fff4ec] text-[#9a4d10]",
    "Out of stock": "bg-[#fff0f0] text-[#ba1a1a]",
  }
  const cls = variants[status] ?? "bg-[#f4f6f5] text-[#53615c]"
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${cls}`}
    >
      {status}
    </span>
  )
}

function RoleBadge({ role }: { role: string }) {
  const variants: Record<string, string> = {
    admin: "bg-[#ede9fe] text-[#5b21b6]",
    seller: "bg-[#fff4ec] text-[#9a4d10]",
    buyer: "bg-[#eff6ff] text-[#1d4ed8]",
  }
  const cls = variants[role] ?? "bg-[#f4f6f5] text-[#53615c]"
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${cls}`}
    >
      {role}
    </span>
  )
}

/* ─────────────── Icon Button ─────────────── */

function IconButton({
  label,
  disabled,
  onClick,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#8b1f1f] transition-colors hover:bg-[#fff0f0] focus:ring-4 focus:ring-[#ba1a1a]/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
      title={label}
    >
      <Trash2 size={13} />
      Delete
    </button>
  )
}

/* ─────────────── Empty State ─────────────── */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f6f5]">
        <Search size={20} className="text-[#9aada8]" />
      </div>
      <p className="text-sm font-bold text-[#9aada8]">{message}</p>
      <p className="text-xs text-[#bfc9c4]">Try adjusting your search query</p>
    </div>
  )
}

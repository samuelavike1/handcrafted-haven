import { getUsers } from "@/lib/auth"
import { getOrdersForUser } from "@/lib/server-orders"
import { getProducts } from "@/lib/server-products"
import type { AppUser } from "@/lib/auth"

export async function getAdminWorkspaceData(admin: AppUser) {
  const [users, products, orders] = await Promise.all([
    getUsers(),
    getProducts(),
    getOrdersForUser(admin),
  ])

  const revenue = orders.reduce((sum, order) => sum + order.total, 0)
  const lowStock = products.filter(
    (product) => product.stock <= 3 || product.status === "Low stock"
  ).length
  const unfulfilled = orders.filter(
    (order) => order.status === "Processing"
  ).length

  return {
    users,
    products,
    orders,
    stats: {
      revenue,
      users: users.length,
      sellers: users.filter((user) => user.role === "seller").length,
      products: products.length,
      orders: orders.length,
      lowStock,
      unfulfilled,
    },
  }
}

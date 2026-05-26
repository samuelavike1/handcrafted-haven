import { NextResponse } from "next/server"
import { getProducts } from "@/lib/server-products"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import { getSellerAnalytics } from "@/lib/server-orders"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!hasRole(user, ["seller", "admin"])) {
      return NextResponse.json(
        { error: "Seller access is required." },
        { status: 401 }
      )
    }

    const [products, analytics] = await Promise.all([
      user.role === "seller"
        ? getProducts({ sellerId: user.id })
        : getProducts(),
      getSellerAnalytics(user),
    ])

    const lowStock = products.filter(
      (product) => product.stock <= 3 || product.status === "Low stock"
    )

    return NextResponse.json({
      products,
      orders: analytics.orders,
      lowStock,
      stats: {
        ...analytics.stats,
        activeListings: products.filter(
          (product) => product.status === "Active"
        ).length,
        lowStockCount: lowStock.length,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Seller dashboard data could not be loaded." },
      { status: 500 }
    )
  }
}

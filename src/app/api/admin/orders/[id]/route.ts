import { NextResponse } from "next/server"
import { deleteOrder, updateOrderStatus } from "@/lib/server-orders"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

const orderStatuses = new Set(["Processing", "Shipped", "Delivered"])

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser()
    if (!hasRole(currentUser, ["admin"])) {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    if (!orderStatuses.has(body.status)) {
      return NextResponse.json(
        { error: "Choose a valid order status." },
        { status: 400 }
      )
    }

    const order = await updateOrderStatus(id, body.status)
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json(
      { error: "Order could not be updated." },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser()
    if (!hasRole(currentUser, ["admin"])) {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const order = await deleteOrder(id)
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json(
      { error: "Order could not be deleted." },
      { status: 500 }
    )
  }
}

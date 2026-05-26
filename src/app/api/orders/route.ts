import { NextResponse } from "next/server"
import { checkoutSchema } from "@/lib/schemas"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import { createOrder, getOrdersForUser } from "@/lib/server-orders"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!hasRole(user, ["buyer", "admin"])) {
      return NextResponse.json(
        { error: "Buyer access is required to view orders." },
        { status: 401 }
      )
    }

    const orders = await getOrdersForUser(user)
    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json(
      { error: "Orders could not be loaded." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (user && !hasRole(user, ["buyer", "admin"])) {
      return NextResponse.json(
        { error: "Use a buyer account or continue without signing in." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await createOrder(parsed.data, user)
    if (result.error || !result.order) {
      return NextResponse.json(
        { error: result.error ?? "Order could not be created." },
        { status: 400 }
      )
    }

    return NextResponse.json({ order: result.order }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Order could not be created." },
      { status: 500 }
    )
  }
}

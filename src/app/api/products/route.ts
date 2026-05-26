import { NextResponse } from "next/server"
import { createProduct, getProducts } from "@/lib/server-products"
import { productInputSchema } from "@/lib/schemas"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const user = await getCurrentUser()
    const products =
      url.searchParams.get("mine") === "1" && user?.role === "seller"
        ? await getProducts({ sellerId: user.id })
        : await getProducts()
    return NextResponse.json({ products })
  } catch {
    return NextResponse.json(
      { error: "Could not connect to the product database." },
      { status: 503 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!hasRole(user, ["seller", "admin"])) {
      return NextResponse.json(
        { error: "Seller access is required to create products." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = productInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const product = await createProduct(parsed.data, user)
    return NextResponse.json({ product }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Product could not be saved." },
      { status: 500 }
    )
  }
}

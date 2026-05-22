import { NextResponse } from "next/server"
import { createProduct, getProducts } from "@/lib/server-products"
import { productInputSchema } from "@/lib/schemas"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

export async function GET() {
  try {
    const products = await getProducts()
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

    const product = await createProduct(parsed.data)
    return NextResponse.json({ product }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Product could not be saved." },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { deleteProduct, updateProduct } from "@/lib/server-products"
import { productInputSchema } from "@/lib/schemas"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser()
    if (!hasRole(user, ["seller", "admin"])) {
      return NextResponse.json(
        { error: "Seller access is required to update products." },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const parsed = productInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const product = await updateProduct(id, parsed.data, user)
    if (product === "forbidden") {
      return NextResponse.json(
        { error: "You can only update products from your seller studio." },
        { status: 403 }
      )
    }
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json(
      { error: "Product could not be updated." },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser()
    if (!hasRole(user, ["seller", "admin"])) {
      return NextResponse.json(
        { error: "Seller access is required to delete products." },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const product = await deleteProduct(id, user)

    if (product === "forbidden") {
      return NextResponse.json(
        { error: "You can only delete products from your seller studio." },
        { status: 403 }
      )
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json(
      { error: "Product could not be deleted." },
      { status: 500 }
    )
  }
}

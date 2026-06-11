import { NextResponse } from "next/server"
import { reviewInputSchema } from "@/lib/reviews"
import { getCurrentUser } from "@/lib/server-auth"
import { addProductReview } from "@/lib/server-products"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const parsed = reviewInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const user = await getCurrentUser()
    const result = await addProductReview(id, parsed.data, user)

    if (!result) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Review could not be submitted." },
      { status: 500 }
    )
  }
}

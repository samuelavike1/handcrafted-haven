import { NextResponse } from "next/server"
import { createUser, loginUser, sessionCookieName } from "@/lib/auth"
import { sellerRegistrationSchema } from "@/lib/schemas"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = sellerRegistrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await createUser({ ...parsed.data, role: "seller" })
    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    const session = await loginUser({
      email: parsed.data.email,
      password: parsed.data.password,
      role: "seller",
    })

    const response = NextResponse.json(
      {
        seller: {
          name: result.user.name,
          email: result.user.email,
          studioName: result.user.studioName,
          location: result.user.location,
          story: result.user.story,
        },
      },
      { status: 201 }
    )

    if (session.token) {
      response.cookies.set(sessionCookieName, session.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return response
  } catch {
    return NextResponse.json(
      { error: "Seller registration failed." },
      { status: 500 }
    )
  }
}

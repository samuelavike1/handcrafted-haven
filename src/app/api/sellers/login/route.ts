import { NextResponse } from "next/server"
import { loginUser, sessionCookieName } from "@/lib/auth"
import { sellerLoginSchema } from "@/lib/schemas"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = sellerLoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await loginUser({
      email: parsed.data.email,
      password: parsed.data.password,
      role: "seller",
    })

    if (result.error || !result.token || !result.user) {
      return NextResponse.json(
        { error: result.error ?? "Email or password is incorrect." },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      seller: {
        name: result.user.name,
        email: result.user.email,
        studioName: result.user.studioName,
      },
    })
    response.cookies.set(sessionCookieName, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json({ error: "Seller login failed." }, { status: 500 })
  }
}

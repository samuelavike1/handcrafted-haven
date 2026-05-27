import { NextResponse } from "next/server"
import { createUser, loginUser, sessionCookieName } from "@/lib/auth"
import { authRegistrationSchema } from "@/lib/schemas"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = authRegistrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (parsed.data.role === "admin") {
      return NextResponse.json(
        { error: "Admins can only be created by an authenticated admin." },
        { status: 403 }
      )
    }

    const result = await createUser(parsed.data)
    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    const session = await loginUser({
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role,
    })

    const response = NextResponse.json({ user: result.user }, { status: 201 })
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
      { error: "Account registration failed." },
      { status: 500 }
    )
  }
}

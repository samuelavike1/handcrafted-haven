import { NextResponse } from "next/server"
import { loginUser, sessionCookieName } from "@/lib/auth"
import { authLoginSchema } from "@/lib/schemas"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = authLoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await loginUser(parsed.data)
    if (result.error || !result.token || !result.user) {
      return NextResponse.json(
        { error: result.error ?? "Login failed." },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ user: result.user })
    response.cookies.set(sessionCookieName, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 })
  }
}

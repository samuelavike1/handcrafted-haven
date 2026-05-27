import { NextResponse } from "next/server"
import { createUser, getUsers } from "@/lib/auth"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import { adminCreateSchema } from "@/lib/schemas"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!hasRole(currentUser, ["admin"])) {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 401 }
      )
    }

    const users = await getUsers()
    return NextResponse.json({ users })
  } catch {
    return NextResponse.json(
      { error: "Users could not be loaded." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!hasRole(currentUser, ["admin"])) {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = adminCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await createUser({ ...parsed.data, role: "admin" })
    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    return NextResponse.json({ user: result.user }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Admin account could not be created." },
      { status: 500 }
    )
  }
}

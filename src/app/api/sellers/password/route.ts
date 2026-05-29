import { NextResponse } from "next/server"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import { updateUserPassword } from "@/lib/auth"
import { changePasswordSchema } from "@/lib/schemas"

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!hasRole(user, ["seller", "admin"])) {
      return NextResponse.json(
        { error: "Seller access is required." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = changePasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await updateUserPassword(user.id, parsed.data.currentPassword, parsed.data.newPassword)
    if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ ok: true })

  } catch {
    return NextResponse.json(
      { error: "Password could not be updated." },
      { status: 500 }
    )
  }
}
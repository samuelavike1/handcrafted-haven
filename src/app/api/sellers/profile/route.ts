import { NextResponse } from "next/server"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import { updateUserProfile } from "@/lib/auth"
import { updateProfileSchema } from "@/lib/schemas"

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
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updatedUser = await updateUserProfile(user.id, parsed.data)
    return NextResponse.json({ user: updatedUser })
  } catch {
    return NextResponse.json(
      { error: "Profile could not be updated." },
      { status: 500 }
    )
  }
}
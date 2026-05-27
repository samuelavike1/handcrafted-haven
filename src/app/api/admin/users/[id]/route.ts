import { NextResponse } from "next/server"
import { deleteUserById } from "@/lib/auth"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser()
    if (!hasRole(currentUser, ["admin"])) {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 401 }
      )
    }

    const { id } = await context.params
    if (id === currentUser.id) {
      return NextResponse.json(
        { error: "You cannot delete your own admin account." },
        { status: 400 }
      )
    }

    const user = await deleteUserById(id)
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json(
      { error: "User could not be deleted." },
      { status: 500 }
    )
  }
}

import { cookies } from "next/headers"
import { getDb } from "@/lib/mongodb"
import {
  findUserBySessionToken,
  sessionCookieName,
  type AppUser,
} from "@/lib/auth"
import type { UserRole } from "@/lib/schemas"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value
  const db = await getDb()
  return findUserBySessionToken(db, token)
}

export function hasRole(
  user: AppUser | null,
  roles: UserRole[]
): user is AppUser {
  return Boolean(user && roles.includes(user.role))
}

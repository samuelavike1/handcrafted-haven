import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto"
import type { Db } from "mongodb"
import { getDb } from "@/lib/mongodb"
import type {
  AuthLoginInput,
  AuthRegistrationInput,
  UserRole,
} from "@/lib/schemas"

export type AppUser = {
  id: string
  name: string
  email: string
  role: UserRole
  studioName?: string
  location?: string
  story?: string
  createdAt: string
  updatedAt: string
}

type UserDocument = AppUser & {
  passwordHash: string
  passwordSalt: string
}

export const sessionCookieName = "hh_session"
const usersCollection = "users"
const sessionsCollection = "sessions"
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7
let indexesReady: Promise<void> | null = null

async function ensureAuthIndexes(db: Db) {
  indexesReady ??= Promise.all([
    db
      .collection<UserDocument>(usersCollection)
      .createIndex({ email: 1 }, { unique: true }),
    db
      .collection(sessionsCollection)
      .createIndex({ token: 1 }, { unique: true }),
    db
      .collection(sessionsCollection)
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).then(() => undefined)

  await indexesReady
}

function hashPassword(
  password: string,
  salt = randomBytes(16).toString("hex")
) {
  const hash = scryptSync(password, salt, 64).toString("hex")
  return { hash, salt }
}

function verifyPassword(password: string, salt: string, storedHash: string) {
  const candidate = Buffer.from(hashPassword(password, salt).hash, "hex")
  const expected = Buffer.from(storedHash, "hex")

  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  )
}

function publicUser(user: UserDocument): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    studioName: user.studioName,
    location: user.location,
    story: user.story,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export async function createUser(input: AuthRegistrationInput) {
  const db = await getDb()
  await ensureAuthIndexes(db)
  const existing = await db
    .collection<UserDocument>(usersCollection)
    .findOne({ email: input.email.toLowerCase() })

  if (existing) {
    return { error: "An account already exists with this email." }
  }

  const now = new Date().toISOString()
  const { hash, salt } = hashPassword(input.password)
  const user: UserDocument = {
    id: `${input.role}-${randomUUID()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    role: input.role,
    studioName: input.role === "seller" ? input.studioName : undefined,
    location: input.role === "seller" ? input.location : undefined,
    story: input.role === "seller" ? input.story : undefined,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
  }

  await db.collection<UserDocument>(usersCollection).insertOne(user)
  return { user: publicUser(user) }
}

export async function loginUser(input: AuthLoginInput) {
  const db = await getDb()
  await ensureAuthIndexes(db)
  const query: { email: string; role?: UserRole } = {
    email: input.email.toLowerCase(),
  }
  if (input.role) query.role = input.role

  const user = await db.collection<UserDocument>(usersCollection).findOne(query)

  if (
    !user ||
    !verifyPassword(input.password, user.passwordSalt, user.passwordHash)
  ) {
    return { error: "Email or password is incorrect." }
  }

  const token = randomBytes(32).toString("hex")
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds * 1000)
  await db.collection(sessionsCollection).insertOne({
    token,
    userId: user.id,
    createdAt: now,
    expiresAt,
  })

  return { token, user: publicUser(user) }
}

export async function findUserBySessionToken(db: Db, token?: string) {
  if (!token) return null

  const session = await db.collection(sessionsCollection).findOne({ token })
  if (!session?.userId) return null
  if (
    session.expiresAt &&
    new Date(session.expiresAt).getTime() <= Date.now()
  ) {
    await db.collection(sessionsCollection).deleteOne({ token })
    return null
  }

  const user = await db
    .collection<UserDocument>(usersCollection)
    .findOne({ id: session.userId })
  return user ? publicUser(user) : null
}

export async function deleteSession(token?: string) {
  if (!token) return
  const db = await getDb()
  await db.collection(sessionsCollection).deleteOne({ token })
}

export async function getUsers() {
  const db = await getDb()
  await ensureAuthIndexes(db)
  const users = await db
    .collection<UserDocument>(usersCollection)
    .find({}, { projection: { passwordHash: 0, passwordSalt: 0, _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray()

  return users as AppUser[]
}

export async function deleteUserById(id: string) {
  const db = await getDb()
  await ensureAuthIndexes(db)
  const user = await db
    .collection<UserDocument>(usersCollection)
    .findOne({ id })
  if (!user) return null

  await db.collection<UserDocument>(usersCollection).deleteOne({ id })
  await db.collection(sessionsCollection).deleteMany({ userId: id })
  return publicUser(user)
}

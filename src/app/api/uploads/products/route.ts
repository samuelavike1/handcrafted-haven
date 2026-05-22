import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

export const runtime = "nodejs"

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"])
const maxFileSize = 3 * 1024 * 1024

type UploadedFile = {
  name: string
  type: string
  size: number
  arrayBuffer: () => Promise<ArrayBuffer>
}

function isUploadedFile(value: unknown): value is UploadedFile {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "type" in value &&
    "size" in value
  )
}

function extensionForType(type: string) {
  if (type === "image/png") return "png"
  if (type === "image/webp") return "webp"
  return "jpg"
}

function safeBaseName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48)
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!hasRole(user, ["seller", "admin"])) {
      return NextResponse.json(
        { error: "Seller access is required to upload product images." },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("image")

    if (!isUploadedFile(file)) {
      return NextResponse.json(
        { errors: { image: ["Choose a product image to upload."] } },
        { status: 400 }
      )
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { errors: { image: ["Upload a JPG, PNG, or WebP image."] } },
        { status: 400 }
      )
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { errors: { image: ["Product image must be 3MB or smaller."] } },
        { status: 400 }
      )
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "products")
    await mkdir(uploadsDir, { recursive: true })

    const baseName = safeBaseName(file.name) || "product"
    const filename = `${baseName}-${Date.now()}.${extensionForType(file.type)}`
    await writeFile(path.join(uploadsDir, filename), bytes)

    return NextResponse.json({
      imageUrl: `/uploads/products/${filename}`,
    })
  } catch {
    return NextResponse.json(
      { error: "Product image could not be uploaded." },
      { status: 500 }
    )
  }
}

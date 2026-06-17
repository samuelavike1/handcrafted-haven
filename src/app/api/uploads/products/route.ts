import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

export const runtime = "nodejs"

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"])
const maxFileSize = 3 * 1024 * 1024
const maxFiles = 6

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
    const files: UploadedFile[] = []
    for (const entry of [
      ...formData.getAll("images"),
      ...formData.getAll("image"),
    ]) {
      if (isUploadedFile(entry)) files.push(entry)
    }

    if (!files.length) {
      return NextResponse.json(
        { errors: { image: ["Choose a product image to upload."] } },
        { status: 400 }
      )
    }

    if (files.length > maxFiles) {
      return NextResponse.json(
        { errors: { image: [`Upload up to ${maxFiles} images.`] } },
        { status: 400 }
      )
    }

    const invalidType = files.find((file) => !allowedTypes.has(file.type))
    if (invalidType) {
      return NextResponse.json(
        { errors: { image: ["Upload a JPG, PNG, or WebP image."] } },
        { status: 400 }
      )
    }

    const oversized = files.find((file) => file.size > maxFileSize)
    if (oversized) {
      return NextResponse.json(
        { errors: { image: ["Each product image must be 3MB or smaller."] } },
        { status: 400 }
      )
    }

    const imageUrls = await Promise.all(
      files.map(async (file, index) => {
        const bytes = Buffer.from(await file.arrayBuffer())
        const baseName = safeBaseName(file.name) || "product"
        const filename = `products/${baseName}-${Date.now()}-${index}.${extensionForType(file.type)}`
        const blob = await put(filename, bytes, {
          access: "public",
          addRandomSuffix: true,
          contentType: file.type,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        })

        return blob.url
      })
    )

    return NextResponse.json({
      imageUrl: imageUrls[0],
      imageUrls,
    })
  } catch {
    return NextResponse.json(
      { error: "Product image could not be uploaded." },
      { status: 500 }
    )
  }
}

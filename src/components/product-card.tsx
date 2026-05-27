"use client"

import Link from "next/link"
import { Heart, MapPin, Star } from "lucide-react"
import { useEffect, useState } from "react"
import ShimmerImage from "@/components/ui/shimmer-image"

export interface Product {
  id: string
  name: string
  seller: string
  sellerLocation?: string
  price: number
  rating: number
  reviews?: number
  category: string
  image: string
  galleryImages?: string[]
  badge?: string
  materials?: string[]
  description?: string
}

interface ProductCardProps {
  product: Product
  showAction?: boolean
  compact?: boolean
}

export default function ProductCard({
  product,
  showAction = false,
  compact = false,
}: ProductCardProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const favorites = JSON.parse(
        localStorage.getItem("hh-favorites") ?? "[]"
      ) as string[]
      setSaved(favorites.includes(product.id))
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [product.id])

  const toggleSaved = () => {
    const nextSaved = !saved
    setSaved(nextSaved)
    const favorites = JSON.parse(
      localStorage.getItem("hh-favorites") ?? "[]"
    ) as string[]
    const nextFavorites = nextSaved
      ? Array.from(new Set([...favorites, product.id]))
      : favorites.filter((id) => id !== product.id)

    localStorage.setItem("hh-favorites", JSON.stringify(nextFavorites))
  }

  return (
    <article className="group overflow-hidden rounded-lg border border-hh-border bg-hh-card transition duration-300 hover:-translate-y-0.5 hover:border-[#063f34]/40 hover:shadow-[0_10px_22px_rgba(18,40,33,0.08)]">
      <Link href={`/product/${product.id}`} className="block">
        <div
          className={`relative overflow-hidden bg-hh-subtle ${compact ? "aspect-[4/2.8]" : "aspect-[4/2.45]"}`}
        >
          <ShimmerImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 rounded-md bg-white/92 px-2 py-0.5 text-[10px] font-bold text-[#8b4206] uppercase shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="p-3">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[11px] font-bold text-[#9a4d10] uppercase">
              {product.category}
            </p>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-sm leading-snug font-bold text-hh-heading transition group-hover:text-[#0b5b4a]">
                {product.name}
              </h3>
            </Link>
          </div>
          <button
            onClick={toggleSaved}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition ${
              saved
                ? "border-[#c8651b] bg-[#fff4e8] text-[#c8651b] dark:bg-[#2a1800]"
                : "border-hh-border bg-hh-card text-hh-muted hover:border-[#c8651b] hover:text-[#c8651b]"
            }`}
            aria-label={saved ? "Remove from collection" : "Save to collection"}
          >
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mb-2 space-y-0.5 text-xs text-hh-muted">
          <p>
            by{" "}
            <span className="font-semibold text-hh-body">
              {product.seller}
            </span>
          </p>
          {product.sellerLocation && (
            <p className="flex items-center gap-1.5">
              <MapPin size={12} /> {product.sellerLocation}
            </p>
          )}
        </div>

        {!compact && product.materials && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {product.materials.slice(0, 1).map((material) => (
              <span
                key={material}
                className="rounded-md bg-hh-subtle px-2 py-0.5 text-[11px] font-semibold text-hh-heading"
              >
                {material}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-black tracking-tight text-hh-body">
              ${product.price.toFixed(2)}
            </p>
            <p className="flex items-center gap-1 text-xs text-hh-muted">
              <Star size={13} className="fill-[#c8651b] text-[#c8651b]" />
              <span className="font-semibold text-hh-body">
                {product.rating}
              </span>
              {product.reviews ? <span>({product.reviews})</span> : null}
            </p>
          </div>

          {showAction && (
            <Link
              href={`/product/${product.id}`}
              className="rounded-md bg-[#063f34] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0b5b4a]"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

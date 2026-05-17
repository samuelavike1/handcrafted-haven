"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Star } from "lucide-react"
import { useState } from "react"

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
  badge?: string
  materials?: string[]
  description?: string
}

interface ProductCardProps {
  product: Product
  showAction?: boolean
  compact?: boolean
}

export default function ProductCard({ product, showAction = false, compact = false }: ProductCardProps) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#d8dfdc] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#063f34]/40 hover:shadow-[0_18px_50px_rgba(18,40,33,0.10)]">
      <Link href={`/product/${product.id}`} className="block">
        <div className={`relative overflow-hidden bg-[#edf2ef] ${compact ? "aspect-[4/3]" : "aspect-[4/4.5]"}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#8b4206] shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#9a4d10]">
              {product.category}
            </p>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-[20px] font-bold leading-tight text-[#063f34] transition group-hover:text-[#0b5b4a]">
                {product.name}
              </h3>
            </Link>
          </div>
          <button
            onClick={() => setSaved((value) => !value)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              saved
                ? "border-[#c8651b] bg-[#fff4e8] text-[#c8651b]"
                : "border-[#d8dfdc] bg-white text-[#53615c] hover:border-[#c8651b] hover:text-[#c8651b]"
            }`}
            aria-label={saved ? "Remove from collection" : "Save to collection"}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mb-4 space-y-1 text-sm text-[#53615c]">
          <p>by <span className="font-semibold text-[#25332e]">{product.seller}</span></p>
          {product.sellerLocation && (
            <p className="flex items-center gap-1.5">
              <MapPin size={13} /> {product.sellerLocation}
            </p>
          )}
        </div>

        {!compact && product.materials && (
          <div className="mb-4 flex flex-wrap gap-2">
            {product.materials.slice(0, 2).map((material) => (
              <span key={material} className="rounded-full bg-[#edf2ef] px-3 py-1 text-xs font-semibold text-[#355148]">
                {material}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[24px] font-black tracking-tight text-[#1b211f]">${product.price.toFixed(2)}</p>
            <p className="flex items-center gap-1 text-sm text-[#53615c]">
              <Star size={15} className="fill-[#c8651b] text-[#c8651b]" />
              <span className="font-semibold text-[#1b211f]">{product.rating}</span>
              {product.reviews ? <span>({product.reviews})</span> : null}
            </p>
          </div>

          {showAction && (
            <Link
              href={`/product/${product.id}`}
              className="rounded-full bg-[#063f34] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b5b4a]"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

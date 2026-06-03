"use client"

import { Heart, MapPin, Minus, Plus, ShoppingBag, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import ShimmerImage from "@/components/ui/shimmer-image"
import { Link } from "@/i18n/navigation"
import { addCartItem } from "@/lib/cart"

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
  /** Controls the card layout. Defaults to "grid". */
  variant?: "grid" | "list" | "compact"
  /** @deprecated Use variant="compact" instead */
  compact?: boolean
  showAction?: boolean
}

// ─── Shared primitives ─────────────────────────────────────────────────────

function CategoryLabel({ text }: { text: string }) {
  return (
    <p className="text-[11px] font-bold text-[#9a4d10] uppercase">{text}</p>
  )
}

function RatingRow({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <p className="flex items-center gap-1 text-xs text-hh-muted">
      <Star size={13} className="fill-[#c8651b] text-[#c8651b]" />
      <span className="font-semibold text-hh-body">{rating}</span>
      {reviews ? <span>({reviews})</span> : null}
    </p>
  )
}

function SaveButton({
  saved,
  onToggle,
  label,
}: {
  saved: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition ${
        saved
          ? "border-[#c8651b] bg-[#fff4e8] text-[#c8651b] dark:bg-[#2a1800]"
          : "border-hh-border bg-hh-card text-hh-muted hover:border-[#c8651b] hover:text-[#c8651b]"
      }`}
      aria-label={label}
    >
      <Heart size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  )
}

function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault()
    setQuantity((q) => Math.max(1, q - 1))
  }

  const increment = (e: React.MouseEvent) => {
    e.preventDefault()
    setQuantity((q) => q + 1)
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addCartItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      seller: product.seller,
      category: product.category,
      description: product.description,
      quantity,
    })
    setAdded(true)
    toast.success("Added to cart", {
      description: `${quantity} × ${product.name} ready for checkout.`,
    })
    setTimeout(() => {
      setAdded(false)
      setQuantity(1)
    }, 1800)
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center rounded-md border border-hh-border bg-hh-card overflow-hidden">
        <button
          onClick={decrement}
          disabled={quantity <= 1}
          className="flex h-8 w-7 items-center justify-center text-hh-muted transition hover:bg-hh-subtle disabled:opacity-30"
          aria-label="Decrease quantity"
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-xs font-bold text-hh-heading select-none">
          {quantity}
        </span>
        <button
          onClick={increment}
          className="flex h-8 w-7 items-center justify-center text-hh-muted transition hover:bg-hh-subtle"
          aria-label="Increase quantity"
        >
          <Plus size={12} />
        </button>
      </div>
      <button
        onClick={handleAdd}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition ${
          added
            ? "border-[#063f34] bg-[#063f34] text-white"
            : "border-hh-border bg-hh-card text-hh-muted hover:border-[#063f34] hover:bg-[#063f34] hover:text-white"
        }`}
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingBag size={16} />
      </button>
    </div>
  )
}

// ─── Shared state ──────────────────────────────────────────────────────────

function useFavorite(productId: string) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const favorites = JSON.parse(
        localStorage.getItem("hh-favorites") ?? "[]"
      ) as string[]
      setSaved(favorites.includes(productId))
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [productId])

  const toggle = () => {
    const next = !saved
    setSaved(next)
    const favorites = JSON.parse(
      localStorage.getItem("hh-favorites") ?? "[]"
    ) as string[]
    const updated = next
      ? Array.from(new Set([...favorites, productId]))
      : favorites.filter((id) => id !== productId)
    localStorage.setItem("hh-favorites", JSON.stringify(updated))
  }

  return { saved, toggle }
}

// ─── Layout variants ───────────────────────────────────────────────────────

function GridCard({
  product,
  compact,
  showAction,
}: {
  product: Product
  compact: boolean
  showAction: boolean
}) {
  const t = useTranslations("common")
  const { saved, toggle } = useFavorite(product.id)

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
            <CategoryLabel text={product.category} />
            <Link href={`/product/${product.id}`}>
              <h3 className="mt-1 text-sm leading-snug font-bold text-hh-heading transition group-hover:text-[#0b5b4a]">
                {product.name}
              </h3>
            </Link>
          </div>
          <SaveButton
            saved={saved}
            onToggle={toggle}
            label={saved ? t("removeFromCollection") : t("saveToCollection")}
          />
        </div>

        <div className="mb-2 space-y-0.5 text-xs text-hh-muted">
          <p>
            {t("by")}{" "}
            <span className="font-semibold text-hh-body">{product.seller}</span>
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

        <div className="flex items-end justify-between gap-3">
          <p className="text-lg font-black tracking-tight text-hh-body">
            ${product.price.toFixed(2)}
          </p>
          <RatingRow rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <AddToCartButton product={product} />
          {showAction && (
            <Link
              href={`/product/${product.id}`}
              className="inline-flex h-8 min-w-0 flex-1 items-center justify-center rounded-md bg-[#063f34] px-3 text-xs font-bold text-white transition hover:bg-[#0b5b4a]"
            >
              {t("view")}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

function ListCard({ product }: { product: Product }) {
  const t = useTranslations("common")
  const { saved, toggle } = useFavorite(product.id)

  return (
    <article className="group grid overflow-hidden rounded-lg border border-hh-border bg-hh-card transition duration-200 hover:border-[#063f34]/40 hover:shadow-[0_8px_18px_rgba(18,40,33,0.07)] sm:grid-cols-[180px_1fr]">
      <Link href={`/product/${product.id}`} className="relative block min-h-[150px] overflow-hidden">
        <ShimmerImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 180px"
          unoptimized
        />
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-white/92 px-2 py-0.5 text-[10px] font-bold text-[#8b4206] uppercase shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-col justify-between p-4">
        <div>
          <CategoryLabel text={product.category} />
          <Link href={`/product/${product.id}`}>
            <h3 className="mt-1 text-base leading-snug font-bold text-hh-heading transition group-hover:text-[#0b5b4a]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-1.5 space-y-0.5 text-xs text-hh-muted">
            <p>
              {t("by")}{" "}
              <span className="font-semibold text-hh-body">
                {product.seller}
              </span>
            </p>
            {product.sellerLocation && (
              <p className="flex items-center gap-1">
                <MapPin size={11} /> {product.sellerLocation}
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-hh-muted">
              {product.description}
            </p>
          )}

          {product.materials && product.materials.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.materials.slice(0, 2).map((material) => (
                <span
                  key={material}
                  className="rounded-md bg-hh-subtle px-2 py-0.5 text-[11px] font-semibold text-hh-heading"
                >
                  {material}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-base font-black tracking-tight text-hh-body">
              ${product.price.toFixed(2)}
            </p>
            <RatingRow rating={product.rating} reviews={product.reviews} />
          </div>
          <div className="flex items-center gap-1.5">
            <SaveButton
              saved={saved}
              onToggle={toggle}
              label={saved ? t("removeFromCollection") : t("saveToCollection")}
            />
            <AddToCartButton product={product} />
            <Link
              href={`/product/${product.id}`}
              className="rounded-md bg-[#063f34] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0b5b4a]"
            >
              {t("view")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Public export ─────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  variant,
  compact: compactProp = false,
  showAction = false,
}: ProductCardProps) {
  const resolvedVariant = variant ?? (compactProp ? "compact" : "grid")

  if (resolvedVariant === "list") {
    return <ListCard product={product} />
  }

  return (
    <GridCard
      product={product}
      compact={resolvedVariant === "compact"}
      showAction={showAction}
    />
  )
}

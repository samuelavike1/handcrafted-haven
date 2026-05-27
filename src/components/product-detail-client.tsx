"use client"

import { useEffect, useState } from "react"
import { Heart, Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { addCartItem } from "@/lib/cart"
import ShimmerImage from "@/components/ui/shimmer-image"

type ProductDetailClientProps = {
  product: {
    id: string
    name: string
    image: string
    price: number
    stock: number
    seller?: string
    category?: string
    description?: string
  }
  galleryImages: string[]
  variant: "gallery" | "actions"
}

export default function ProductDetailClient({
  product,
  galleryImages,
  variant,
}: ProductDetailClientProps) {
  const images = galleryImages.length ? galleryImages : [product.image]
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
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

  const addToCart = () => {
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

    toast.success("Added to cart", {
      description: `${quantity} x ${product.name} is ready for checkout.`,
    })
  }

  const toggleFavorite = () => {
    const nextSaved = !saved
    setSaved(nextSaved)

    const favorites = JSON.parse(
      localStorage.getItem("hh-favorites") ?? "[]"
    ) as string[]
    const nextFavorites = nextSaved
      ? Array.from(new Set([...favorites, product.id]))
      : favorites.filter((id) => id !== product.id)

    localStorage.setItem("hh-favorites", JSON.stringify(nextFavorites))
    toast(nextSaved ? "Saved to favorites" : "Removed from favorites", {
      description: product.name,
    })
  }

  if (variant === "gallery") {
    return (
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d8dfdc] bg-[#edf2ef]">
          <ShimmerImage
            src={images[activeImage]}
            alt={product.name}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 bg-[#edf2ef] transition ${
                activeImage === index
                  ? "border-[#063f34] ring-4 ring-[#063f34]/10"
                  : "border-transparent hover:border-[#cfd9d4]"
              }`}
              aria-label={`View product image ${index + 1}`}
            >
              <ShimmerImage
                src={image}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-lg border border-[#d8dfdc] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-9 w-36 items-center justify-between rounded-lg border border-[#d8dfdc] px-3">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            className="text-[#53615c] hover:text-[#063f34]"
          >
            <Minus size={17} />
          </button>
          <span className="font-black text-[#063f34]">{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((value) => Math.min(product.stock, value + 1))
            }
            aria-label="Increase quantity"
            className="text-[#53615c] hover:text-[#063f34]"
          >
            <Plus size={17} />
          </button>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={product.stock <= 0}
          className="h-9 flex-1 rounded-md bg-[#f28a35] px-4 text-sm font-black text-white transition hover:bg-[#dc7624] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add to cart
        </button>
      </div>
      <button
        type="button"
        onClick={toggleFavorite}
        className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#063f34] text-sm font-black text-[#063f34] transition hover:bg-[#edf2ef]"
      >
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
        {saved ? "Saved" : "Save to collection"}
      </button>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import ProductCard, { type Product } from "@/components/product-card"

export default function SavedItemsClient({
  products,
}: {
  products: Product[]
}) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFavoriteIds(
        JSON.parse(localStorage.getItem("hh-favorites") ?? "[]") as string[]
      )
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  const savedProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds, products]
  )

  return (
    <section className="mt-4 rounded-lg border border-[#d8dfdc] bg-white p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black text-[#9a4d10] uppercase">
            Saved pieces
          </p>
          <h2 className="text-lg font-black text-[#063f34]">Your collection</h2>
        </div>
        <Link
          href="/browse"
          className="text-sm font-black text-[#063f34] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
        >
          Browse more
        </Link>
      </div>

      {savedProducts.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} showAction />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#cfd9d4] bg-[#fbfbf8] p-6 text-sm font-semibold text-[#53615c]">
          Save products with the heart button and they will appear here.
        </div>
      )}
    </section>
  )
}

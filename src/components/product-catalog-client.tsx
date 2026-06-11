"use client"

import { useMemo, useState } from "react"
import { Filter, Search, SlidersHorizontal, X } from "lucide-react"
import ProductCard from "@/components/product-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/components/product-card"

const priceRanges = [
  "All prices",
  "Under $50",
  "$50 - $100",
  "$100 - $200",
  "$200+",
]
const values = ["Sustainable", "Made locally", "Giftable", "Customizable"]
const sortOptions = [
  "Newest first",
  "Price: low to high",
  "Price: high to low",
  "Top rated",
  "Most reviewed",
]

function matchesPrice(price: number, range: string) {
  if (range === "Under $50") return price < 50
  if (range === "$50 - $100") return price >= 50 && price <= 100
  if (range === "$100 - $200") return price > 100 && price <= 200
  if (range === "$200+") return price > 200
  return true
}

function matchesValue(product: Product, value: string) {
  if (!value) return true

  const materials = product.materials?.join(" ").toLowerCase() ?? ""
  const badge = product.badge?.toLowerCase() ?? ""
  const description = product.description?.toLowerCase() ?? ""
  const location = product.sellerLocation?.toLowerCase() ?? ""

  if (value === "Sustainable") {
    return /organic|reclaimed|recycled|natural|plant|low-impact/.test(
      `${materials} ${description}`
    )
  }
  if (value === "Made locally") {
    return /oregon|arizona|idaho|united states/.test(location)
  }
  if (value === "Giftable") {
    return badge.includes("giftable") || description.includes("gift")
  }
  if (value === "Customizable") {
    return description.includes("custom") || description.includes("made to")
  }

  return true
}

function matchesSearch(product: Product, query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return [
    product.name,
    product.seller,
    product.sellerLocation,
    product.category,
    product.badge,
    product.description,
    product.materials?.join(" "),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalized))
}

export default function ProductCatalogClient({
  products,
  initialCategory = "All crafts",
  initialQuery = "",
  dataNotice = "",
}: {
  products: Product[]
  initialCategory?: string
  initialQuery?: string
  dataNotice?: string
}) {
  const [category, setCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState("All prices")
  const [selectedValue, setSelectedValue] = useState("")
  const [sort, setSort] = useState("Newest first")
  const [query, setQuery] = useState(initialQuery)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categories = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((next, product) => {
      next[product.category] = (next[product.category] ?? 0) + 1
      return next
    }, {})

    return [
      { name: "All crafts", slug: "all", count: products.length },
      ...Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count]) => ({ name, slug: name.toLowerCase(), count })),
    ]
  }, [products])

  const filteredProducts = useMemo(() => {
    const nextProducts = products
      .filter(
        (product) => category === "All crafts" || product.category === category
      )
      .filter((product) => matchesSearch(product, query))
      .filter((product) => matchesPrice(product.price, priceRange))
      .filter((product) => matchesValue(product, selectedValue))

    if (sort === "Newest first") {
      nextProducts.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      )
    } else if (sort === "Price: low to high") {
      nextProducts.sort((a, b) => a.price - b.price)
    } else if (sort === "Price: high to low") {
      nextProducts.sort((a, b) => b.price - a.price)
    } else if (sort === "Top rated") {
      nextProducts.sort((a, b) => b.rating - a.rating)
    } else if (sort === "Most reviewed") {
      nextProducts.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    }

    return nextProducts
  }, [category, priceRange, products, query, selectedValue, sort])

  const activeFilterCount = [
    category !== "All crafts",
    priceRange !== "All prices",
    Boolean(selectedValue),
    Boolean(query.trim()),
  ].filter(Boolean).length
  const activeLabels = [
    category !== "All crafts" ? category : "",
    priceRange !== "All prices" ? priceRange : "",
    selectedValue,
    query.trim() ? `Search: ${query.trim()}` : "",
  ].filter((label): label is string => Boolean(label))

  const resetFilters = () => {
    setCategory("All crafts")
    setPriceRange("All prices")
    setSelectedValue("")
    setQuery("")
  }

  const filterControls = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-black text-[#9a4d10] uppercase">
          Craft
        </p>
        <div className="space-y-2">
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setCategory(item.name)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#edf2ef] focus:ring-4 focus:ring-[#063f34]/10 focus:outline-none"
            >
              <span className="flex items-center gap-3 text-sm font-semibold text-[#25332e]">
                <span
                  aria-hidden="true"
                  className={`h-4 w-4 rounded border ${
                    category === item.name
                      ? "border-[#063f34] bg-[#063f34]"
                      : "border-[#cfd9d4]"
                  }`}
                />
                {item.name}
              </span>
              <span className="text-xs text-[#6d7a75]">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <label>
        <span className="mb-3 block text-xs font-black text-[#9a4d10] uppercase">
          Price
        </span>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="h-9 w-full border-[#d8dfdc] bg-white text-sm font-semibold text-[#53615c]">
            <SelectValue placeholder="Select price" />
          </SelectTrigger>
          <SelectContent className="border border-[#cfd9d4] bg-white text-[#25332e] shadow-[0_16px_40px_rgba(18,40,33,0.18)]">
            {priceRanges.map((range) => (
              <SelectItem
                key={range}
                value={range}
                className="focus:bg-[#edf2ef] focus:text-[#063f34]"
              >
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <div>
        <p className="mb-3 text-xs font-black text-[#9a4d10] uppercase">
          Values
        </p>
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setSelectedValue((current) => (current === value ? "" : value))
              }
              className={`rounded-md px-2.5 py-1.5 text-xs font-bold focus:ring-4 focus:ring-[#063f34]/10 focus:outline-none ${
                selectedValue === value
                  ? "bg-[#063f34] text-white"
                  : "bg-[#edf2ef] text-[#355148]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6 rounded-lg border border-[#d8dfdc] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-[#063f34]">Refine</h2>
            <SlidersHorizontal size={18} className="text-[#53615c]" />
          </div>
          {filterControls}
        </div>
      </aside>

      <section>
        {dataNotice && (
          <div className="mb-4 rounded-lg border border-[#f1c9a5] bg-[#fff8f1] p-4 text-sm font-semibold text-[#7a5a40]">
            {dataNotice}
          </div>
        )}
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-[#d8dfdc] bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="shrink-0">
            <p className="text-sm font-semibold text-[#53615c]">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,320px)_auto_170px] lg:w-auto">
            <label className="relative">
              <span className="sr-only">Search products</span>
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#6d7a75]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9 w-full rounded-lg border border-[#d8dfdc] bg-white pr-3 pl-9 text-sm font-semibold text-[#25332e] outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/10"
                placeholder="Search mugs, linen, walnut..."
              />
            </label>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#d8dfdc] bg-white px-3 text-sm font-black text-[#063f34] focus:ring-4 focus:ring-[#063f34]/10 focus:outline-none lg:hidden"
            >
              <Filter size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[#063f34] px-1.5 py-0.5 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <label className="relative">
              <span className="sr-only">Sort products</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9 w-full border-[#d8dfdc] bg-white text-sm font-bold text-[#063f34]">
                  <SelectValue placeholder="Sort products" />
                </SelectTrigger>
                <SelectContent className="border border-[#cfd9d4] bg-white text-[#25332e] shadow-[0_16px_40px_rgba(18,40,33,0.18)]">
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="focus:bg-[#edf2ef] focus:text-[#063f34]"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 lg:col-span-3">
              {activeLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-md bg-[#edf2ef] px-2.5 py-1.5 text-xs font-bold text-[#355148]"
                >
                  {label}
                </span>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-black text-[#9a2f18] focus:ring-4 focus:ring-[#9a2f18]/10 focus:outline-none"
              >
                <X size={13} /> Clear
              </button>
            </div>
          )}
        </div>

        {filteredProducts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showAction />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#d8dfdc] bg-white p-6">
            <h2 className="text-lg font-black text-[#063f34]">
              No matching products
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#53615c]">
              Try clearing one filter or searching for a broader material,
              craft, or seller name.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto border-[#cfd9d4] bg-white text-[#191c1c] sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Refine products</DialogTitle>
          </DialogHeader>
          {filterControls}
          <div className="flex gap-3 border-t border-[#d8dfdc] pt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="flex-1 rounded-lg border border-[#d8dfdc] px-4 py-2 text-sm font-black text-[#53615c] focus:ring-4 focus:ring-[#063f34]/10 focus:outline-none"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="flex-1 rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none"
            >
              Show {filteredProducts.length}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

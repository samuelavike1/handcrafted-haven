import { Metadata } from "next"
import { ChevronDown, SlidersHorizontal, Sparkles, Star } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCatalogClient from "@/components/product-catalog-client"
import { getProducts } from "@/lib/server-products"
import { categories, products as fallbackProducts } from "@/lib/market-data"

export const metadata: Metadata = {
  title: "Browse Handmade Goods",
  description:
    "Explore handcrafted ceramics, textiles, woodwork, jewelry, and sustainable artisan goods from independent makers worldwide.",
  openGraph: {
    title: "Browse Handmade Goods",
    description:
      "Explore handcrafted ceramics, textiles, woodwork, jewelry, and sustainable artisan goods.",
    images: [{ url: "/category_pottery_1779021047174.png", alt: "Handcrafted ceramics collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Handmade Goods",
    description:
      "Explore handcrafted ceramics, textiles, woodwork, jewelry, and sustainable artisan goods.",
    images: ["/category_pottery_1779021047174.png"],
  },
}

const priceRanges = ["Under $50", "$50 - $100", "$100 - $200", "$200+"]
const values = ["Sustainable", "Made locally", "Giftable", "Customizable"]

const categoryBySlug: Record<string, string> = {
  ceramics: "Ceramics",
  textiles: "Textiles",
  woodwork: "Woodwork",
  jewelry: "Jewelry",
}

interface BrowsePageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams
  const productResult = await getProducts()
    .then((items) => ({ products: items, dataNotice: "" }))
    .catch(() => ({
      products: fallbackProducts,
      dataNotice:
        "Showing starter products because the MongoDB product database is unavailable.",
    }))
  const initialCategory = params.category
    ? (categoryBySlug[params.category] ?? "All crafts")
    : "All crafts"

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <section aria-label="Browse header" className="mb-5 overflow-hidden rounded-lg bg-[#063f34] p-4 text-white lg:p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-bold">
                <Sparkles size={16} /> 3,200+ curated artisan pieces
              </div>
              <h1 className="max-w-3xl text-2xl font-black tracking-tight text-white sm:text-2xl">
                Discover handmade goods with a story.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/78">
                Filter by craft, material, values, and budget to find objects
                made with intention by verified sellers.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold text-white/70">
                Marketplace quality score
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-2xl font-black">4.9</span>
                <span className="mb-2 flex text-[#f28a35]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="currentColor" />
                  ))}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/72">
                Based on verified product reviews and seller performance.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <aside aria-label="Filter products" className="hidden lg:block">
            <div className="sticky top-24 space-y-6 rounded-lg border border-hh-border bg-hh-card p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-hh-heading">Refine</h2>
                <SlidersHorizontal size={18} className="text-hh-muted" />
              </div>

              <div>
                <p className="mb-3 text-xs font-black text-[#9a4d10] uppercase">
                  Craft
                </p>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <label
                      key={category.slug}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-hh-subtle"
                    >
                      <span className="flex items-center gap-3 text-sm font-semibold text-hh-body">
                        <span
                          className={`h-4 w-4 rounded border ${index === 0 ? "border-[#063f34] bg-[#063f34]" : "border-hh-border"}`}
                        />
                        {category.name}
                      </span>
                      <span className="text-xs text-hh-muted">
                        {category.count.split(" ")[0]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-black text-[#9a4d10] uppercase">
                  Price
                </p>
                <div className="grid gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      className="rounded-lg border border-hh-border px-3 py-2 text-left text-sm font-semibold text-hh-muted hover:border-[#063f34] hover:text-hh-heading"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-black text-[#9a4d10] uppercase">
                  Values
                </p>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <span
                      key={value}
                      className="rounded-md bg-hh-subtle px-2.5 py-1.5 text-xs font-bold text-hh-heading"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section aria-label="Product catalog">
            <div className="mb-5 flex flex-col gap-4 rounded-lg border border-hh-border bg-hh-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-hh-muted">
                  Showing {productResult.products.length} curated products
                </p>
                <h2 className="text-lg font-black text-hh-heading">
                  Artisanal collections
                </h2>
              </div>
              <div className="flex gap-3">
                <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-hh-border px-4 text-sm font-bold text-hh-heading lg:hidden">
                  <SlidersHorizontal size={16} /> Filters
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-hh-border px-4 text-sm font-bold text-hh-heading">
                  Newest first <ChevronDown size={16} />
                </button>
              </div>
            </div>

          </section>
        </div>
        <ProductCatalogClient
          products={productResult.products}
          initialCategory={initialCategory}
          initialQuery={params.q ?? ""}
          dataNotice={productResult.dataNotice}
        />
      </main>

      <Footer variant="catalog" />
    </div>
  )
}

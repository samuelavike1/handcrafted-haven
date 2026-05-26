import { Metadata } from "next"
import { Sparkles, Star } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCatalogClient from "@/components/product-catalog-client"
import { getProducts } from "@/lib/server-products"
import { products as fallbackProducts } from "@/lib/market-data"

export const metadata: Metadata = {
  title: "Browse Handmade Goods | Handcrafted Haven",
  description:
    "Explore handcrafted ceramics, textiles, woodwork, jewelry, and sustainable artisan goods.",
}

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
        <section className="mb-5 overflow-hidden rounded-lg bg-[#063f34] p-4 text-white lg:p-4">
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

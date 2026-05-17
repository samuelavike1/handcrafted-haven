import { Metadata } from "next"
import { ChevronDown, SlidersHorizontal, Sparkles, Star } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { categories, products } from "@/lib/market-data"

export const metadata: Metadata = {
  title: "Browse Handmade Goods | Handcrafted Haven",
  description:
    "Explore handcrafted ceramics, textiles, woodwork, jewelry, and sustainable artisan goods.",
}

const priceRanges = ["Under $50", "$50 - $100", "$100 - $200", "$200+"]
const values = ["Sustainable", "Made locally", "Giftable", "Customizable"]

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-lg bg-[#063f34] p-6 text-white lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-bold">
                <Sparkles size={16} /> 3,200+ curated artisan pieces
              </div>
              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                Discover handmade goods with a story.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">
                Filter by craft, material, values, and budget to find objects
                made with intention by verified sellers.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-bold text-white/70">
                Marketplace quality score
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-4xl font-black">4.9</span>
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

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6 rounded-lg border border-[#d8dfdc] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-[#063f34]">Refine</h2>
                <SlidersHorizontal size={18} className="text-[#53615c]" />
              </div>

              <div>
                <p className="mb-3 text-xs font-black text-[#9a4d10] uppercase">
                  Craft
                </p>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <label
                      key={category.slug}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-[#edf2ef]"
                    >
                      <span className="flex items-center gap-3 text-sm font-semibold text-[#25332e]">
                        <span
                          className={`h-4 w-4 rounded border ${index === 0 ? "border-[#063f34] bg-[#063f34]" : "border-[#cfd9d4]"}`}
                        />
                        {category.name}
                      </span>
                      <span className="text-xs text-[#6d7a75]">
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
                      className="rounded-lg border border-[#d8dfdc] px-3 py-2 text-left text-sm font-semibold text-[#53615c] hover:border-[#063f34] hover:text-[#063f34]"
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
                      className="rounded-md bg-[#edf2ef] px-2.5 py-1.5 text-xs font-bold text-[#355148]"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-4 rounded-lg border border-[#d8dfdc] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#53615c]">
                  Showing {products.length} curated products
                </p>
                <h2 className="text-xl font-black text-[#063f34]">
                  Artisanal collections
                </h2>
              </div>
              <div className="flex gap-3">
                <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8dfdc] px-4 text-sm font-bold text-[#063f34] lg:hidden">
                  <SlidersHorizontal size={16} /> Filters
                </button>
                <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8dfdc] px-4 text-sm font-bold text-[#063f34]">
                  Newest first <ChevronDown size={16} />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showAction />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer variant="catalog" />
    </div>
  )
}

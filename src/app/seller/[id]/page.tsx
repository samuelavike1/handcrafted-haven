import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BadgeCheck, MapPin, Package, Star } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import ProductCard from "@/components/product-card"
import { getUserById } from "@/lib/auth"
import { getProducts } from "@/lib/server-products"

interface SellerProfilePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: SellerProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const seller = await getUserById(id)

  return {
    title: seller
      ? `${seller.studioName ?? seller.name} | Handcrafted Haven`
      : "Seller Profile | Handcrafted Haven",
    description:
      seller?.story ??
      "Meet an artisan seller and browse their handcrafted pieces.",
  }
}

export default async function SellerProfilePage({
  params,
}: SellerProfilePageProps) {
  const { id } = await params
  const seller = await getUserById(id)

  if (!seller || seller.role !== "seller") notFound()

  const products = await getProducts({ sellerId: seller.id })
  const activeProducts = products.filter(
    (product) => product.status !== "Draft"
  )
  const reviewCount = activeProducts.reduce(
    (sum, product) => sum + (product.reviews ?? 0),
    0
  )
  const averageRating = activeProducts.length
    ? (
        activeProducts.reduce((sum, product) => sum + product.rating, 0) /
        activeProducts.length
      ).toFixed(1)
    : "New"

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <Link
          href="/browse"
          className="mb-4 inline-flex items-center gap-2 text-sm font-black text-[#063f34] hover:underline"
        >
          <ArrowLeft size={16} /> Back to browse
        </Link>

        <section className="overflow-hidden rounded-lg border border-[#d8dfdc] bg-white">
          <div className="bg-[#063f34] px-5 py-6 text-white sm:px-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-1.5 text-xs font-bold">
                  <BadgeCheck size={16} /> Verified artisan profile
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  {seller.studioName ?? seller.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/78">
                  <MapPin size={16} /> {seller.location ?? "Independent studio"}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-white/10 px-3 py-2">
                  <p className="text-lg font-black">{activeProducts.length}</p>
                  <p className="text-[11px] font-bold text-white/72">Pieces</p>
                </div>
                <div className="rounded-md bg-white/10 px-3 py-2">
                  <p className="text-lg font-black">{averageRating}</p>
                  <p className="text-[11px] font-bold text-white/72">Rating</p>
                </div>
                <div className="rounded-md bg-white/10 px-3 py-2">
                  <p className="text-lg font-black">{reviewCount}</p>
                  <p className="text-[11px] font-bold text-white/72">Reviews</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px] lg:p-7">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Studio story
              </p>
              <p className="mt-2 max-w-3xl leading-7 text-[#53615c]">
                {seller.story ??
                  "This seller is building their studio story. Browse their available handcrafted pieces below."}
              </p>
            </div>
            <aside className="rounded-lg border border-[#d8dfdc] bg-[#fbfbf8] p-4">
              <p className="flex items-center gap-2 text-sm font-black text-[#063f34]">
                <Package size={17} /> Seller standards
              </p>
              <ul className="mt-3 space-y-2 text-sm font-semibold text-[#53615c]">
                <li>Handmade product listings</li>
                <li>Transparent materials and story</li>
                <li>Marketplace review history</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Seller collection
              </p>
              <h2 className="text-2xl font-black text-[#063f34]">
                Pieces from {seller.studioName ?? seller.name}
              </h2>
            </div>
            <p className="flex items-center gap-1 text-sm font-bold text-[#53615c]">
              <Star size={15} className="fill-[#c8651b] text-[#c8651b]" />
              {averageRating} average rating
            </p>
          </div>

          {activeProducts.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {activeProducts.map((product) => (
                <ProductCard key={product.id} product={product} showAction />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#d8dfdc] bg-white p-6 text-sm font-semibold text-[#53615c]">
              This seller has not published active products yet.
            </div>
          )}
        </section>
      </main>

      <Footer variant="catalog" />
    </div>
  )
}

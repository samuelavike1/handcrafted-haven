import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BadgeCheck,
  Leaf,
  MessageSquare,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import ProductDetailClient from "@/components/product-detail-client"
import { getProductById, getRelatedProducts } from "@/lib/server-products"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  const related = await getRelatedProducts(product)
  const reviewItems = product.reviewItems ?? []
  const materials = product.materials ?? []
  const galleryImages = [
    product.image,
    ...related.slice(0, 3).map((item) => item.image),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <nav className="mb-4 text-sm font-semibold text-[#53615c]">
          <Link href="/browse" className="hover:text-[#063f34]">
            Browse
          </Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-[#063f34]">{product.name}</span>
        </nav>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1fr]">
          <ProductDetailClient
            product={{
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              stock: product.stock,
            }}
            galleryImages={galleryImages}
          />

          <div className="lg:pl-4">
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#edf2ef] px-3 py-1.5 text-xs font-bold text-[#063f34]">
              <BadgeCheck size={16} /> Verified artisan
            </div>
            <h1 className="max-w-2xl text-2xl font-black tracking-tight text-[#063f34] sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-[#53615c]">
              by{" "}
              <Link href="/sell" className="font-bold text-[#9a4d10]">
                {product.seller}
              </Link>{" "}
              · {product.sellerLocation}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-black text-[#1b211f]">
                ${product.price.toFixed(2)}
              </p>
              <p className="flex items-center gap-1 rounded-lg border border-[#d8dfdc] bg-white px-3 py-1.5 text-xs font-bold">
                <Star size={16} className="fill-[#c8651b] text-[#c8651b]" />{" "}
                {product.rating} · {product.reviews} reviews
              </p>
              {product.badge && (
                <span className="rounded-lg bg-[#fff4e8] px-3 py-1.5 text-xs font-black text-[#9a4d10]">
                  {product.badge}
                </span>
              )}
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#53615c]">
              {product.description}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {materials.slice(0, 4).map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-[#d8dfdc] bg-white px-3 py-2 text-xs font-bold text-[#25332e]"
                >
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm font-black text-[#53615c]">
              {product.stock} in stock
            </p>

            <div className="mt-4 grid gap-2 text-xs font-semibold text-[#53615c] sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <Truck size={17} className="text-[#063f34]" /> Plastic-free
                shipping
              </span>
              <span className="flex items-center gap-2">
                <Leaf size={17} className="text-[#063f34]" /> Sustainable
                materials
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#063f34]" /> Secure
                checkout
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 border-t border-[#d8dfdc] pt-6 lg:grid-cols-[240px_1fr]">
          <div>
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Reviews and ratings
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#063f34]">
              Loved by collectors.
            </h2>
            <div className="mt-5 rounded-lg bg-white p-4">
              <p className="text-2xl font-black">{product.rating}</p>
              <p className="mt-2 flex text-[#c8651b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="currentColor" />
                ))}
              </p>
              <p className="mt-2 text-sm text-[#53615c]">
                Based on {product.reviews} written reviews
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {reviewItems.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border border-[#d8dfdc] bg-white p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black text-[#063f34]">{review.author}</p>
                    <p className="mt-1 flex text-[#c8651b]">
                      {Array.from({ length: Math.round(review.rating) }).map(
                        (_, index) => (
                          <Star key={index} size={15} fill="currentColor" />
                        )
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-[#6d7a75]">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <h3 className="mt-4 text-lg font-black text-[#1b211f]">
                  {review.title}
                </h3>
                <p className="mt-2 leading-relaxed text-[#53615c]">
                  {review.comment}
                </p>
                <button className="mt-4 flex items-center gap-2 text-sm font-bold text-[#53615c]">
                  <MessageSquare size={16} /> Comment
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                More to discover
              </p>
              <h2 className="text-2xl font-black text-[#063f34]">
                Related handcrafted pieces
              </h2>
            </div>
            <Link href="/browse" className="font-black text-[#063f34]">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} showAction />
            ))}
          </div>
        </section>
      </main>

      <Footer variant="product" />
    </div>
  )
}

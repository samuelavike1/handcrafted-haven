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
    ...(product.galleryImages ?? []),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-hh-canvas">
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <nav className="mb-4 text-sm font-semibold text-hh-muted">
          <Link href="/browse" className="hover:text-hh-heading">
            Browse
          </Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-hh-heading">{product.name}</span>
        </nav>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hh-border bg-hh-subtle">
              <Image
                src={gallery[activeImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${
                    activeImage === index
                      ? "border-[#063f34]"
                      : "border-transparent"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <Image
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
          <ProductDetailClient
            product={{
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              stock: product.stock,
              seller: product.seller,
              category: product.category,
              description: product.description,
            }}
            galleryImages={galleryImages}
            variant="gallery"
          />

          <div className="lg:pl-4">
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#edf2ef] px-3 py-1.5 text-xs font-bold text-[#063f34]">
              <BadgeCheck size={16} /> Verified artisan
            </div>
            <h1 className="max-w-2xl text-2xl font-black tracking-tight text-[#063f34] sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-hh-muted">
              by{" "}
              <Link href="/sell" className="font-bold text-[#9a4d10]">
                {product.seller}
              </Link>{" "}
              · {product.sellerLocation}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-black text-hh-body">$185.00</p>
              <p className="flex items-center gap-1 rounded-lg border border-hh-border bg-hh-card px-3 py-1.5 text-xs font-bold">
                <Star size={16} className="fill-[#c8651b] text-[#c8651b]" /> 4.8
                · 124 reviews
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

            <p className="mt-4 max-w-2xl text-sm leading-6 text-hh-muted">
              Sculpted from iron-rich stoneware clay, this vase has a tactile
              ribbed surface, subtle mineral speckling, and a warm
              reduction-fired finish. Each piece is made in small batches and
              signed by the maker.
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#53615c]">
              {product.description}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {materials.slice(0, 4).map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-hh-border bg-hh-card px-3 py-2 text-xs font-bold text-hh-body"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-hh-border bg-hh-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-9 w-36 items-center justify-between rounded-lg border border-hh-border px-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-black">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button className="h-9 flex-1 rounded-md bg-[#f28a35] px-4 text-sm font-black text-white transition hover:bg-[#dc7624]">
                  Add to cart
                </button>
              </div>
              <button
                onClick={() => setSaved((value) => !value)}
                className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#063f34] text-sm font-black text-[#063f34] transition hover:bg-[#edf2ef]"
              >
                <Heart size={18} fill={saved ? "currentColor" : "none"} />{" "}
                {saved ? "Saved" : "Save to collection"}
              </button>
            </div>
            <ProductDetailClient
              product={{
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                stock: product.stock,
                seller: product.seller,
                category: product.category,
                description: product.description,
              }}
              galleryImages={galleryImages}
              variant="actions"
            />

            <div className="mt-4 grid gap-2 text-xs font-semibold text-hh-muted sm:grid-cols-3">
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

        <section className="mt-8 grid gap-4 border-t border-hh-border pt-6 lg:grid-cols-[240px_1fr]">
          <div>
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Reviews and ratings
            </p>
            <h2 className="mt-2 text-2xl font-black text-hh-heading">
              Loved by collectors.
            </h2>
            <div className="mt-5 rounded-lg bg-hh-card p-4">
              <p className="text-2xl font-black">4.8</p>
            <div className="mt-5 rounded-lg bg-white p-4">
              <p className="text-2xl font-black">{product.rating}</p>
              <p className="mt-2 flex text-[#c8651b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="currentColor" />
                ))}
              </p>
              <p className="mt-2 text-sm text-hh-muted">
                Based on 124 written reviews
              <p className="mt-2 text-sm text-[#53615c]">
                Based on {product.reviews} written reviews
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {reviewItems.map((review) => (
              <article
                key={review.name}
                className="rounded-lg border border-hh-border bg-hh-card p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black text-hh-heading">{review.name}</p>
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
                  <p className="text-sm text-hh-muted">{review.date}</p>
                  <p className="text-sm text-[#6d7a75]">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <h3 className="mt-4 text-lg font-black text-hh-body">
                  {review.title}
                </h3>
                <p className="mt-2 leading-relaxed text-hh-muted">
                  {review.text}
                <p className="mt-2 leading-relaxed text-[#53615c]">
                  {review.comment}
                </p>
                <button className="mt-4 flex items-center gap-2 text-sm font-bold text-hh-muted">
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
              <h2 className="text-2xl font-black text-hh-heading">
                Related handcrafted pieces
              </h2>
            </div>
            <Link href="/browse" className="font-black text-hh-heading">
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

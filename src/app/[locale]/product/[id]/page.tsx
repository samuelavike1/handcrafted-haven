import type { Metadata } from "next"
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
import {
  getProductById,
  getRelatedProducts,
  type ProductDocument,
} from "@/lib/server-products"
import { products as fallbackProducts } from "@/lib/market-data"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// Build a ProductDocument-shaped object from the static catalog so the page
// still renders when MongoDB is unavailable (mirrors the /browse fallback).
function toFallbackProduct(id: string): ProductDocument | null {
  const base = fallbackProducts.find((product) => product.id === id)
  if (!base) return null
  const now = new Date().toISOString()
  return {
    ...base,
    stock: 8,
    status: "Active",
    galleryImages: [],
    reviewItems: [],
    reviews: base.reviews ?? 0,
    createdAt: now,
    updatedAt: now,
  } as ProductDocument
}

// Resilient loaders: try the database, fall back to static data on failure.
async function loadProduct(id: string): Promise<ProductDocument | null> {
  try {
    return await getProductById(id)
  } catch {
    return toFallbackProduct(id)
  }
}

async function loadRelatedProducts(
  product: ProductDocument
): Promise<ProductDocument[]> {
  try {
    return await getRelatedProducts(product)
  } catch {
    return fallbackProducts
      .filter(
        (item) => item.category === product.category && item.id !== product.id
      )
      .slice(0, 3)
      .map((item) => toFallbackProduct(item.id))
      .filter((item): item is ProductDocument => item !== null)
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) return {}

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      type: "website",
      title: `${product.name} by ${product.seller}`,
      description: product.description,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} by ${product.seller}`,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  }
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
  const product = await loadProduct(id)
  if (!product) notFound()

  const related = await loadRelatedProducts(product)
  const reviewItems = product.reviewItems ?? []
  const materials = product.materials ?? []
  const galleryImages = [
    product.image,
    ...(product.galleryImages ?? []),
  ].filter(Boolean)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: galleryImages,
    brand: { "@type": "Brand", name: product.seller },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(product.reviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-hh-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm font-semibold text-hh-muted">
          <Link href="/browse" className="hover:text-hh-heading">
            Browse
          </Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-hh-heading">{product.name}</span>
        </nav>

        <section aria-label="Product details" className="grid gap-5 lg:grid-cols-[0.9fr_1fr]">
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
              <p className="text-2xl font-black text-hh-body">
                ${product.price.toFixed(2)}
              </p>
              <p className="flex items-center gap-1 rounded-lg border border-hh-border bg-hh-card px-3 py-1.5 text-xs font-bold">
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

        <section aria-label="Customer reviews" className="mt-8 grid gap-4 border-t border-hh-border pt-6 lg:grid-cols-[240px_1fr]">
          <div>
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Reviews and ratings
            </p>
            <h2 className="mt-2 text-2xl font-black text-hh-heading">
              Loved by collectors.
            </h2>
            <div className="mt-5 rounded-lg bg-hh-card p-4">
              <p className="text-2xl font-black">{product.rating}</p>
              <p className="mt-2 flex text-[#c8651b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="currentColor" />
                ))}
              </p>
              <p className="mt-2 text-sm text-hh-muted">
                Based on {product.reviews} written reviews
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {reviewItems.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border border-hh-border bg-hh-card p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black text-hh-heading">{review.author}</p>
                    <p className="mt-1 flex text-[#c8651b]">
                      {Array.from({ length: Math.round(review.rating) }).map(
                        (_, index) => (
                          <Star key={index} size={15} fill="currentColor" />
                        )
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-hh-muted">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <p className="mt-2 leading-relaxed text-hh-muted">
                  {review.comment}
                </p>
                <button className="mt-4 flex items-center gap-2 text-sm font-bold text-hh-muted">
                  <MessageSquare size={16} /> Comment
                </button>
              </article>
            ))}
          </div>
        </section>

        <section aria-label="Related products" className="mt-8">
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

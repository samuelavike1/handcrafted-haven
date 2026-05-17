"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { BadgeCheck, Heart, Leaf, MessageSquare, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/market-data"
import { images } from "@/lib/images"

const gallery = [images.productVase, images.categoryPottery, images.categoryWoodworking, images.categoryTextiles]

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    date: "Oct 24, 2024",
    title: "A piece that feels alive",
    text: "The texture is even richer in person. Packaging was plastic-free and the seller included a handwritten care card.",
  },
  {
    name: "James D.",
    rating: 4,
    date: "Sep 15, 2024",
    title: "Beautiful craft and fast shipping",
    text: "Heavy, balanced, and clearly handmade. The tones are slightly warmer than the photos, which I actually prefer.",
  },
]

export default function ProductDetailPage() {
  const product = products[0]
  const related = useMemo(() => products.filter((item) => item.id !== product.id).slice(0, 3), [product.id])
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [saved, setSaved] = useState(false)

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <nav className="mb-8 text-sm font-semibold text-[#53615c]">
          <Link href="/browse" className="hover:text-[#063f34]">Browse</Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-[#063f34]">{product.name}</span>
        </nav>

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[32px] border border-[#d8dfdc] bg-[#edf2ef]">
              <Image src={gallery[activeImage]} alt={product.name} fill priority className="object-cover" unoptimized />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border-2 ${
                    activeImage === index ? "border-[#063f34]" : "border-transparent"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <Image src={image} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#edf2ef] px-4 py-2 text-sm font-bold text-[#063f34]">
              <BadgeCheck size={16} /> Verified artisan
            </div>
            <h1 className="max-w-2xl text-5xl font-black tracking-tight text-[#063f34] sm:text-6xl">
              The Earthbound Solstice Vase
            </h1>
            <p className="mt-4 text-lg text-[#53615c]">
              by <Link href="/sell" className="font-bold text-[#9a4d10]">{product.seller}</Link> · {product.sellerLocation}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <p className="text-4xl font-black text-[#1b211f]">$185.00</p>
              <p className="flex items-center gap-1 rounded-full border border-[#d8dfdc] bg-white px-4 py-2 text-sm font-bold">
                <Star size={16} className="fill-[#c8651b] text-[#c8651b]" /> 4.8 · 124 reviews
              </p>
            </div>

            <p className="mt-7 max-w-2xl text-[17px] leading-8 text-[#53615c]">
              Sculpted from iron-rich stoneware clay, this vase has a tactile ribbed surface, subtle mineral speckling, and a warm reduction-fired finish. Each piece is made in small batches and signed by the maker.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Sustainable stoneware", "Lead-free glaze", "Locally sourced clay", "Hand signed"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#d8dfdc] bg-white px-4 py-3 text-sm font-bold text-[#25332e]">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-[#d8dfdc] bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-14 w-40 items-center justify-between rounded-full border border-[#d8dfdc] px-4">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                    <Minus size={18} />
                  </button>
                  <span className="font-black">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                    <Plus size={18} />
                  </button>
                </div>
                <button className="h-14 flex-1 rounded-full bg-[#f28a35] px-6 text-base font-black text-white transition hover:bg-[#dc7624]">
                  Add to cart
                </button>
              </div>
              <button
                onClick={() => setSaved((value) => !value)}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#063f34] font-black text-[#063f34] transition hover:bg-[#edf2ef]"
              >
                <Heart size={18} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save to collection"}
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-[#53615c] sm:grid-cols-3">
              <span className="flex items-center gap-2"><Truck size={17} className="text-[#063f34]" /> Plastic-free shipping</span>
              <span className="flex items-center gap-2"><Leaf size={17} className="text-[#063f34]" /> Sustainable materials</span>
              <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#063f34]" /> Secure checkout</span>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-10 border-t border-[#d8dfdc] pt-12 lg:grid-cols-[360px_1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9a4d10]">Reviews and ratings</p>
            <h2 className="mt-2 text-4xl font-black text-[#063f34]">Loved by collectors.</h2>
            <div className="mt-6 rounded-3xl bg-white p-6">
              <p className="text-6xl font-black">4.8</p>
              <p className="mt-2 flex text-[#c8651b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="currentColor" />
                ))}
              </p>
              <p className="mt-2 text-sm text-[#53615c]">Based on 124 written reviews</p>
            </div>
          </div>

          <div className="space-y-5">
            {reviews.map((review) => (
              <article key={review.name} className="rounded-3xl border border-[#d8dfdc] bg-white p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black text-[#063f34]">{review.name}</p>
                    <p className="mt-1 flex text-[#c8651b]">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} size={15} fill="currentColor" />
                      ))}
                    </p>
                  </div>
                  <p className="text-sm text-[#6d7a75]">{review.date}</p>
                </div>
                <h3 className="mt-4 text-2xl font-black text-[#1b211f]">{review.title}</h3>
                <p className="mt-2 leading-relaxed text-[#53615c]">{review.text}</p>
                <button className="mt-4 flex items-center gap-2 text-sm font-bold text-[#53615c]">
                  <MessageSquare size={16} /> Comment
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9a4d10]">More to discover</p>
              <h2 className="text-3xl font-black text-[#063f34]">Related handcrafted pieces</h2>
            </div>
            <Link href="/browse" className="font-black text-[#063f34]">View all</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
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

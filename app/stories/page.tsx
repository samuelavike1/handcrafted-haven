import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Leaf, Users } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Metadata } from "next"
import { storyPosts } from "@/lib/market-data"

export const metadata: Metadata = {
  title: "Artisan Stories | Handcrafted Haven",
  description: "Meet the makers, materials, and communities behind Handcrafted Haven.",
}

export default function StoriesPage() {
  const [featured, ...rest] = storyPosts

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#9a4d10]">Community journal</p>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-[#063f34] sm:text-7xl">
              The people behind the pieces.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#53615c]">
              Read maker profiles, material guides, sustainability notes, and collector stories from the Handcrafted Haven community.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#d8dfdc] bg-white p-5">
                <Users className="text-[#063f34]" />
                <p className="mt-4 font-black text-[#063f34]">Human-first commerce</p>
              </div>
              <div className="rounded-3xl border border-[#d8dfdc] bg-white p-5">
                <Leaf className="text-[#063f34]" />
                <p className="mt-4 font-black text-[#063f34]">Sustainable practices</p>
              </div>
            </div>
          </div>

          <Link href={`/stories/${featured.id}`} className="group overflow-hidden rounded-[34px] border border-[#d8dfdc] bg-white">
            <div className="relative h-[420px] overflow-hidden">
              <Image src={featured.image} alt={featured.title} fill className="object-cover transition duration-700 group-hover:scale-105" unoptimized />
              <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#9a4d10]">
                Featured
              </div>
            </div>
            <div className="p-7">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9a4d10]">{featured.category}</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#063f34]">{featured.title}</h2>
              <p className="mt-4 leading-relaxed text-[#53615c]">{featured.excerpt}</p>
              <p className="mt-5 inline-flex items-center gap-2 font-black text-[#063f34]">
                Read story <ArrowRight size={18} />
              </p>
            </div>
          </Link>
        </section>

        <section className="border-t border-[#d8dfdc] bg-[#f0f3ef] py-14">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#9a4d10]">Latest stories</p>
              <h2 className="mt-2 text-4xl font-black text-[#063f34]">Craft, care, and community.</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((story) => (
                <Link key={story.id} href={`/stories/${story.id}`} className="group grid overflow-hidden rounded-3xl border border-[#d8dfdc] bg-white sm:grid-cols-[220px_1fr]">
                  <div className="relative min-h-[220px] overflow-hidden">
                    <Image src={story.image} alt={story.title} fill className="object-cover transition duration-700 group-hover:scale-105" unoptimized />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9a4d10]">{story.category}</p>
                    <h3 className="mt-3 text-2xl font-black leading-tight text-[#063f34]">{story.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#53615c]">{story.excerpt}</p>
                    <p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#53615c]">
                      <Clock size={15} /> {story.readTime} · {story.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

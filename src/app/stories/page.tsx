import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Leaf, Users } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Metadata } from "next"
import { storyPosts } from "@/lib/market-data"

export const metadata: Metadata = {
  title: "Artisan Stories | Handcrafted Haven",
  description:
    "Meet the makers, materials, and communities behind Handcrafted Haven.",
}

export default function StoriesPage() {
  const [featured, ...rest] = storyPosts

  return (
    <div className="min-h-screen bg-hh-canvas">
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-[1080px] gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Community journal
            </p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-hh-heading sm:text-2xl">
              The people behind the pieces.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-hh-muted">
              Read maker profiles, material guides, sustainability notes, and
              collector stories from the Handcrafted Haven community.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-hh-border bg-hh-card p-4">
                <Users className="text-hh-heading" />
                <p className="mt-4 font-black text-hh-heading">
                  Human-first commerce
                </p>
              </div>
              <div className="rounded-lg border border-hh-border bg-hh-card p-4">
                <Leaf className="text-hh-heading" />
                <p className="mt-4 font-black text-hh-heading">
                  Sustainable practices
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/stories/${featured.id}`}
            className="group overflow-hidden rounded-lg border border-hh-border bg-hh-card"
          >
            <div className="relative h-[240px] overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute top-4 left-4 rounded-md bg-hh-card px-3 py-2 text-[11px] font-black text-[#9a4d10] uppercase">
                Featured
              </div>
            </div>
            <div className="p-4">
              <p className="text-[11px] font-black text-[#9a4d10] uppercase">
                {featured.category}
              </p>
              <h2 className="mt-3 text-2xl leading-tight font-black text-hh-heading">
                {featured.title}
              </h2>
              <p className="mt-4 leading-relaxed text-hh-muted">
                {featured.excerpt}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 font-black text-hh-heading">
                Read story <ArrowRight size={18} />
              </p>
            </div>
          </Link>
        </section>

        <section className="border-t border-hh-border bg-hh-surface py-6">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-5 lg:px-6">
            <div className="mb-5">
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Latest stories
              </p>
              <h2 className="mt-2 text-2xl font-black text-hh-heading">
                Craft, care, and community.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {rest.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="group grid overflow-hidden rounded-lg border border-hh-border bg-hh-card sm:grid-cols-[180px_1fr]"
                >
                  <div className="relative min-h-[150px] overflow-hidden">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-black text-[#9a4d10] uppercase">
                      {story.category}
                    </p>
                    <h3 className="mt-3 text-lg leading-tight font-black text-hh-heading">
                      {story.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-hh-muted">
                      {story.excerpt}
                    </p>
                    <p className="mt-5 flex items-center gap-2 text-sm font-bold text-hh-muted">
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

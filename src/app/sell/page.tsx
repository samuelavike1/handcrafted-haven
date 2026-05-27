import Link from "next/link"
import { ArrowRight, BadgeCheck, BarChart3, PackagePlus } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ShimmerImage from "@/components/ui/shimmer-image"
import { images } from "@/lib/images"

export const metadata = {
  title: "Sell on Handcrafted Haven",
  description:
    "Open a seller studio, publish handcrafted listings, and manage your artisan business.",
}

export default function SellPage() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-[#d8dfdc]">
          <div className="absolute inset-0">
            <ShimmerImage
              src={images.categoryPottery}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,45,37,0.92),rgba(4,45,37,0.62),rgba(4,45,37,0.18))]" />
          </div>

          <div className="relative mx-auto grid min-h-[390px] max-w-[1080px] items-center px-4 py-10 sm:px-5 lg:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-black text-[#f7b071] uppercase">
                Seller program
              </p>
              <h1 className="mt-3 text-3xl leading-tight font-black text-white sm:text-4xl">
                Build a trusted storefront for your handcrafted work.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/82">
                Register your studio, publish product listings, track inventory,
                and prepare your shop for buyers who care about origin,
                materials, and craft.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sell/register"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#f28a35] px-4 text-sm font-black text-white"
                >
                  Start selling <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/sell/login"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/70 px-4 text-sm font-black text-white hover:bg-white hover:text-[#063f34]"
                >
                  Seller sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1080px] gap-4 px-4 py-6 sm:px-5 md:grid-cols-3 lg:px-6">
          {[
            {
              icon: BadgeCheck,
              title: "Verified studio profile",
              text: "Show your craft story, location, and trust signals in one place.",
            },
            {
              icon: PackagePlus,
              title: "Product management",
              text: "Add listings with pricing, stock, materials, status, and buyer-ready details.",
            },
            {
              icon: BarChart3,
              title: "Seller dashboard",
              text: "Track inventory, orders, visits, and performance after signing in.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-lg border border-[#d8dfdc] bg-white p-4"
            >
              <Icon className="text-[#063f34]" size={22} />
              <h2 className="mt-4 text-lg font-black text-[#063f34]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#53615c]">{text}</p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}

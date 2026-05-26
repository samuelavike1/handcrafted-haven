import Link from "next/link"
import { Store } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuthForm from "@/components/auth-form"

export const metadata = {
  title: "Seller Login | Handcrafted Haven",
  description: "Sign in to manage your Handcrafted Haven seller studio.",
}

export default function SellerLoginPage() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto grid max-w-[1080px] gap-6 px-4 py-8 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
        <section className="flex flex-col justify-center">
          <p className="text-xs font-black text-[#9a4d10] uppercase">
            Seller access
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-[#063f34]">
            Sign in to manage your studio.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#53615c]">
            Update listings, review orders, and keep your artisan profile ready
            for collectors.
          </p>
          <div className="mt-5 rounded-lg border border-[#d8dfdc] bg-white p-4">
            <Store className="text-[#063f34]" size={22} />
            <p className="mt-3 text-sm font-bold text-[#063f34]">
              New to Handcrafted Haven?
            </p>
            <Link
              href="/sell/register"
              className="mt-3 inline-flex rounded-lg bg-[#f28a35] px-4 py-2 text-sm font-black text-white"
            >
              Register your studio
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-[#d8dfdc] bg-white p-5 shadow-[0_12px_28px_rgba(18,40,33,0.08)]">
          <AuthForm mode="login" defaultRole="seller" />
        </section>
      </main>

      <Footer />
    </div>
  )
}

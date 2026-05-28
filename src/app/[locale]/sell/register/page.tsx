import { BadgeCheck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuthForm from "@/components/auth-form"

export const metadata = {
  title: "Seller Registration | Handcrafted Haven",
  description: "Create a seller studio for Handcrafted Haven.",
}

export default function SellerRegisterPage() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto grid max-w-[1080px] gap-6 px-4 py-8 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
        <section className="flex flex-col justify-center">
          <p className="text-xs font-black text-[#9a4d10] uppercase">
            Join the marketplace
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-[#063f34]">
            Register your artisan studio.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#53615c]">
            Create a profile, share your craft story, and prepare listings for
            buyers who value handmade work.
          </p>

          <div className="mt-5 grid gap-3">
            {[
              "Dedicated seller profile",
              "Product listings with descriptions and pricing",
              "Reviews and trust signals for buyers",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-[#d8dfdc] bg-white p-3 text-sm font-bold text-[#063f34]"
              >
                <BadgeCheck size={16} />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#d8dfdc] bg-white p-5 shadow-[0_12px_28px_rgba(18,40,33,0.08)]">
          <AuthForm mode="register" defaultRole="seller" />
        </section>
      </main>

      <Footer />
    </div>
  )
}

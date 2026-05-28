import { BadgeCheck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuthForm from "@/components/auth-form"

export const metadata = {
  title: "Create Buyer Account | Handcrafted Haven",
  description: "Create a buyer account for Handcrafted Haven.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />

      <main className="mx-auto grid max-w-[1080px] gap-6 px-4 py-8 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
        <section className="flex flex-col justify-center">
          <p className="text-xs font-black text-[#9a4d10] uppercase">
            Buyer account
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-[#063f34]">
            Create an account for shopping handmade goods.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#53615c]">
            Save favorite pieces, track orders, and leave reviews for artisan
            sellers.
          </p>
          <div className="mt-5 grid gap-3">
            {["Order history", "Saved handmade pieces", "Product reviews"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-[#d8dfdc] bg-white p-3 text-sm font-bold text-[#063f34]"
                >
                  <BadgeCheck size={16} />
                  {item}
                </div>
              )
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[#d8dfdc] bg-white p-5 shadow-[0_12px_28px_rgba(18,40,33,0.08)]">
          <AuthForm mode="register" defaultRole="buyer" showSellerLink />
        </section>
      </main>

      <Footer />
    </div>
  )
}

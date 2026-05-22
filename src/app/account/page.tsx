import { redirect } from "next/navigation"
import { Package, Star, UserRound } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

export const metadata = {
  title: "Buyer Account | Handcrafted Haven",
  description: "Manage buyer orders, reviews, and profile details.",
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!hasRole(user, ["buyer", "admin"])) redirect("/login")

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />
      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <section className="rounded-lg border border-[#d8dfdc] bg-white p-5">
          <p className="text-xs font-black text-[#9a4d10] uppercase">
            Buyer account
          </p>
          <h1 className="mt-2 text-2xl font-black text-[#063f34]">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#53615c]">
            This workspace is ready for order history, saved pieces, reviews,
            and profile settings.
          </p>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { icon: Package, label: "Orders", value: "3 active" },
            { icon: Star, label: "Reviews", value: "2 pending" },
            { icon: UserRound, label: "Profile", value: user?.email ?? "" },
          ].map(({ icon: Icon, label, value }) => (
            <article
              key={label}
              className="rounded-lg border border-[#d8dfdc] bg-white p-4"
            >
              <Icon className="text-[#063f34]" size={22} />
              <p className="mt-4 text-xs font-black text-[#9a4d10] uppercase">
                {label}
              </p>
              <p className="mt-2 text-lg font-black text-[#063f34]">{value}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}

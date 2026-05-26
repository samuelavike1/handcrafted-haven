import Link from "next/link"
import { ShieldCheck, Store, Users } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import AuthForm from "@/components/auth-form"
import AdminCreateForm from "@/components/admin-create-form"

export const metadata = {
  title: "Admin | Handcrafted Haven",
  description: "Marketplace administration for Handcrafted Haven.",
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  const isAdmin = hasRole(user, ["admin"])

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />
      {isAdmin ? (
        <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
          <section className="rounded-lg border border-[#d8dfdc] bg-[#063f34] p-5 text-white">
            <p className="text-xs font-black text-[#f7b071] uppercase">
              Admin workspace
            </p>
            <h1 className="mt-2 text-2xl font-black">Marketplace operations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
              Review marketplace health, seller activity, buyer accounts, and
              moderation tasks.
            </p>
          </section>

          <section className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { icon: Users, label: "Users", value: "Seeded accounts" },
              { icon: Store, label: "Sellers", value: "Studios active" },
              { icon: ShieldCheck, label: "Moderation", value: "Ready" },
            ].map(({ icon: Icon, label, value }) => (
              <article
                key={label}
                className="rounded-lg border border-[#d8dfdc] bg-white p-4"
              >
                <Icon className="text-[#063f34]" size={22} />
                <p className="mt-4 text-xs font-black text-[#9a4d10] uppercase">
                  {label}
                </p>
                <p className="mt-2 text-lg font-black text-[#063f34]">
                  {value}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-4">
            <AdminCreateForm />
          </section>
        </main>
      ) : (
        <main className="mx-auto grid max-w-[1080px] gap-6 px-4 py-8 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
          <section className="flex flex-col justify-center">
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Admin access
            </p>
            <h1 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-[#063f34]">
              Sign in to manage the marketplace.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#53615c]">
              Admin accounts cannot be created publicly. A signed-in admin must
              create new admin access from this workspace.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex w-fit rounded-lg border border-[#063f34] px-4 py-2 text-sm font-black text-[#063f34]"
            >
              Buyer sign in
            </Link>
          </section>

          <section className="rounded-lg border border-[#d8dfdc] bg-white p-5 shadow-[0_12px_28px_rgba(18,40,33,0.08)]">
            <AuthForm mode="login" defaultRole="admin" />
          </section>
        </main>
      )}
      <Footer />
    </div>
  )
}

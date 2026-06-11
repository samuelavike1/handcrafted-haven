import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, Star, UserRound } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SavedItemsClient from "@/components/saved-items-client"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import { getOrdersForUser } from "@/lib/server-orders"
import { getProducts } from "@/lib/server-products"

export const metadata = {
  title: "Buyer Account | Handcrafted Haven",
  description: "Manage buyer orders, reviews, and profile details.",
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!hasRole(user, ["buyer", "admin"])) redirect("/login")
  const [orders, products] = await Promise.all([
    getOrdersForUser(user).catch(() => []),
    getProducts().catch(() => []),
  ])

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
            Track purchases, revisit saved pieces, and keep your buyer details
            ready for future checkout.
          </p>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { icon: Package, label: "Orders", value: `${orders.length} saved` },
            { icon: Star, label: "Saved", value: "Browser collection" },
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

        <section className="mt-4 rounded-lg border border-[#d8dfdc] bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-[#9a4d10] uppercase">
                Order history
              </p>
              <h2 className="text-lg font-black text-[#063f34]">
                Recent purchases
              </h2>
            </div>
          </div>
          {orders.length ? (
            <div className="divide-y divide-[#d8dfdc]">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="font-black text-[#063f34] hover:text-[#0b5b4a] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
                    >
                      {order.id}
                    </Link>
                    <p className="text-sm text-[#53615c]">
                      {order.items.length} item
                      {order.items.length === 1 ? "" : "s"} · {order.status}
                    </p>
                  </div>
                  <p className="font-black text-[#1b211f]">
                    ${order.total.toFixed(2)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#cfd9d4] bg-[#fbfbf8] p-6">
              <h3 className="font-black text-[#063f34]">No orders yet</h3>
              <p className="mt-2 text-sm font-semibold text-[#53615c]">
                Orders placed while signed in, or guest orders using this email,
                will appear here.
              </p>
              <Link
                href="/browse"
                className="mt-4 inline-flex rounded-lg bg-[#063f34] px-4 py-2 text-sm font-black text-white focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
              >
                Browse products
              </Link>
            </div>
          )}
        </section>

        <section className="mt-4 rounded-lg border border-[#d8dfdc] bg-white p-4">
          <p className="text-xs font-black text-[#9a4d10] uppercase">Profile</p>
          <h2 className="mt-1 text-lg font-black text-[#063f34]">
            Checkout identity
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-[#fbfbf8] p-3">
              <p className="text-xs font-black text-[#6d7a75] uppercase">
                Name
              </p>
              <p className="mt-1 font-black text-[#1b211f]">{user.name}</p>
            </div>
            <div className="rounded-lg bg-[#fbfbf8] p-3">
              <p className="text-xs font-black text-[#6d7a75] uppercase">
                Email
              </p>
              <p className="mt-1 font-black text-[#1b211f]">{user.email}</p>
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold text-[#53615c]">
            Checkout pre-fills these details when you are signed in.
          </p>
        </section>

        <SavedItemsClient products={products} />
      </main>
      <Footer />
    </div>
  )
}

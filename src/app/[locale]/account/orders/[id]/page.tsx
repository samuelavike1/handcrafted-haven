import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, PackageCheck, ShieldCheck, Truck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import { getOrderForUser } from "@/lib/server-orders"
import ShimmerImage from "@/components/ui/shimmer-image"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const user = await getCurrentUser()
  if (!hasRole(user, ["buyer", "admin"])) redirect("/login")

  const { id } = await params
  const order = await getOrderForUser(id, user)
  if (!order) notFound()

  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />
      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <Link
          href="/account"
          className="mb-4 inline-flex items-center text-sm font-black text-[#063f34] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
        >
          <ArrowLeft className="mr-2" size={17} /> Back to account
        </Link>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-lg border border-[#d8dfdc] bg-white p-5">
            <p className="text-xs font-black text-[#9a4d10] uppercase">
              Order details
            </p>
            <h1 className="mt-2 text-2xl font-black text-[#063f34]">
              {order.id}
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#53615c]">
              Placed {formatDate(order.createdAt)} · {order.status}
            </p>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <article
                  key={`${order.id}-${item.productId}`}
                  className="grid gap-3 rounded-lg border border-[#d8dfdc] bg-[#fbfbf8] p-3 sm:grid-cols-[72px_1fr_auto]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[#edf2ef]">
                    <ShimmerImage
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-black text-[#063f34] hover:text-[#0b5b4a] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-[#53615c]">
                      {item.seller} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-black text-[#1b211f]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-[#d8dfdc] bg-white p-4 lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-[#063f34]">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm text-[#53615c]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-[#1b211f]">
                  ${order.subtotal.toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <strong className="text-[#1b211f]">
                  {order.shipping === 0
                    ? "FREE"
                    : `$${order.shipping.toFixed(2)}`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <strong className="text-[#1b211f]">
                  ${order.tax.toFixed(2)}
                </strong>
              </div>
            </div>
            <div className="mt-4 border-t border-[#d8dfdc] pt-4">
              <div className="flex justify-between">
                <span className="font-black text-[#063f34]">Total</span>
                <span className="text-xl font-black text-[#063f34]">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-[#53615c]">
              <span className="flex items-center gap-2">
                <PackageCheck size={17} className="text-[#063f34]" /> Processing
              </span>
              <span className="flex items-center gap-2">
                <Truck size={17} className="text-[#063f34]" /> Delivery
                estimate: 3-5 business days
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#063f34]" /> Buyer
                protection active
              </span>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  )
}

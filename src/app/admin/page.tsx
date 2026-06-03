import Link from "next/link"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import AuthForm from "@/components/auth-form"
import AdminWorkspaceClient from "@/components/admin-workspace-client"
import { getAdminWorkspaceData } from "@/lib/server-admin"

export const metadata = {
  title: "Admin | Handcrafted Haven",
  description: "Marketplace administration for Handcrafted Haven.",
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  const isAdmin = hasRole(user, ["admin"])
  const workspaceData = isAdmin ? await getAdminWorkspaceData(user) : null

  if (isAdmin && workspaceData) {
    return (
      <AdminWorkspaceClient
        currentUserId={user.id}
        initialUsers={workspaceData.users}
        initialProducts={workspaceData.products}
        initialOrders={workspaceData.orders}
        initialStats={workspaceData.stats}
      />
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#062f28] via-[#0a4438] to-[#062f28]">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex min-h-screen flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white/90"
          >
            <ArrowLeft size={15} />
            Back to site
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white"
          >
            Buyer sign in
          </Link>
        </div>

        {/* Main content */}
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="grid gap-8 lg:grid-cols-[1fr_480px] lg:items-center">
              {/* Left — Branding */}
              <div className="text-white">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f7b071]/30 bg-[#f7b071]/20 backdrop-blur-sm">
                    <ShieldCheck size={24} className="text-[#f7b071]" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-widest text-[#f7b071] uppercase">
                      Handcrafted Haven
                    </p>
                    <p className="text-sm font-semibold text-white/60">
                      Admin Console
                    </p>
                  </div>
                </div>

                <h1 className="text-4xl leading-tight font-black tracking-tight text-white lg:text-5xl">
                  Manage your
                  <br />
                  <span className="text-[#f7b071]">marketplace.</span>
                </h1>

                <p className="mt-5 max-w-sm text-base leading-7 text-white/60">
                  Sign in to access the admin workspace — orders, products,
                  users, and platform controls all in one place.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { label: "Orders", icon: "📦" },
                    { label: "Products", icon: "🛍️" },
                    { label: "Users", icon: "👥" },
                  ].map(({ label, icon }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                    >
                      <p className="text-lg">{icon}</p>
                      <p className="mt-1 text-xs font-bold tracking-wide text-white/60 uppercase">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-white/35">
                  Admin accounts are restricted. A signed-in admin must create
                  new admin access from the workspace.
                </p>
              </div>

              {/* Right — Login form */}
              <div className="rounded-2xl border border-white/10 bg-white/8 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="rounded-xl bg-white p-6">
                  <p className="text-xs font-black tracking-widest text-[#9a4d10] uppercase">
                    Admin sign in
                  </p>
                  <h2 className="mt-1.5 text-xl font-black text-[#063f34]">
                    Welcome back
                  </h2>
                  <p className="mt-1 text-sm text-[#53615c]">
                    Enter your admin credentials below.
                  </p>
                  <div className="mt-5">
                    <AuthForm mode="login" defaultRole="admin" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Handcrafted Haven · Restricted access
          </p>
        </div>
      </div>
    </div>
  )
}

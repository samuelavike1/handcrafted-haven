import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SellerDashboardClient from "@/components/seller-dashboard-client"
import { getCurrentUser, hasRole } from "@/lib/server-auth"

export const metadata = {
  title: "Seller Dashboard | Handcrafted Haven",
  description: "Manage seller listings, inventory, and studio details.",
}

export default async function SellerDashboardPage() {
  const user = await getCurrentUser()
  if (!hasRole(user, ["seller", "admin"])) redirect("/sell/login")

  return (
    <div className="min-h-screen bg-[#f4f6f5]">
      <Navbar />

      <main className="mx-auto max-w-[1160px] px-4 py-6 sm:px-5 lg:px-6">
        <SellerDashboardClient
          user={{
            name: user.name,
            email: user.email,
            studioName: user.studioName,
            location: user.location,
            story: user.story,
          }}
        />
      </main>

      <Footer />
    </div>
  )
}

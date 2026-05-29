import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getCurrentUser, hasRole } from "@/lib/server-auth"
import SellerProfileClient from "@/components/seller-profile-client"

export default async function SellerProfilePage() {
    const user = await getCurrentUser();
    if (!hasRole(user, ["seller", "admin"])) redirect("/sell/login")
    return (
    <div className="min-h-screen bg-[#f4f6f5]">
      <Navbar />

      <main className="mx-auto max-w-[1160px] px-4 py-6 sm:px-5 lg:px-6">
        <SellerProfileClient
            name={user.name}
            email={user.email}
            studioName={user.studioName}
            location={user.location}
            story={user.story}
        />
      </main>

      <Footer />
    </div>
  )    
}
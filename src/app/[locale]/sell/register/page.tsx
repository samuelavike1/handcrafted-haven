import AuthForm from "@/components/auth-form"
import AuthShell from "@/components/auth-shell"
import { images } from "@/lib/images"

export const metadata = {
  title: "Register Your Studio | Handcrafted Haven",
  description:
    "Open a free seller studio on Handcrafted Haven and start listing your handcrafted goods.",
}

export default function SellerRegisterPage() {
  return (
    <AuthShell
      accent="seller"
      background={images.categoryWoodworking}
      eyebrow="Open your studio"
      title={
        <>
          Turn your craft
          <br />
          <span className="text-[#e28a50]">into business.</span>
        </>
      }
      description="Create your seller profile, publish listings, and connect with buyers who care about the details."
      actionHref="/sell/login"
      actionLabel="Sign in"
      formEyebrow="Create studio"
      footerNote={`© ${new Date().getFullYear()} Handcrafted Haven · Seller terms apply`}
      trustPoints={["Seller profile", "Inventory tools", "Order management"]}
    >
      <AuthForm mode="register" defaultRole="seller" twoColumn />
    </AuthShell>
  )
}

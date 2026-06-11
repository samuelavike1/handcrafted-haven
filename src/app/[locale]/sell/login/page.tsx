import AuthForm from "@/components/auth-form"
import AuthShell from "@/components/auth-shell"
import { images } from "@/lib/images"

export const metadata = {
  title: "Seller Sign In | Handcrafted Haven",
  description: "Sign in to manage your Handcrafted Haven seller studio.",
}

export default function SellerLoginPage() {
  return (
    <AuthShell
      accent="seller"
      background={images.categoryTextiles}
      eyebrow="Seller access"
      title={
        <>
          Back to your
          <br />
          <span className="text-[#e28a50]">studio.</span>
        </>
      }
      description="Manage listings, inventory, seller orders, and studio details from one workspace."
      actionHref="/sell/register"
      actionLabel="Register studio"
      formEyebrow="Seller sign in"
      footerNote={`© ${new Date().getFullYear()} Handcrafted Haven · Secure seller access`}
      trustPoints={["Listing tools", "Order queue", "Sales stats"]}
    >
      <AuthForm mode="login" defaultRole="seller" />
    </AuthShell>
  )
}

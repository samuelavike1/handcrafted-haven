import AuthForm from "@/components/auth-form"
import AuthShell from "@/components/auth-shell"
import { images } from "@/lib/images"

export const metadata = {
  title: "Create Account | Handcrafted Haven",
  description: "Create a free buyer account to shop handcrafted goods.",
}

export default function RegisterPage() {
  return (
    <AuthShell
      background={images.heroArtisan}
      eyebrow="New buyer account"
      title={
        <>
          Join the
          <br />
          <span className="text-[#d4b896]">community.</span>
        </>
      }
      description="Create an account to save favorites, revisit orders, and discover work from verified artisans."
      actionHref="/login"
      actionLabel="Sign in"
      formEyebrow="Create account"
      footerNote={`© ${new Date().getFullYear()} Handcrafted Haven`}
      trustPoints={["Verified makers", "Saved items", "Order tracking"]}
    >
      <AuthForm mode="register" defaultRole="buyer" showSellerLink twoColumn />
    </AuthShell>
  )
}

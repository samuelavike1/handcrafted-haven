import AuthForm from "@/components/auth-form"
import AuthShell from "@/components/auth-shell"
import { images } from "@/lib/images"

export const metadata = {
  title: "Sign In | Handcrafted Haven",
  description: "Sign in to your buyer account.",
}

export default function LoginPage() {
  return (
    <AuthShell
      background={images.categoryPottery}
      eyebrow="Buyer access"
      title={
        <>
          Welcome
          <br />
          <span className="text-[#d4b896]">back.</span>
        </>
      }
      description="Sign in to continue shopping, view saved pieces, and track handcrafted orders."
      actionHref="/register"
      actionLabel="Create account"
      formEyebrow="Sign in"
      footerNote={`© ${new Date().getFullYear()} Handcrafted Haven`}
      trustPoints={["Saved pieces", "Order history", "Guest checkout"]}
    >
      <AuthForm mode="login" defaultRole="buyer" showSellerLink />
    </AuthShell>
  )
}

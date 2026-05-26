"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Mail } from "lucide-react"

type LoginErrors = {
  email?: string[]
  password?: string[]
}

export default function SellerLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<LoginErrors>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setMessage("")

    try {
      const response = await fetch("/api/sellers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) setErrors(data.errors)
        throw new Error(data.error ?? "Please review your login details.")
      }

      setMessage(`Welcome back, ${data.seller.studioName}. Redirecting...`)
      router.push("/sell/dashboard")
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Check MongoDB and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitLogin} className="grid gap-4">
      <div>
        <h2 className="text-2xl font-black text-[#063f34]">Seller login</h2>
        <p className="mt-1 text-sm text-[#53615c]">
          Use your seller email and password.
        </p>
      </div>

      <label>
        <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
          Email
        </span>
        <span className="relative block">
          <Mail
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6d7a75]"
            size={16}
          />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`h-10 w-full rounded-lg border bg-[#fbfbf8] pr-3 pl-9 text-sm outline-none focus:border-[#063f34] ${errors.email ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
            placeholder="seller@example.com"
          />
        </span>
        {errors.email?.[0] && (
          <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
            {errors.email[0]}
          </span>
        )}
      </label>

      <label>
        <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
          Password
        </span>
        <span className="relative block">
          <Lock
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6d7a75]"
            size={16}
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`h-10 w-full rounded-lg border bg-[#fbfbf8] pr-3 pl-9 text-sm outline-none focus:border-[#063f34] ${errors.password ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
            placeholder="Password"
          />
        </span>
        {errors.password?.[0] && (
          <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
            {errors.password[0]}
          </span>
        )}
      </label>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 font-semibold text-[#53615c]">
          <input type="checkbox" className="h-4 w-4 accent-[#063f34]" />
          Remember me
        </label>
        <a href="#" className="font-bold text-[#063f34]">
          Forgot password?
        </a>
      </div>

      {message && (
        <p className="rounded-lg bg-[#f0f3ef] px-3 py-2 text-sm font-semibold text-[#53615c]">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-10 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="mr-2 animate-spin" size={16} />}
        Sign in
      </button>

      <p className="text-center text-sm text-[#53615c]">
        New seller?{" "}
        <Link href="/sell/register" className="font-black text-[#063f34]">
          Register your studio
        </Link>
      </p>
    </form>
  )
}

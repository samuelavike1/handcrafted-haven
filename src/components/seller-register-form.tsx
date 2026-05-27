"use client"

import { FormEvent, useState } from "react"
import type { ElementType } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Mail, MapPin, Store, UserRound } from "lucide-react"

type RegisterForm = {
  name: string
  email: string
  password: string
  studioName: string
  location: string
  story: string
}

type RegisterErrors = Partial<Record<keyof RegisterForm, string[]>>

const initialForm: RegisterForm = {
  name: "",
  email: "",
  password: "",
  studioName: "",
  location: "",
  story: "",
}

export default function SellerRegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setMessage("")

    try {
      const response = await fetch("/api/sellers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) setErrors(data.errors)
        throw new Error(data.error ?? "Please review the form fields.")
      }

      setMessage(`${data.seller.studioName} was registered. Redirecting...`)
      router.push("/sell/dashboard")
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Check MongoDB and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitRegistration} className="grid gap-4">
      <div>
        <h2 className="text-2xl font-black text-[#063f34]">
          Seller registration
        </h2>
        <p className="mt-1 text-sm text-[#53615c]">
          Add your basic studio information.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <IconInput
          label="Full name"
          value={form.name}
          error={errors.name?.[0]}
          icon={UserRound}
          placeholder="Your name"
          onChange={(value) => updateField("name", value)}
        />
        <IconInput
          label="Email"
          value={form.email}
          error={errors.email?.[0]}
          icon={Mail}
          type="email"
          placeholder="studio@example.com"
          onChange={(value) => updateField("email", value)}
        />
      </div>

      <IconInput
        label="Password"
        value={form.password}
        error={errors.password?.[0]}
        icon={UserRound}
        type="password"
        helper="Use at least 8 characters for this prototype login."
        placeholder="Create a password"
        onChange={(value) => updateField("password", value)}
      />

      <IconInput
        label="Studio name"
        value={form.studioName}
        error={errors.studioName?.[0]}
        icon={Store}
        placeholder="Earth & Ember Ceramics"
        onChange={(value) => updateField("studioName", value)}
      />

      <IconInput
        label="Location"
        value={form.location}
        error={errors.location?.[0]}
        icon={MapPin}
        placeholder="City, State or Country"
        onChange={(value) => updateField("location", value)}
      />

      <label>
        <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
          Craft story
        </span>
        <textarea
          rows={4}
          value={form.story}
          onChange={(event) => updateField("story", event.target.value)}
          className={`w-full rounded-lg border bg-[#fbfbf8] px-3 py-2 text-sm outline-none focus:border-[#063f34] ${errors.story ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
          placeholder="Tell buyers what you make, how you make it, and what makes your work unique."
        />
        {errors.story?.[0] ? (
          <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
            {errors.story[0]}
          </span>
        ) : (
          <span className="mt-1 block text-xs text-[#6d7a75]">
            This appears on your seller profile and helps buyers trust your
            work.
          </span>
        )}
      </label>

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
        Create seller studio
      </button>

      <p className="text-center text-sm text-[#53615c]">
        Already registered?{" "}
        <Link href="/sell/login" className="font-black text-[#063f34]">
          Sign in
        </Link>
      </p>
    </form>
  )
}

function IconInput({
  label,
  value,
  onChange,
  icon: Icon,
  error,
  helper,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  icon: ElementType
  error?: string
  helper?: string
  placeholder?: string
  type?: string
}) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold text-[#53615c]">
        {label}
      </span>
      <span className="relative block">
        <Icon
          className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6d7a75]"
          size={16}
        />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full rounded-lg border bg-[#fbfbf8] pr-3 pl-9 text-sm outline-none focus:border-[#063f34] ${error ? "border-[#ba1a1a]" : "border-[#d8dfdc]"}`}
          placeholder={placeholder}
        />
      </span>
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
          {error}
        </span>
      ) : helper ? (
        <span className="mt-1 block text-xs text-[#6d7a75]">{helper}</span>
      ) : null}
    </label>
  )
}

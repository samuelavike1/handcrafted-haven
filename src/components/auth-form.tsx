"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Store,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"
import type { ElementType } from "react"
import type { UserRole } from "@/lib/schemas"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AuthMode = "login" | "register"

type AuthFormState = {
  name: string
  email: string
  password: string
  role: UserRole
  studioName: string
  location: string
  story: string
  adminCode: string
}

type AuthErrors = Partial<Record<keyof AuthFormState, string[]>>

const roleDestinations: Record<UserRole, string> = {
  buyer: "/account",
  seller: "/sell/dashboard",
  admin: "/admin",
}

const initialState = (role: UserRole): AuthFormState => ({
  name: "",
  email: "",
  password: "",
  role,
  studioName: "",
  location: "",
  story: "",
  adminCode: "",
})

export default function AuthForm({
  mode,
  defaultRole = "buyer",
  showSellerLink = false,
}: {
  mode: AuthMode
  defaultRole?: UserRole
  showSellerLink?: boolean
}) {
  const router = useRouter()
  const [form, setForm] = useState<AuthFormState>(initialState(defaultRole))
  const [errors, setErrors] = useState<AuthErrors>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
  const title = mode === "login" ? "Sign in" : "Create account"
  const buttonLabel = mode === "login" ? "Sign in" : "Create account"

  const updateField = (field: keyof AuthFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setMessage("")

    try {
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password, role: form.role }
          : form

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) setErrors(data.errors)
        throw new Error(data.error ?? "Please review the form fields.")
      }

      toast.success(mode === "login" ? "Signed in" : "Account created", {
        description: "Redirecting to your workspace.",
      })
      router.push(roleDestinations[data.user.role as UserRole])
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Authentication failed. Check MongoDB and try again."
      )
      toast.error("Authentication failed", {
        description:
          error instanceof Error
            ? error.message
            : "Check your details and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      <div>
        <h2 className="text-2xl font-black text-[#063f34]">{title}</h2>
        <p className="mt-1 text-sm text-[#53615c]">
          {form.role === "seller"
            ? "Access your seller studio tools."
            : form.role === "admin"
              ? "Access marketplace administration."
              : mode === "login"
                ? "Sign in to manage purchases, reviews, and saved pieces."
                : "Create a buyer account to shop handcrafted goods."}
        </p>
      </div>

      {mode === "register" && (
        <IconInput
          label="Full name"
          value={form.name}
          error={errors.name?.[0]}
          icon={UserRound}
          placeholder="Your name"
          onChange={(value) => updateField("name", value)}
        />
      )}

      <IconInput
        label="Email"
        value={form.email}
        error={errors.email?.[0]}
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        onChange={(value) => updateField("email", value)}
      />

      <IconInput
        label="Password"
        value={form.password}
        error={errors.password?.[0]}
        icon={Lock}
        type="password"
        placeholder={mode === "login" ? "Password" : "At least 8 characters"}
        onChange={(value) => updateField("password", value)}
      />

      {mode === "register" && form.role === "seller" && (
        <div className="grid gap-4">
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
            <FieldMessage error={errors.story?.[0]}>
              This appears on your seller profile.
            </FieldMessage>
          </label>
        </div>
      )}

      {message && (
        <Alert
          variant="destructive"
          className="border-[#f0b8b8] bg-[#fff7f7] text-[#7a1d1d]"
        >
          <AlertCircle />
          <AlertTitle>Authentication issue</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-10 items-center justify-center rounded-lg bg-[#063f34] text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="mr-2 animate-spin" size={16} />}
        {buttonLabel}
      </button>

      <p className="text-center text-sm text-[#53615c]">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="font-black text-[#063f34]"
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>

      {showSellerLink && (
        <p className="text-center text-sm text-[#53615c]">
          Are you an artisan?{" "}
          <Link
            href={mode === "login" ? "/sell/login" : "/sell/register"}
            className="font-black text-[#063f34]"
          >
            {mode === "login" ? "Sign in as a seller" : "Start selling"}
          </Link>
        </p>
      )}
    </form>
  )
}

function IconInput({
  label,
  value,
  onChange,
  icon: Icon,
  error,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  icon: ElementType
  error?: string
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
      <FieldMessage error={error} />
    </label>
  )
}

function FieldMessage({
  error,
  children,
}: {
  error?: string
  children?: React.ReactNode
}) {
  if (error) {
    return (
      <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
        {error}
      </span>
    )
  }

  return children ? (
    <span className="mt-1 block text-xs text-[#6d7a75]">{children}</span>
  ) : null
}

"use client"

import { FormEvent, useMemo, useState } from "react"
import type { ElementType } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Store,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"
import type { UserRole } from "@/lib/schemas"

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
  twoColumn = false,
}: {
  mode: AuthMode
  defaultRole?: UserRole
  showSellerLink?: boolean
  twoColumn?: boolean
}) {
  const router = useRouter()
  const [form, setForm] = useState<AuthFormState>(initialState(defaultRole))
  const [errors, setErrors] = useState<AuthErrors>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
  const buttonLabel = mode === "login" ? "Sign in" : "Create account"
  const isSeller = form.role === "seller"

  const passwordHelp = useMemo(() => {
    if (mode === "login") return ""
    if (!form.password) return "Use at least 8 characters."
    if (form.password.length < 8) {
      return `${8 - form.password.length} more characters needed.`
    }
    return "Password length looks good."
  }, [form.password, mode])

  const updateField = (field: keyof AuthFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setMessage("")
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
    <form onSubmit={submit} className="grid gap-5" noValidate>
      {mode === "register" && twoColumn ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <IconInput
            label="Full name"
            name="name"
            value={form.name}
            error={errors.name?.[0]}
            icon={UserRound}
            placeholder="Your name"
            onChange={(value) => updateField("name", value)}
          />
          <IconInput
            label="Email address"
            name="email"
            value={form.email}
            error={errors.email?.[0]}
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            onChange={(value) => updateField("email", value)}
          />
        </div>
      ) : (
        <>
          {mode === "register" && (
            <IconInput
              label="Full name"
              name="name"
              value={form.name}
              error={errors.name?.[0]}
              icon={UserRound}
              placeholder="Your name"
              onChange={(value) => updateField("name", value)}
            />
          )}
          <IconInput
            label="Email address"
            name="email"
            value={form.email}
            error={errors.email?.[0]}
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            onChange={(value) => updateField("email", value)}
          />
        </>
      )}

      <label className="block">
        <span className="mb-1.5 block text-[10px] font-black tracking-widest text-[#6d7a75] uppercase">
          Password
        </span>
        <span className="relative block">
          <Lock
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9aada8]"
            size={15}
          />
          <input
            id="auth-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder={mode === "login" ? "Password" : "Min. 8 characters"}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "auth-password-error"
                : passwordHelp
                  ? "auth-password-help"
                  : undefined
            }
            className={`h-11 w-full rounded-lg border bg-white pr-10 pl-9 text-sm font-medium transition-all outline-none focus:ring-4 ${
              errors.password
                ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/10"
                : "border-[#d8dfdc] focus:border-[#063f34] focus:ring-[#063f34]/8"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9aada8] transition-colors hover:text-[#53615c] focus:ring-4 focus:ring-[#063f34]/10 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </span>
        {errors.password?.[0] ? (
          <span
            id="auth-password-error"
            className="mt-1.5 block text-xs font-semibold text-[#ba1a1a]"
          >
            {errors.password[0]}
          </span>
        ) : passwordHelp ? (
          <span
            id="auth-password-help"
            className={`mt-1.5 block text-xs font-semibold ${
              form.password.length >= 8 ? "text-[#063f34]" : "text-[#6d7a75]"
            }`}
          >
            {passwordHelp}
          </span>
        ) : null}
      </label>

      {mode === "register" && isSeller && (
        <div className="grid gap-5 border-t border-[#eef1ef] pt-5">
          <p className="text-[10px] font-black tracking-widest text-[#9aada8] uppercase">
            Studio details
          </p>
          {twoColumn ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <IconInput
                label="Studio name"
                name="studioName"
                value={form.studioName}
                error={errors.studioName?.[0]}
                icon={Store}
                placeholder="Earth & Ember Ceramics"
                onChange={(value) => updateField("studioName", value)}
              />
              <IconInput
                label="Location"
                name="location"
                value={form.location}
                error={errors.location?.[0]}
                icon={MapPin}
                placeholder="City, State"
                onChange={(value) => updateField("location", value)}
              />
            </div>
          ) : (
            <>
              <IconInput
                label="Studio name"
                name="studioName"
                value={form.studioName}
                error={errors.studioName?.[0]}
                icon={Store}
                placeholder="Earth & Ember Ceramics"
                onChange={(value) => updateField("studioName", value)}
              />
              <IconInput
                label="Location"
                name="location"
                value={form.location}
                error={errors.location?.[0]}
                icon={MapPin}
                placeholder="City, State or Country"
                onChange={(value) => updateField("location", value)}
              />
            </>
          )}
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-black tracking-widest text-[#6d7a75] uppercase">
              Craft story
            </span>
            <textarea
              id="auth-story"
              name="story"
              rows={3}
              value={form.story}
              onChange={(event) => updateField("story", event.target.value)}
              aria-invalid={Boolean(errors.story)}
              aria-describedby={
                errors.story ? "auth-story-error" : "auth-story-help"
              }
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm transition-all outline-none focus:ring-4 ${
                errors.story
                  ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/10"
                  : "border-[#d8dfdc] focus:border-[#063f34] focus:ring-[#063f34]/8"
              }`}
              placeholder="Tell buyers what you make, how you make it, and what makes your work unique."
            />
            {errors.story?.[0] ? (
              <span
                id="auth-story-error"
                className="mt-1.5 block text-xs font-semibold text-[#ba1a1a]"
              >
                {errors.story[0]}
              </span>
            ) : (
              <span
                id="auth-story-help"
                className="mt-1 block text-xs text-[#9aada8]"
              >
                Appears on your seller profile and helps buyers trust your work.
              </span>
            )}
          </label>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-2.5 rounded-lg border border-[#f0b8b8] bg-[#fff7f7] px-4 py-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#ba1a1a]" />
          <p className="text-sm font-semibold text-[#7a1d1d]">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#063f34] text-sm font-black text-white shadow-sm transition-colors hover:bg-[#075144] focus:ring-4 focus:ring-[#063f34]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="animate-spin" size={15} />}
        {buttonLabel}
      </button>

      <p className="text-center text-sm text-[#6d7a75]">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <Link
          href={
            mode === "login"
              ? isSeller
                ? "/sell/register"
                : "/register"
              : isSeller
                ? "/sell/login"
                : "/login"
          }
          className="font-bold text-[#063f34] hover:underline"
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>

      {showSellerLink && (
        <p className="text-center text-sm text-[#6d7a75]">
          Are you an artisan?{" "}
          <Link
            href={mode === "login" ? "/sell/login" : "/sell/register"}
            className="font-bold text-[#9a4d10] hover:underline"
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
  name,
  value,
  onChange,
  icon: Icon,
  error,
  placeholder,
  type = "text",
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  icon: ElementType
  error?: string
  placeholder?: string
  type?: string
}) {
  const inputId = `auth-${name.toLowerCase()}`
  const errorId = `${inputId}-error`

  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black tracking-widest text-[#6d7a75] uppercase">
        {label}
      </span>
      <span className="relative block">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9aada8]"
          size={15}
        />
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-11 w-full rounded-lg border bg-white pr-3 pl-9 text-sm font-medium transition-all outline-none focus:ring-4 ${
            error
              ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/10"
              : "border-[#d8dfdc] focus:border-[#063f34] focus:ring-[#063f34]/8"
          }`}
        />
      </span>
      {error && (
        <span
          id={errorId}
          className="mt-1.5 block text-xs font-semibold text-[#ba1a1a]"
        >
          {error}
        </span>
      )}
    </label>
  )
}

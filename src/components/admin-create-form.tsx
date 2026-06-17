"use client"

import { FormEvent, useState } from "react"
import {
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  UserRound,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { AppUser } from "@/lib/auth"

type FormState = {
  name: string
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormState, string[]>>

const initialForm: FormState = {
  name: "",
  email: "",
  password: "",
}

export default function AdminCreateForm({
  onCreated,
}: {
  onCreated?: (user: AppUser) => void
}) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setMessage("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) setErrors(data.errors)
        throw new Error(data.error ?? "Please review the admin details.")
      }

      toast.success("Admin account created", {
        description: `${data.user.email} can now sign in from /admin.`,
      })
      onCreated?.(data.user)
      setForm(initialForm)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Admin account could not be created."
      )
      toast.error("Admin account was not created", {
        description:
          error instanceof Error
            ? error.message
            : "Review the admin details and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {/* Requirements notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#c6ead9] bg-[#f4fdf8] p-3.5">
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0b5345]" />
        <p className="text-xs leading-relaxed font-semibold text-[#1a5c3a]">
          Only signed-in admins can create another admin account. The new user
          will be able to sign in immediately at{" "}
          <span className="font-black">/admin</span>.
        </p>
      </div>

      <div className="space-y-4">
        <AdminInput
          label="Full name"
          value={form.name}
          error={errors.name?.[0]}
          icon={UserRound}
          placeholder="Admin name"
          onChange={(value) => updateField("name", value)}
        />
        <AdminInput
          label="Email address"
          value={form.email}
          error={errors.email?.[0]}
          icon={Mail}
          type="email"
          placeholder="admin@example.com"
          onChange={(value) => updateField("email", value)}
        />
        <AdminInput
          label="Password"
          value={form.password}
          error={errors.password?.[0]}
          icon={Lock}
          type="password"
          placeholder="At least 8 characters"
          onChange={(value) => updateField("password", value)}
        />
      </div>

      {/* Error message */}
      {message && (
        <Alert
          variant="destructive"
          className="rounded-xl border-[#f0b8b8] bg-[#fff7f7] text-[#7a1d1d]"
        >
          <AlertCircle size={16} />
          <AlertTitle className="font-black">
            Account creation failed
          </AlertTitle>
          <AlertDescription className="font-medium">{message}</AlertDescription>
        </Alert>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#063f34] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#075144] focus:ring-4 focus:ring-[#063f34]/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <UserRound size={15} />
          )}
          {isSubmitting ? "Creating…" : "Create admin account"}
        </button>
      </div>
    </form>
  )
}

function AdminInput({
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
  icon: typeof UserRound
  error?: string
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold tracking-wide text-[#53615c] uppercase">
        {label}
      </span>
      <span className="relative block">
        <Icon
          className="absolute top-1/2 left-3 -translate-y-1/2 text-[#9aada8]"
          size={15}
        />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full rounded-md border bg-white pr-3 pl-9 text-sm font-medium transition-all outline-none placeholder:text-[#bfc9c4] focus:ring-4 ${
            error
              ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/10"
              : "border-[#d8dfdc] focus:border-[#063f34] focus:ring-[#063f34]/8"
          }`}
          placeholder={placeholder}
        />
      </span>
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#ba1a1a]">
          <AlertCircle size={11} />
          {error}
        </span>
      )}
    </label>
  )
}

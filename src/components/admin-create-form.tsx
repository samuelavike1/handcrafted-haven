"use client"

import { FormEvent, useState } from "react"
import { AlertCircle, Loader2, Lock, Mail, UserRound } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function AdminCreateForm() {
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
    <form
      onSubmit={submit}
      className="rounded-lg border border-[#d8dfdc] bg-white p-4"
      noValidate
    >
      <p className="text-xs font-black text-[#9a4d10] uppercase">
        Admin management
      </p>
      <h2 className="mt-2 text-lg font-black text-[#063f34]">
        Create admin account
      </h2>
      <p className="mt-1 text-sm leading-6 text-[#53615c]">
        Only signed-in admins can create another admin account.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <AdminInput
          label="Full name"
          value={form.name}
          error={errors.name?.[0]}
          icon={UserRound}
          placeholder="Admin name"
          onChange={(value) => updateField("name", value)}
        />
        <AdminInput
          label="Email"
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

      {message && (
        <Alert
          variant="destructive"
          className="mt-4 border-[#f0b8b8] bg-[#fff7f7] text-[#7a1d1d]"
        >
          <AlertCircle />
          <AlertTitle>Admin account issue</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[#063f34] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="mr-2 animate-spin" size={16} />}
        Create admin
      </button>
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
      {error && (
        <span className="mt-1 block text-xs font-semibold text-[#ba1a1a]">
          {error}
        </span>
      )}
    </label>
  )
}

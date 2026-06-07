"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Star } from "lucide-react"
import { toast } from "sonner"

type FieldErrors = Partial<
  Record<"author" | "rating" | "title" | "comment", string[]>
>

type ProductReviewFormProps = {
  productId: string
  currentUser?: {
    name: string
    email: string
  } | null
}

const initialForm = {
  author: "",
  rating: 5,
  title: "",
  comment: "",
}

export default function ProductReviewForm({
  productId,
  currentUser,
}: ProductReviewFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    ...initialForm,
    author: currentUser?.name ?? "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fieldIds = useMemo(
    () => ({
      author: `review-author-${productId}`,
      rating: `review-rating-${productId}`,
      title: `review-title-${productId}`,
      comment: `review-comment-${productId}`,
    }),
    [productId]
  )

  const updateField = (name: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setMessage("")
  }

  const errorFor = (name: keyof FieldErrors) => errors[name]?.[0]

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setMessage("")

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          author: currentUser?.name ?? form.author,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
          setMessage("Please fix the highlighted review fields.")
        } else {
          setMessage(data.error ?? "Review could not be submitted.")
        }
        return
      }

      setForm({ ...initialForm, author: currentUser?.name ?? "" })
      toast.success("Review submitted", {
        description: "Your rating now appears on this product.",
      })
      router.refresh()
    } catch {
      setMessage("Review could not be submitted. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={submitReview}
      className="rounded-lg border border-[#d8dfdc] bg-white p-4"
      noValidate
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#063f34]">Write a review</p>
          <p className="mt-1 text-sm text-[#53615c]">
            Share what future collectors should know about this piece.
          </p>
        </div>
        {currentUser && (
          <p className="rounded-md bg-[#edf2ef] px-2.5 py-1 text-xs font-bold text-[#355148]">
            Reviewing as {currentUser.name}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {!currentUser && (
          <div>
            <label
              htmlFor={fieldIds.author}
              className="text-xs font-black text-[#25332e]"
            >
              Your name
            </label>
            <input
              id={fieldIds.author}
              value={form.author}
              onChange={(event) => updateField("author", event.target.value)}
              aria-invalid={Boolean(errorFor("author"))}
              aria-describedby={
                errorFor("author") ? `${fieldIds.author}-error` : undefined
              }
              className={`mt-1 h-10 w-full rounded-md border px-3 text-sm transition outline-none focus:ring-2 focus:ring-[#063f34]/25 ${
                errorFor("author")
                  ? "border-[#b42318] text-[#7a271a]"
                  : "border-[#d8dfdc]"
              }`}
            />
            {errorFor("author") && (
              <p
                id={`${fieldIds.author}-error`}
                className="mt-1 text-xs font-bold text-[#b42318]"
              >
                {errorFor("author")}
              </p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor={fieldIds.rating}
            className="text-xs font-black text-[#25332e]"
          >
            Rating
          </label>
          <div
            className="mt-1 flex gap-1"
            role="radiogroup"
            aria-label="Rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => updateField("rating", star)}
                aria-pressed={form.rating === star}
                aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                className={`flex h-10 w-10 items-center justify-center rounded-md border transition focus:ring-2 focus:ring-[#063f34]/25 focus:outline-none ${
                  form.rating >= star
                    ? "border-[#c8651b] bg-[#fff4e8] text-[#c8651b]"
                    : "border-[#d8dfdc] text-[#8b9692]"
                }`}
              >
                <Star
                  size={18}
                  fill={form.rating >= star ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
          {errorFor("rating") && (
            <p
              id={`${fieldIds.rating}-error`}
              className="mt-1 text-xs font-bold text-[#b42318]"
            >
              {errorFor("rating")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <label
          htmlFor={fieldIds.title}
          className="text-xs font-black text-[#25332e]"
        >
          Review title
        </label>
        <input
          id={fieldIds.title}
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          aria-invalid={Boolean(errorFor("title"))}
          aria-describedby={
            errorFor("title") ? `${fieldIds.title}-error` : undefined
          }
          className={`mt-1 h-10 w-full rounded-md border px-3 text-sm transition outline-none focus:ring-2 focus:ring-[#063f34]/25 ${
            errorFor("title")
              ? "border-[#b42318] text-[#7a271a]"
              : "border-[#d8dfdc]"
          }`}
        />
        {errorFor("title") && (
          <p
            id={`${fieldIds.title}-error`}
            className="mt-1 text-xs font-bold text-[#b42318]"
          >
            {errorFor("title")}
          </p>
        )}
      </div>

      <div className="mt-3">
        <label
          htmlFor={fieldIds.comment}
          className="text-xs font-black text-[#25332e]"
        >
          Written review
        </label>
        <textarea
          id={fieldIds.comment}
          value={form.comment}
          onChange={(event) => updateField("comment", event.target.value)}
          rows={4}
          aria-invalid={Boolean(errorFor("comment"))}
          aria-describedby={
            errorFor("comment") ? `${fieldIds.comment}-error` : undefined
          }
          className={`mt-1 w-full resize-none rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2 focus:ring-[#063f34]/25 ${
            errorFor("comment")
              ? "border-[#b42318] text-[#7a271a]"
              : "border-[#d8dfdc]"
          }`}
        />
        {errorFor("comment") && (
          <p
            id={`${fieldIds.comment}-error`}
            className="mt-1 text-xs font-bold text-[#b42318]"
          >
            {errorFor("comment")}
          </p>
        )}
      </div>

      {message && (
        <p className="mt-3 rounded-md bg-[#fff0f0] px-3 py-2 text-sm font-bold text-[#8b1f1f]">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#063f34] px-4 text-sm font-black text-white transition hover:bg-[#0b5b4a] focus:ring-2 focus:ring-[#063f34]/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        Submit review
      </button>
    </form>
  )
}

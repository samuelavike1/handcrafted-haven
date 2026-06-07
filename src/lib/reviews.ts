import { randomUUID } from "crypto"
import { z } from "zod"

export const reviewInputSchema = z.object({
  author: z.string().trim().min(2, "Your name is required."),
  rating: z.coerce
    .number()
    .int("Choose a whole-star rating.")
    .min(1, "Choose at least 1 star.")
    .max(5, "Choose no more than 5 stars."),
  title: z
    .string()
    .trim()
    .min(4, "Review title must be at least 4 characters."),
  comment: z.string().trim().min(20, "Review must be at least 20 characters."),
})

export type ReviewInput = z.infer<typeof reviewInputSchema>

export type ReviewItem = {
  id: string
  author: string
  rating: number
  title: string
  comment: string
  createdAt: string
}

export function calculateReviewSummary(items: Pick<ReviewItem, "rating">[]) {
  if (!items.length) return { rating: 0, reviews: 0 }

  const total = items.reduce((sum, item) => sum + item.rating, 0)
  return {
    rating: Number((total / items.length).toFixed(1)),
    reviews: items.length,
  }
}

export function calculateUpdatedReviewSummary(
  existing: { rating: number; reviews: number },
  nextRating: number
) {
  const previousReviews = Math.max(0, existing.reviews || 0)
  const previousTotal = (existing.rating || 0) * previousReviews
  const reviews = previousReviews + 1

  return {
    rating: Number(((previousTotal + nextRating) / reviews).toFixed(1)),
    reviews,
  }
}

export function buildReviewItem(
  input: ReviewInput,
  user: { name?: string } | null,
  createdAt = new Date().toISOString()
): ReviewItem {
  return {
    id: `review-${randomUUID().slice(0, 8)}`,
    author: user?.name?.trim() || input.author,
    rating: input.rating,
    title: input.title,
    comment: input.comment,
    createdAt,
  }
}

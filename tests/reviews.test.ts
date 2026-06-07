import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  buildReviewItem,
  calculateUpdatedReviewSummary,
  calculateReviewSummary,
  reviewInputSchema,
} from "../src/lib/reviews.ts"

describe("reviewInputSchema", () => {
  it("requires a guest author name and usable review content", () => {
    const result = reviewInputSchema.safeParse({
      author: "",
      rating: 6,
      title: "Ok",
      comment: "Too short",
    })

    assert.equal(result.success, false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      assert.deepEqual(Object.keys(errors).sort(), [
        "author",
        "comment",
        "rating",
        "title",
      ])
    }
  })
})

describe("calculateReviewSummary", () => {
  it("returns the count and one-decimal average from review items", () => {
    const summary = calculateReviewSummary([
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
    ])

    assert.deepEqual(summary, { rating: 4, reviews: 3 })
  })

  it("rounds averages to one decimal place", () => {
    const summary = calculateReviewSummary([
      { rating: 5 },
      { rating: 4 },
      { rating: 4 },
    ])

    assert.deepEqual(summary, { rating: 4.3, reviews: 3 })
  })
})

describe("calculateUpdatedReviewSummary", () => {
  it("preserves an existing aggregate count when only sample review rows are stored", () => {
    const summary = calculateUpdatedReviewSummary(
      { rating: 4.9, reviews: 124 },
      5
    )

    assert.deepEqual(summary, { rating: 4.9, reviews: 125 })
  })
})

describe("buildReviewItem", () => {
  it("uses the signed-in user name instead of editable guest author text", () => {
    const review = buildReviewItem(
      {
        author: "Edited Guest",
        rating: 5,
        title: "Beautiful piece",
        comment: "The materials and finish are even better in person.",
      },
      { name: "Mina Patel" },
      "2026-06-03T00:00:00.000Z"
    )

    assert.equal(review.author, "Mina Patel")
    assert.equal(review.createdAt, "2026-06-03T00:00:00.000Z")
    assert.match(review.id, /^review-/)
  })
})

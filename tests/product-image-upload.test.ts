import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  getBlobUploadOptions,
  getProductUploadError,
} from "../src/lib/product-image-upload.ts"

describe("getBlobUploadOptions", () => {
  it("uses the configured read-write token explicitly", () => {
    assert.deepEqual(getBlobUploadOptions("blob-token"), {
      access: "public",
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      token: "blob-token",
    })
  })
})

describe("getProductUploadError", () => {
  it("reports missing Blob credentials as a configuration error", () => {
    assert.deepEqual(
      getProductUploadError(
        new Error(
          "Vercel Blob: No blob credentials found. Set BLOB_READ_WRITE_TOKEN."
        )
      ),
      {
        status: 503,
        message:
          "Image storage is not configured for this deployment. Reconnect the Vercel Blob store and redeploy.",
      }
    )
  })

  it("reports Blob access failures without exposing credentials", () => {
    assert.deepEqual(
      getProductUploadError(
        new Error(
          "Vercel Blob: Access denied, please provide a valid token for this resource."
        )
      ),
      {
        status: 503,
        message:
          "Image storage rejected this deployment. Verify the Blob token and use a public Blob store.",
      }
    )
  })
})

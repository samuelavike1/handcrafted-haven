const oneYearInSeconds = 60 * 60 * 24 * 365

export function getBlobUploadOptions(token?: string) {
  return {
    access: "public" as const,
    addRandomSuffix: true,
    cacheControlMaxAge: oneYearInSeconds,
    ...(token ? { token } : {}),
  }
}

export function getProductUploadError(error: unknown) {
  const message = error instanceof Error ? error.message : ""
  const normalized = message.toLowerCase()

  if (
    normalized.includes("no blob credentials") ||
    normalized.includes("no read-write token")
  ) {
    return {
      status: 503,
      message:
        "Image storage is not configured for this deployment. Reconnect the Vercel Blob store and redeploy.",
    }
  }

  if (
    normalized.includes("access denied") ||
    normalized.includes("oidc") ||
    normalized.includes("store does not exist") ||
    normalized.includes("store is private")
  ) {
    return {
      status: 503,
      message:
        "Image storage rejected this deployment. Verify the Blob token and use a public Blob store.",
    }
  }

  if (normalized.includes("store has been suspended")) {
    return {
      status: 503,
      message:
        "Image storage is currently unavailable. Check the Blob store status in Vercel.",
    }
  }

  return {
    status: 500,
    message: "Product image could not be uploaded. Please try again.",
  }
}

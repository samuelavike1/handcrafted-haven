import type { MetadataRoute } from "next"

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://handcrafted-haven.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/sell/dashboard/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

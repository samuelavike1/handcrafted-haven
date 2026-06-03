import type { MetadataRoute } from "next"
import { products } from "@/lib/market-data"
import { routing } from "@/i18n/routing"

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://handcrafted-haven.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/browse", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/stories", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/sell", priority: 0.7, changeFrequency: "monthly" as const },
  ]

  const staticRoutes = routing.locales.flatMap((locale) =>
    staticPages.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  )

  const productRoutes = routing.locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${BASE_URL}/${locale}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  )

  return [...staticRoutes, ...productRoutes]
}

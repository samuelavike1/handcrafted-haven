import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { getLocale } from "next-intl/server"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://handcrafted-haven.vercel.app"
  ),
  title: {
    default: "Handcrafted Haven — Artisan Marketplace",
    template: "%s | Handcrafted Haven",
  },
  description:
    "Discover curated artisan treasures from independent makers worldwide. Shop handcrafted ceramics, textiles, woodwork, and jewelry.",
  keywords:
    "handcrafted, artisan, marketplace, ceramics, pottery, textiles, woodworking, jewelry, sustainable",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Handcrafted Haven",
    title: "Handcrafted Haven — Artisan Marketplace",
    description:
      "Discover curated artisan treasures from independent makers worldwide.",
    images: [
      {
        url: "/hero_artisan_1779021032867.png",
        width: 1200,
        height: 630,
        alt: "Handcrafted artisan at work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Handcrafted Haven — Artisan Marketplace",
    description:
      "Discover curated artisan treasures from independent makers worldwide.",
    images: ["/hero_artisan_1779021032867.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(plusJakarta.variable)}
    >
      <body
        className={cn(
          "bg-hh-canvas text-hh-body antialiased",
          plusJakarta.className
        )}
      >
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

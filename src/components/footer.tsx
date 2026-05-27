import Link from "next/link"
import { Globe2, Leaf, Mail, Share2, ShieldCheck } from "lucide-react"

const columns = {
  Marketplace: ["Browse", "New Arrivals", "Gift Guide", "Artisans"],
  Community: ["Stories", "Sustainability", "Reviews", "Workshops"],
  Support: ["Help Center", "Shipping", "Returns", "Privacy Policy"],
}

interface FooterProps {
  variant?: "default" | "catalog" | "product"
}

export default function Footer({ variant = "default" }: FooterProps) {
  return (
    <footer className="border-t border-hh-border bg-hh-surface">
      {variant === "default" && (
        <div className="mx-auto grid max-w-[1080px] gap-4 border-b border-hh-border px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            {
              icon: Leaf,
              label: "Sustainably sourced",
              text: "Materials and makers are reviewed for responsible practices.",
            },
            {
              icon: ShieldCheck,
              label: "Artisan verified",
              text: "Profiles, workshops, and listings are curated for authenticity.",
            },
            {
              icon: Globe2,
              label: "Community powered",
              text: "Every purchase supports independent craft and local economies.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex gap-3 rounded-lg bg-hh-card/60 p-4"
            >
              <item.icon className="mt-1 shrink-0 text-hh-heading" size={24} />
              <div>
                <p className="font-bold text-hh-heading">{item.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-hh-muted">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto grid max-w-[1080px] gap-4 px-4 py-6 sm:px-6 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link
            href="/"
            className="text-2xl leading-tight font-black text-hh-heading"
          >
            Handcrafted
            <br />
            Haven
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-hh-muted">
            A curated marketplace for soulful objects, transparent maker
            stories, and sustainable consumption.
          </p>
          <div className="mt-5 flex gap-3">
            {[Share2, Mail, Globe2].map((Icon, index) => (
              <button
                key={index}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-hh-border bg-hh-card text-hh-heading transition hover:border-hh-heading"
                aria-label="Social link"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(columns).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-xs font-black text-hh-heading uppercase">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replaceAll(" ", "-")}`}
                      className="text-sm text-hh-muted transition hover:text-hh-heading"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-hh-border">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-3 px-4 py-5 text-sm text-hh-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Handcrafted Haven. Rooted in craftsmanship.</p>
          <p className="flex items-center gap-2">
            <Globe2 size={15} /> English (USD)
          </p>
        </div>
      </div>
    </footer>
  )
}

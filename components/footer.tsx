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
    <footer className="border-t border-[#d8dfdc] bg-[#f0f3ef]">
      {variant === "default" && (
        <div className="mx-auto grid max-w-[1440px] gap-4 border-b border-[#d8dfdc] px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            { icon: Leaf, label: "Sustainably sourced", text: "Materials and makers are reviewed for responsible practices." },
            { icon: ShieldCheck, label: "Artisan verified", text: "Profiles, workshops, and listings are curated for authenticity." },
            { icon: Globe2, label: "Community powered", text: "Every purchase supports independent craft and local economies." },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 rounded-2xl bg-white/60 p-5">
              <item.icon className="mt-1 shrink-0 text-[#063f34]" size={24} />
              <div>
                <p className="font-bold text-[#063f34]">{item.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#53615c]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_2fr] lg:px-12">
        <div>
          <Link href="/" className="text-[28px] font-black leading-tight text-[#063f34]">
            Handcrafted<br />Haven
          </Link>
          <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-[#53615c]">
            A curated marketplace for soulful objects, transparent maker stories, and sustainable consumption.
          </p>
          <div className="mt-7 flex gap-3">
            {[Share2, Mail, Globe2].map((Icon, index) => (
              <button
                key={index}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cfd9d4] bg-white text-[#063f34] transition hover:border-[#063f34]"
                aria-label="Social link"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {Object.entries(columns).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-5 text-sm font-black uppercase tracking-[0.14em] text-[#063f34]">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replaceAll(" ", "-")}`}
                      className="text-[15px] text-[#53615c] transition hover:text-[#063f34]"
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

      <div className="border-t border-[#d8dfdc]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 text-sm text-[#53615c] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2024 Handcrafted Haven. Rooted in craftsmanship.</p>
          <p className="flex items-center gap-2">
            <Globe2 size={15} /> English (USD)
          </p>
        </div>
      </div>
    </footer>
  )
}

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Globe2, Leaf, Mail, Share2, ShieldCheck } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"

interface FooterProps {
  variant?: "default" | "catalog" | "product"
}

export default function Footer({ variant = "default" }: FooterProps) {
  const t = useTranslations("footer")

  const columns = {
    [t("marketplace")]: [
      { label: t("links.browse"), href: "/browse" },
      { label: t("links.cart"), href: "/cart" },
      { label: t("links.checkout"), href: "/checkout" },
      { label: t("links.sell"), href: "/sell" },
    ],
    [t("communitySection")]: [
      { label: t("links.stories"), href: "/stories" },
      { label: t("links.sellerLogin"), href: "/sell/login" },
      { label: t("links.sellerRegistration"), href: "/sell/register" },
    ],
    [t("account")]: [
      { label: t("links.buyerSignIn"), href: "/login" },
      { label: t("links.createAccount"), href: "/register" },
      { label: t("links.myAccount"), href: "/account" },
    ],
  }

  const trustItems = [
    {
      icon: Leaf,
      label: t("sustainably"),
      text: t("sustainablyDesc"),
    },
    {
      icon: ShieldCheck,
      label: t("artisan"),
      text: t("artisanDesc"),
    },
    {
      icon: Globe2,
      label: t("community"),
      text: t("communityDesc"),
    },
  ]

  return (
    <footer className="border-t border-hh-border bg-hh-surface">
      {variant === "default" && (
        <div className="mx-auto grid max-w-[1080px] gap-4 border-b border-hh-border px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {trustItems.map((item) => (
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
            {t("tagline")}
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
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-hh-muted transition hover:text-hh-heading focus:ring-4 focus:ring-[#063f34]/10 focus:outline-none"
                    >
                      {link.label}
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
          <p>{t("copyright")}</p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}

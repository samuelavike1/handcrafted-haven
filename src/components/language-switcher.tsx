"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { Globe2, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const localeNames: Record<string, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  pt: { name: "Português", flag: "🇧🇷" },
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale })
  }

  const current = localeNames[locale]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-8 items-center gap-1.5 rounded-md border border-hh-border bg-hh-card px-2.5 text-xs font-semibold text-hh-heading transition hover:bg-hh-subtle"
          aria-label="Change language"
        >
          <Globe2 size={14} />
          <span className="hidden sm:inline">{current?.name}</span>
          <ChevronDown size={12} className="text-hh-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 border border-hh-border bg-hh-canvas shadow-lg"
      >
        {routing.locales.map((loc) => {
          const info = localeNames[loc]
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => switchLocale(loc)}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>{info.flag}</span>
                <span>{info.name}</span>
              </span>
              {loc === locale && (
                <Check size={14} className="text-[#063f34]" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

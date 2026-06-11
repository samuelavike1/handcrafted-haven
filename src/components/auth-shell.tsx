import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

type AuthShellProps = {
  accent?: "buyer" | "seller"
  background: string
  eyebrow: string
  title: ReactNode
  description: string
  actionHref: string
  actionLabel: string
  formEyebrow: string
  footerNote: string
  trustPoints?: string[]
  children: ReactNode
}

export default function AuthShell({
  accent = "buyer",
  background,
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  formEyebrow,
  footerNote,
  trustPoints = [],
  children,
}: AuthShellProps) {
  const accentColor = accent === "seller" ? "text-[#e28a50]" : "text-[#d4b896]"

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0e0c0a]">
      <div className="absolute inset-0">
        <Image
          src={background}
          alt=""
          fill
          className="object-cover opacity-52"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(14,12,10,0.93)_0%,rgba(14,12,10,0.72)_42%,rgba(14,12,10,0.22)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a]/82 via-transparent to-[#0e0c0a]/20" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 lg:px-12">
        <Link href="/" className="group">
          <span className="text-xs font-black tracking-[0.2em] text-white/88 uppercase transition-colors group-hover:text-white sm:text-sm">
            Handcrafted Haven
          </span>
        </Link>
        <Link
          href={actionHref}
          className="rounded-md border border-white/18 px-3 py-2 text-[11px] font-black tracking-[0.14em] text-white/70 uppercase transition hover:border-white/45 hover:text-white"
        >
          {actionLabel}
        </Link>
      </header>

      <main className="relative z-10 grid min-h-[calc(100vh-72px)] gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:items-center lg:px-12 lg:py-8">
        <section className="max-w-2xl">
          <p className="mb-3 text-[10px] font-black tracking-[0.32em] text-white/45 uppercase">
            {eyebrow}
          </p>
          <h1 className="text-4xl leading-[0.98] font-black text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/62">
            {description}
          </p>
          {trustPoints.length > 0 && (
            <div className="mt-6 grid max-w-xl gap-2 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-lg border border-white/14 bg-white/8 px-3 py-2 text-xs font-bold text-white/72 backdrop-blur"
                >
                  {point}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="w-full">
          <div className="rounded-xl border border-white/18 bg-white/12 p-2.5 shadow-2xl backdrop-blur-xl">
            <div className="rounded-lg bg-white p-5 shadow-sm sm:p-6">
              <p
                className={`mb-5 text-[10px] font-black tracking-[0.28em] uppercase ${accentColor}`}
              >
                {formEyebrow}
              </p>
              {children}
            </div>
          </div>
        </section>
      </main>

      <div className="absolute bottom-5 left-5 z-10 hidden sm:left-8 sm:block lg:left-12">
        <p className="text-[10px] tracking-[0.22em] text-white/28 uppercase">
          {footerNote}
        </p>
      </div>
    </div>
  )
}

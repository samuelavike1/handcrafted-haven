export default function AdminLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <aside className="hidden w-[280px] shrink-0 bg-[#062f28] lg:flex lg:flex-col">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-3.5 w-28 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </div>
        <nav className="space-y-1 p-3 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-xl bg-white/8"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </nav>
      </aside>

      {/* Main skeleton */}
      <div className="flex flex-1 flex-col bg-[#f4f6f5]">
        {/* Topbar */}
        <div className="border-b border-[#d8dfdc] bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-20 animate-pulse rounded bg-[#e8edeb]" />
              <div className="h-5 w-52 animate-pulse rounded bg-[#e8edeb]" />
            </div>
            <div className="hidden h-9 w-[300px] animate-pulse rounded-xl bg-[#e8edeb] md:block" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#d8dfdc] bg-white p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex justify-between">
                  <div className="h-10 w-10 rounded-xl bg-[#f4f6f5]" />
                  <div className="h-5 w-16 rounded-full bg-[#f4f6f5]" />
                </div>
                <div className="mt-4 h-2.5 w-24 rounded bg-[#f4f6f5]" />
                <div className="mt-2 h-7 w-16 rounded bg-[#f4f6f5]" />
                <div className="mt-2 h-3 w-28 rounded bg-[#f4f6f5]" />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="animate-pulse overflow-hidden rounded-2xl border border-[#d8dfdc] bg-white">
            <div className="border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
              <div className="h-2.5 w-24 rounded bg-[#e8edeb]" />
              <div className="mt-2 h-4 w-20 rounded bg-[#e8edeb]" />
            </div>
            <div className="divide-y divide-[#eef1ef]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-6 px-5 py-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-28 rounded bg-[#f4f6f5]" />
                    <div className="h-2.5 w-20 rounded bg-[#f4f6f5]" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-32 rounded bg-[#f4f6f5]" />
                    <div className="h-2.5 w-36 rounded bg-[#f4f6f5]" />
                  </div>
                  <div className="h-3.5 w-16 self-center rounded bg-[#f4f6f5]" />
                  <div className="h-3.5 w-14 self-center rounded bg-[#f4f6f5]" />
                  <div className="h-7 w-32 self-center rounded-lg bg-[#f4f6f5]" />
                  <div className="h-7 w-16 self-center rounded-lg bg-[#f4f6f5]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

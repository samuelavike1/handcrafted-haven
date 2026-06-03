import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function SellerDashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f4f6f5]">
      <Navbar />
      <main className="mx-auto max-w-[1160px] space-y-4 px-4 py-6 sm:px-5 lg:px-6">
        {/* Profile card skeleton */}
        <div className="animate-pulse overflow-hidden rounded-lg border border-[#d8dfdc] bg-white">
          <div className="h-36 bg-[#e8edeb] sm:h-44" />
          <div className="px-5 pt-3 pb-5">
            <div className="flex items-end gap-4">
              <div className="-mt-10 h-20 w-20 shrink-0 rounded-lg border-4 border-white bg-[#e8edeb]" />
              <div className="space-y-2 pb-1">
                <div className="h-5 w-44 rounded bg-[#e8edeb]" />
                <div className="h-3.5 w-64 rounded bg-[#e8edeb]" />
              </div>
            </div>
          </div>
          {/* Tab bar skeleton */}
          <div className="border-t border-[#e8edeb] px-5">
            <div className="flex gap-6 py-3">
              {[80, 64, 72].map((w) => (
                <div
                  key={w}
                  className="h-4 rounded bg-[#e8edeb]"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-lg border border-[#d8dfdc] bg-white"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-1 bg-[#e8edeb]" />
              <div className="space-y-3 p-4">
                <div className="h-9 w-9 rounded-lg bg-[#f4f6f5]" />
                <div className="h-2.5 w-24 rounded bg-[#f4f6f5]" />
                <div className="h-7 w-16 rounded bg-[#f4f6f5]" />
                <div className="h-3 w-28 rounded bg-[#f4f6f5]" />
              </div>
            </div>
          ))}
        </div>

        {/* Two-column panels */}
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-lg border border-[#d8dfdc] bg-white"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="space-y-2 border-b border-[#e8edeb] bg-[#f9faf9] px-5 py-4">
                <div className="h-2.5 w-20 rounded bg-[#e8edeb]" />
                <div className="h-4 w-36 rounded bg-[#e8edeb]" />
              </div>
              <div className="divide-y divide-[#eef1ef]">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-3 px-5 py-3">
                    <div className="h-7 w-7 rounded-lg bg-[#f4f6f5]" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-32 rounded bg-[#f4f6f5]" />
                      <div className="h-2.5 w-20 rounded bg-[#f4f6f5]" />
                    </div>
                    <div className="h-4 w-14 rounded bg-[#f4f6f5]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

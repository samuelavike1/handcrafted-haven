import Navbar from "@/components/navbar"
import { Skeleton } from "@/components/ui/loading"

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />
      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <Skeleton className="h-44 w-full" />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-32 w-full" />
          ))}
        </div>
      </main>
    </div>
  )
}

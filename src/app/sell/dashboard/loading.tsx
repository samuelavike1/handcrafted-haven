import Navbar from "@/components/navbar"
import { Skeleton } from "@/components/ui/loading"

export default function SellerDashboardLoading() {
  return (
    <div className="min-h-screen bg-[#fbfbf8]">
      <Navbar />
      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 lg:px-6">
        <Skeleton className="h-56 w-full" />
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-36 w-full" />
          ))}
        </div>
        <Skeleton className="mt-4 h-80 w-full" />
      </main>
    </div>
  )
}

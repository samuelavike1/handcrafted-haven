import { Loader2 } from "lucide-react"

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#53615c]">
      <Loader2 className="animate-spin text-[#063f34]" size={16} />
      {label}
    </span>
  )
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block animate-pulse rounded-md bg-gradient-to-r from-[#edf2ef] via-white to-[#edf2ef] bg-[length:220%_100%] ${className}`}
    />
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-6 w-20" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-8 w-16" />
          </td>
        </tr>
      ))}
    </>
  )
}

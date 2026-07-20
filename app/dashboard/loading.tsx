// app/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16 mt-2" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 border rounded-lg">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full mt-4" />
        </div>
        <div className="p-6 border rounded-lg">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-4 w-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
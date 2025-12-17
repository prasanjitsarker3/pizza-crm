import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="bg-white dark:bg-background p-3 space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border-0 rounded-lg p-3 bg-gray-50  dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Order Analysis Skeleton */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="w-full h-[350px] rounded-lg" />
      </div>

      {/* Monthly Revenue Analysis Skeleton */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-6 w-56" />
        </div>
        <Skeleton className="w-full h-[350px] rounded-lg" />
      </div>

      {/* Top Products and Collections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Products Skeleton */}
        <div className="bg-white dark:bg-white/5 rounded-lg border">
          <div className="p-3 border-b">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-white/5"
              >
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Collections Skeleton */}
        <div className="bg-white dark:bg-white/5 rounded-lg border">
          <div className="p-3 border-b">
            <Skeleton className="h-5 w-36 mb-2" />
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-white/5"
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="w-2 h-2 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

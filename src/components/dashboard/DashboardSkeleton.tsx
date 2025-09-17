// src/components/dashboard/DashboardSkeleton.tsx
import { Card, CardContent } from '../ui/Card';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-8 bg-[var(--color-border)] rounded-lg w-64 animate-pulse"></div>
          <div className="h-5 bg-[var(--color-border)] rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-[var(--color-border)] rounded-lg w-32 animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-[var(--color-border)] rounded w-24"></div>
                  <div className="h-8 bg-[var(--color-border)] rounded w-16"></div>
                  <div className="h-4 bg-[var(--color-border)] rounded w-20"></div>
                </div>
                <div className="h-12 w-12 bg-[var(--color-border)] rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-[var(--color-border)] rounded w-48"></div>
              <div className="h-64 bg-[var(--color-border)] rounded-lg"></div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2 Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-[var(--color-border)] rounded w-48"></div>
              <div className="h-64 bg-[var(--color-border)] rounded-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Agenda Skeleton */}
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-[var(--color-border)] rounded w-40"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-[var(--color-border)] rounded"></div>
                  <div className="h-4 bg-[var(--color-border)] rounded flex-1"></div>
                  <div className="h-4 bg-[var(--color-border)] rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;

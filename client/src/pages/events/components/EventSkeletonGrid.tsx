import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventSkeletonGrid({ viewMode = "grid", count = 6 }) {
  return (
    <div
      className={
        viewMode === "list"
          ? "space-y-4"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

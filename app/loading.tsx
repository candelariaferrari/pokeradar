import MapLoading from "@/components/map/MapLoading";

export default function Loading() {
  return (
    <div className="flex h-dvh flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-line px-4 lg:h-20 lg:px-6">
        <span className="h-7 w-40 animate-pulse rounded-sm bg-elevated" />
      </div>
      <div className="grid min-h-0 flex-1 gap-4 p-3 lg:grid-cols-[340px_minmax(0,1fr)] lg:p-4">
        <div className="hidden flex-col gap-3 rounded-lg border border-line bg-surface p-5 lg:flex">
          <span className="h-12 animate-pulse rounded-full bg-elevated" />
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="h-15 animate-pulse rounded-md bg-elevated" />
          ))}
        </div>
        <div className="relative overflow-hidden rounded-lg border border-line">
          <MapLoading />
        </div>
      </div>
    </div>
  );
}
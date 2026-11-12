export default function PokemonProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-label="Cargando ficha">
      <div className="grid grid-cols-[minmax(0,1fr)_132px] gap-4">
        <div className="flex flex-col gap-3">
          <span className="h-7 w-20 animate-pulse rounded-full bg-elevated" />
          <span className="h-10 w-3/4 animate-pulse rounded-sm bg-elevated" />
          <div className="flex gap-2">
            <span className="h-8 w-24 animate-pulse rounded-full bg-elevated" />
            <span className="h-8 w-20 animate-pulse rounded-full bg-elevated" />
          </div>
        </div>
        <span className="mt-6 size-33 animate-pulse rounded-full bg-elevated" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="h-3.5 w-full animate-pulse rounded-sm bg-elevated" />
        <span className="h-3.5 w-2/3 animate-pulse rounded-sm bg-elevated" />
      </div>
      <div className="flex flex-col gap-3 border-t border-line pt-6">
        {[90, 80, 70, 85, 75, 60].map((w) => (
          <span key={w} className="h-2 animate-pulse rounded-full bg-elevated" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
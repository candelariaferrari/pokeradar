import { STAT_LABELS, type PokemonDetail } from "@/lib/pokemon/utils";

const MAX_STAT = 180; // el valor que llena la barra entera

export default function StatBars({ stats }: { stats: PokemonDetail["stats"] }) {
  return (
    <div className="grid grid-cols-[76px_minmax(0,1fr)_32px] items-center gap-x-4 gap-y-3">
      {stats.map((stat, i) => {
        const label = STAT_LABELS[stat.name] ?? stat.name;
        const percent = Math.min(100, Math.max(2, (stat.value / MAX_STAT) * 100));

        return (
          <div key={stat.name} className="contents">
            <span className="text-sm text-ink-muted">{label}</span>
            <span
              role="meter"
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={255}
              aria-valuenow={stat.value}
              className="h-2 overflow-hidden rounded-full bg-elevated"
            >
              <span
                className="block h-full origin-left animate-stat-grow rounded-full bg-linear-to-r from-lime to-lime-soft motion-reduce:animate-none"
                style={{ width: `${percent}%`, animationDelay: `${i * 60}ms` }}
              />
            </span>
            <span className="text-right font-mono text-[13px]">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
}
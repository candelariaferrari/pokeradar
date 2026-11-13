import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { toggleSound, useSoundOn } from "@/lib/sound/sound";

export default function SoundToggle() {
  const on = useSoundOn();
  const label = on ? "Silenciar sonidos" : "Activar sonidos";

  return (
    <Tooltip label={label}>
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={on}
        aria-label={label}
        className={`grid size-9 place-items-center rounded-full border transition-colors ${
          on ? "border-lime text-lime" : "border-line bg-elevated text-ink-muted hover:text-ink"
        }`}
      >
        <Icon name={on ? "volume" : "volume-off"} size={16} />
      </button>
    </Tooltip>
  );
}
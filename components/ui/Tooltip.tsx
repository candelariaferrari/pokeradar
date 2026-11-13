import { useEffect, useRef, useState, type ReactNode } from "react";

const POSITIONS = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
};

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: keyof typeof POSITIONS;
  className?: string;
}

/**
 * Tooltip propio: aparece con el mouse (hover), con el teclado (foco)
 * y con un toque en pantallas táctiles (se ve 1,5 s).
 * Es solo visual: el botón de adentro ya tiene su aria-label.
 */
export default function Tooltip({ label, children, side = "bottom", className = "" }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function showBriefly() {
    setOpen(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 1500);
  }

  return (
    <span
      className={`relative inline-flex ${className}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onPointerUp={(e) => e.pointerType === "touch" && showBriefly()}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-30 whitespace-nowrap rounded-md border border-line bg-elevated px-2.5 py-1 text-xs font-medium text-ink shadow-panel transition-opacity duration-150 ${POSITIONS[side]} ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>
    </span>
  );
}
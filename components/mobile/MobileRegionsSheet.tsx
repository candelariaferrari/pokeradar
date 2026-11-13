import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import SidebarContent, { type SidebarContentProps } from "@/components/layout/SidebarContent";

interface MobileRegionsSheetProps extends SidebarContentProps {
  onClose: () => void;
}

export default function MobileRegionsSheet({ onClose, ...contentProps }: MobileRegionsSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Al abrir, el foco va al botón de cerrar; Escape cierra
  useEffect(() => {
    closeRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Fondo oscuro: tocarlo también cierra */}
      <button type="button" aria-label="Cerrar" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-deep/70" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Regiones y equipo"
        className="absolute inset-x-0 bottom-0 top-16 flex animate-sheet-in flex-col gap-4 rounded-t-lg border-t border-line bg-surface p-4 pt-3 shadow-panel"
      >
        <span aria-hidden="true" className="mx-auto h-1 w-10 shrink-0 rounded-full bg-line-strong" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">Explorar</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
          >
            <Icon name="close" />
          </button>
        </div>
        <SidebarContent {...contentProps} />
      </div>
    </div>
  );
}
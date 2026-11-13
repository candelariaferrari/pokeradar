import SidebarContent, { type SidebarContentProps } from "@/components/layout/SidebarContent";

export default function Sidebar(props: SidebarContentProps) {
  return (
    <aside
      aria-label="Exploración"
      className="hidden min-h-0 flex-col gap-4 rounded-lg border border-line bg-surface p-5 lg:flex"
    >
      <SidebarContent {...props} />
    </aside>
  );
}
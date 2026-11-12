const PATHS = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  locate: "M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  close: "M6 6l12 12M18 6L6 18",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  leaf: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7",
  bars: "M5 19v-5M10 19V9M15 19v-7M20 19V5",
  alert: "M12 8v5M12 16.5v.5M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z",
  radar: "M12 12l6-6M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5",
  mountain: "M3 19l6-10 4 6 2-3 6 7z",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  filled?: boolean;
  strokeWidth?: number;
  className?: string;
}

export default function Icon({ name, size = 18, filled = false, strokeWidth = 1.8, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 stroke-current ${filled ? "fill-current" : "fill-none"} ${className}`}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
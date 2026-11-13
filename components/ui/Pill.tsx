import type { HTMLAttributes, ReactNode } from "react";

const VARIANTS = {
  elevated: "border border-line bg-elevated",            
  floating: "border border-line bg-surface shadow-panel",   
  outline: "border-[1.5px] border-lime",                    
};

const SIZES = {
  sm: "h-9 px-3 lg:px-4",
  md: "h-11 px-4",
};

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export default function Pill({ children, variant = "elevated", size = "sm", className = "", ...rest }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full text-sm font-medium ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}


export function RadarDot() {
  return (
    <span aria-hidden="true" className="size-2.5 rounded-full bg-lime shadow-[0_0_0_4px_var(--color-lime-glow)]" />
  );
}
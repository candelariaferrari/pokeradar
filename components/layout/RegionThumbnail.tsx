import type { ReactNode } from "react";
import type { RegionId } from "@/lib/radar/regions";

// Mini-paisajes de 80×52. Cada uno tiene su propia paleta, inspirada en el
// lugar real, en tonos apagados y terrosos para no competir con los colores
// de los tipos Pokémon (que son saturados) ni con el lima del radar.
const SCENES: Record<RegionId, ReactNode> = {
  // Selva Misionera: Cataratas, selva y tierra colorada
  misiones: (
    <>
      <rect width="80" height="52" fill="#1B2A21" />
      <path fill="#2F5A3A" d="M0 30Q6 20 14 26Q20 16 30 24Q38 14 48 22Q58 14 66 24Q74 18 80 26V52H0Z" />
      <rect x="30" y="24" width="20" height="26" fill="#3A3A2C" />
      <path stroke="#CFE7DF" fill="none" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" d="M34 25v23M38 25v25M42 25v23M46 25v21" />
      <ellipse cx="40" cy="48" rx="15" ry="4" fill="#CFE7DF" opacity="0.25" />
      <path fill="#3E7448" d="M0 40Q8 32 16 38Q22 30 30 38V52H0ZM50 38Q58 30 64 37Q72 30 80 38V52H50Z" />
      <path fill="#8A4A32" d="M0 52V48Q20 45 40 49T80 48V52Z" />
    </>
  ),

  // Sierras Cordobesas: lomas doradas y luna sobre el Uritorco
  cordoba: (
    <>
      <rect width="80" height="52" fill="#22231C" />
      <circle cx="62" cy="14" r="5" fill="#E8E3C0" />
      <path fill="#5E5A34" d="M0 52V30Q12 18 24 28T48 24T80 28V52Z" />
      <path fill="#8A7A42" d="M0 52V40Q18 30 36 38T80 36V52Z" />
      <path stroke="#B39E5A" fill="none" strokeWidth="1" opacity="0.6" d="M8 46q6-2 12 0M48 44q6-2 12 0" />
    </>
  ),

  // Urbe Porteña: atardecer, skyline y Obelisco
  "buenos-aires": (
    <>
      <rect width="80" height="52" fill="#2A2838" />
      <path fill="#3E3B52" d="M0 52V34H8V28H16V36H22V24H30V52ZM50 52V26H58V32H66V22H74V30H80V52Z" />
      <g fill="#F2C46B">
        <rect x="24.5" y="28" width="1.5" height="1.5" />
        <rect x="26.5" y="32" width="1.5" height="1.5" />
        <rect x="52" y="30" width="1.5" height="1.5" />
        <rect x="68" y="26" width="1.5" height="1.5" />
        <rect x="71" y="30" width="1.5" height="1.5" />
      </g>
      <path fill="#8C88A6" d="M38.5 14L40 10L41.5 14L42.5 46H37.5Z" />
      <path fill="#55516E" d="M0 52V42H10V38H20V44H28V40H36V52ZM44 52V40H54V36H62V42H72V38H80V52Z" />
    </>
  ),

  // Costa Atlántica: sol cálido sobre el mar y arena
  costa: (
    <>
      <rect width="80" height="52" fill="#1C2A30" />
      <circle cx="40" cy="30" r="9" fill="#E9A46A" />
      <rect y="30" width="80" height="22" fill="#2D5560" />
      <path stroke="#9CC7CF" fill="none" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" d="M8 36q4-2 8 0t8 0M44 38q4-2 8 0t8 0M20 43q4-2 8 0t8 0" />
      <path fill="#B89A6E" d="M0 52V46Q20 42 40 47T80 46V52Z" />
    </>
  ),

  // Andes Mendocinos: Aconcagua nevado, cerros terracota y viñedos
  mendoza: (
    <>
      <rect width="80" height="52" fill="#2A2420" />
      <circle cx="16" cy="14" r="5" fill="#F2C46B" />
      <path fill="#7A4E3A" d="M0 52V36L18 22L30 30L46 10L62 28L72 22L80 28V52Z" />
      <path fill="#E8EFE8" d="M40.5 17L46 10L51.5 16L48 15L46 17L43 15Z" />
      <path fill="#A0694A" d="M0 52V44L12 38L24 44L38 34L52 44L66 38L80 44V52Z" />
      <path stroke="#7FA05A" fill="none" strokeWidth="1.4" strokeLinecap="round" d="M6 49h20M30 49h20M54 49h20" />
    </>
  ),

  // Hielos Patagónicos: picos nevados, frente del glaciar con grietas y lago
  patagonia: (
    <>
      <rect width="80" height="52" fill="#1E2A33" />
      <path fill="#4A5E6E" d="M0 52V30L14 16L24 26L36 8L48 24L58 14L70 26L80 20V52Z" />
      <path fill="#E8EFE8" d="M31 15L36 8L41 15L38 13L36 15L34 13ZM54 19L58 14L62 19L60 18L58 19Z" />
      {/* Frente del glaciar: borde dentado, sin bloques rectos */}
      <path fill="#A9D3DE" d="M4 46L8 38L13 41L18 35L24 40L29 34L35 39L41 33L47 39L53 34L59 40L65 35L71 41L76 37V46Z" />
      <path stroke="#6E9FB0" fill="none" strokeWidth="1" strokeLinecap="round" d="M13 41l2 5M24 40l-1 6M35 39l1 7M47 39l-1 7M59 40l1 6M71 41l-1 5" />
      <rect y="46" width="80" height="6" fill="#2E5A6A" />
    </>
  ),
};

interface RegionThumbnailProps {
  regionId: RegionId;
  className?: string;
}

export default function RegionThumbnail({ regionId, className = "" }: RegionThumbnailProps) {
  return (
    <svg viewBox="0 0 80 52" aria-hidden="true" className={`h-13 w-20 shrink-0 overflow-hidden rounded-sm ${className}`}>
      {SCENES[regionId]}
    </svg>
  );
}
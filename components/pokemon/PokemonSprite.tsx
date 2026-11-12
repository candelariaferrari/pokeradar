import { spriteUrl } from "@/lib/pokemon/utils";

interface PokemonSpriteProps {
  id: number;
  className?: string;
}

export default function PokemonSprite({ id, className = "" }: PokemonSpriteProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={spriteUrl(id)}
      alt=""
      width={96}
      height={96}
      loading="lazy"
      draggable={false}
      className={`max-w-none object-contain [image-rendering:pixelated] ${className}`}
    />
  );
}
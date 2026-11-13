import { animatedSpriteUrl, spriteUrl } from "@/lib/pokemon/utils";

interface PokemonSpriteProps {
  id: number;
  className?: string;
  animated?: boolean;
}

export default function PokemonSprite({ id, className = "", animated = false }: PokemonSpriteProps) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={animated ? animatedSpriteUrl(id) : spriteUrl(id)}
      alt=""
      width={96}
      height={96}
      loading="lazy"
      draggable={false}
      className={`max-w-none object-contain [image-rendering:pixelated] ${className}`}
    />
  );

  if (!animated) return image;

  return (
    <picture className="contents">
      <source srcSet={spriteUrl(id)} media="(prefers-reduced-motion: reduce)" />
      {image}
    </picture>
  );
}
"use client";

import { useRef } from "react";
import { Users } from "lucide-react";
import CharacterCard from "@/components/ui/CharacterCard";
import ScrollButton from "@/components/ui/ScrollButton";
import type { CastMember } from "./types";

interface CastSectionProps {
  cast: CastMember[];
}

export default function CastSection({ cast }: CastSectionProps) {
  const castListRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const amount = direction === "left" ? -80 * 4 : 80 * 4;
    castListRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (cast.length === 0) return null;

  return (
    <div className="mb-12 relative group/list">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-3 text-2xl text-white font-rubik font-normal">
          <Users className="w-6 h-6 text-primary" />
          Karakterler
        </h3>

        <div className="flex items-center gap-2">
          <ScrollButton direction="left" onClick={() => scrollBy("left")} />
          <ScrollButton direction="right" onClick={() => scrollBy("right")} />
        </div>
      </div>

      <div
        ref={castListRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar snap-x scroll-smooth"
      >
        {cast.map((c, index) => (
          <div key={c.id} className="min-w-32 md:min-w-40 snap-center">
            <CharacterCard
              name={c.name}
              character={c.character}
              image={c.profile_path}
              priority={index < 4}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

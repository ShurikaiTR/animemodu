"use client";

import { useRef } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import CharacterCard from "@/components/ui/CharacterCard";
import type { CastMember } from "./types";

interface CastSectionProps {
  cast: CastMember[];
}

export default function CastSection({ cast }: CastSectionProps) {
  const castListRef = useRef<HTMLDivElement>(null);

  if (cast.length === 0) return null;

  return (
    <div className="mb-12 relative group/list">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-3 text-2xl text-white font-rubik font-normal">
          <Users className="w-6 h-6 text-primary" />
          Karakterler
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => castListRef.current?.scrollBy({ left: -80 * 4, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-bg-secondary border border-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all active:scale-95"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => castListRef.current?.scrollBy({ left: 80 * 4, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-bg-secondary border border-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all active:scale-95"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
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

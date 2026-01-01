import Image from "next/image";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { Switch } from "@/shared/components/switch";
import { Label } from "@/shared/components/label";
import { getImageUrl } from "@/shared/lib/tmdb";
import type { EditFormData } from "./types";

interface EditSidebarProps {
  formData: EditFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

export function EditSidebar({ formData, setFormData }: EditSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary/30 border border-white/5 rounded-xl p-4">
        <Label variant="panel" className="block text-xs uppercase mb-3">Poster Önizleme</Label>
        <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center">
          {formData.poster_path ? (
            <Image
              src={getImageUrl(formData.poster_path, "w500")}
              alt="Poster"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <ImageIcon className="w-10 h-10 text-white/10" />
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-5">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-1">
            <Label htmlFor="featured-mode" className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Öne Çıkar
            </Label>
            <p className="text-xs text-text-main/70">Bu içeriği ana sayfadaki büyük "Hero" alanında göster.</p>
          </div>
          <Switch
            id="featured-mode"
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />
        </div>
      </div>
    </div>
  );
}

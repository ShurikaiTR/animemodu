import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EditFormData } from "./types";

interface EditFormFieldsProps {
  formData: EditFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

export function EditFormFields({ formData, setFormData }: EditFormFieldsProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main/80">Başlık (Türkçe)</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main/80">Orijinal Başlık</label>
          <Input
            value={formData.original_title}
            onChange={(e) => setFormData({ ...formData, original_title: e.target.value })}
            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-main/80">URL Yolu (Slug)</label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0 font-mono text-sm"
        />
        <p className="text-xs text-text-main/40">Benzersiz olmalıdır. Boşluk yerine tire (-) kullanın.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-main/80">Özet</label>
        <textarea
          value={formData.overview}
          onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
          rows={5}
          className="w-full rounded-xl bg-bg-secondary/30 border border-white/5 p-3 text-sm text-white focus:bg-bg-secondary/50 focus-visible:ring-0 outline-none resize-none placeholder:text-text-main/30"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main/80">Poster Yolu / URL</label>
          <Input
            value={formData.poster_path}
            onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
            placeholder="/path/to/image.jpg veya https://example.com/image.jpg"
            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0 font-mono text-xs"
          />
          <p className="text-xs text-text-main/40">TMDB yolu (/...) veya direkt resim linki (https://...) yapıştırabilirsiniz.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main/80">Arkaplan (Backdrop) Yolu / URL</label>
          <Input
            value={formData.backdrop_path}
            onChange={(e) => setFormData({ ...formData, backdrop_path: e.target.value })}
            placeholder="/path/to/image.jpg veya https://example.com/image.jpg"
            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0 font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main/80">Fragman (YouTube Video Key)</label>
          <Input
            value={formData.trailer_key}
            onChange={(e) => setFormData({ ...formData, trailer_key: e.target.value })}
            placeholder="dQw4w9WgXcQ"
            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0 font-mono text-xs"
          />
          <p className="text-xs text-text-main/40">YouTube video ID'si (örn: dQw4w9WgXcQ). YouTube URL'sinden son kısım.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main/80">Puan (0-10)</label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.vote_average}
            onChange={(e) => setFormData({ ...formData, vote_average: parseFloat(e.target.value) })}
            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main/80">Yayın Tarihi</label>
          <Input
            type="date"
            value={formData.release_date}
            onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-main/80">Yapı Türü</label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ ...formData, structure_type: "seasonal" })}
            className={`flex-1 border-white/5 hover:bg-white/5 hover:text-white ${formData.structure_type === "seasonal" ? "bg-primary/20 text-primary border-primary/20" : "bg-bg-secondary/30 text-text-main"}`}
          >
            Sezonluk Dizi
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ ...formData, structure_type: "absolute" })}
            className={`flex-1 border-white/5 hover:bg-white/5 hover:text-white ${formData.structure_type === "absolute" ? "bg-primary/20 text-primary border-primary/20" : "bg-bg-secondary/30 text-text-main"}`}
          >
            Mutlak (Tek Sezon/Film)
          </Button>
        </div>
      </div>
    </div>
  );
}

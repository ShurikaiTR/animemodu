import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Textarea } from "@/shared/components/textarea";

import { GenresField } from "./GenresField";
import { MediaFields } from "./MediaFields";
import { MetaFields } from "./MetaFields";
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
          <Label variant="panel">Başlık (Türkçe)</Label>
          <Input
            variant="panel"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="pl-4"
          />
        </div>
        <div className="space-y-2">
          <Label variant="panel">Orijinal Başlık</Label>
          <Input
            variant="panel"
            value={formData.original_title}
            onChange={(e) => setFormData({ ...formData, original_title: e.target.value })}
            className="pl-4"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label variant="panel">URL Yolu (Slug)</Label>
        <Input
          variant="panel"
          mono
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="pl-4"
        />
        <p className="text-xs text-text-main/40 pl-1">Benzersiz olmalıdır. Boşluk yerine tire (-) kullanın.</p>
      </div>

      <div className="space-y-2">
        <Label variant="panel">Özet</Label>
        <Textarea
          variant="panel"
          value={formData.overview}
          onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
          rows={5}
          className="pl-4"
        />
      </div>

      <GenresField
        genres={formData.genres}
        onChange={(genres) => setFormData({ ...formData, genres })}
      />

      <MediaFields formData={formData} setFormData={setFormData} />
      <MetaFields formData={formData} setFormData={setFormData} />
    </div>
  );
}

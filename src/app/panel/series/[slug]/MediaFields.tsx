import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import type { EditFormData } from "./types";

interface MediaFieldsProps {
    formData: EditFormData;
    setFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

export function MediaFields({ formData, setFormData }: MediaFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label variant="panel">Poster Yolu / URL</Label>
                <Input
                    variant="panel"
                    mono
                    value={formData.poster_path}
                    onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
                    placeholder="/path/to/image.jpg veya https://example.com/image.jpg"
                    className="pl-4"
                />
                <p className="text-xs text-text-main/40 pl-1">TMDB yolu (/...) veya direkt resim linki (https://...) yapıştırabilirsiniz.</p>
            </div>
            <div className="space-y-2">
                <Label variant="panel">Arkaplan (Backdrop) Yolu / URL</Label>
                <Input
                    variant="panel"
                    mono
                    value={formData.backdrop_path}
                    onChange={(e) => setFormData({ ...formData, backdrop_path: e.target.value })}
                    placeholder="/path/to/image.jpg veya https://example.com/image.jpg"
                    className="pl-4"
                />
            </div>
            <div className="space-y-2">
                <Label variant="panel">Fragman (YouTube Video Key)</Label>
                <Input
                    variant="panel"
                    mono
                    value={formData.trailer_key}
                    onChange={(e) => setFormData({ ...formData, trailer_key: e.target.value })}
                    placeholder="dQw4w9WgXcQ"
                    className="pl-4"
                />
                <p className="text-xs text-text-main/40 pl-1">YouTube video ID'si (örn: dQw4w9WgXcQ). YouTube URL'sinden son kısım.</p>
            </div>
        </div>
    );
}

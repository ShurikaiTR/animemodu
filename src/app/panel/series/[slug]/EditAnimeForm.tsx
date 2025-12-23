"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { EditSidebar } from "./EditSidebar";
import { EditFormFields } from "./EditFormFields";
import type { EditFormData } from "./types";
import { updateAnime } from "@/actions/anime";
import type { AnimeRow } from "@/types/helpers";

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90 text-white font-bold min-w-36 shadow-lg shadow-primary/20">
            {pending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kaydediliyor...</>) : (<><Save className="w-4 h-4 mr-2" />Değişiklikleri Kaydet</>)}
        </Button>
    );
}

export function EditAnimeForm({ slug }: { slug: string }) {
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(true);
    const [animeId, setAnimeId] = useState<number | null>(null);
    const [formData, setFormData] = useState<EditFormData>({
        title: "",
        original_title: "",
        slug: "",
        overview: "",
        poster_path: "",
        backdrop_path: "",
        vote_average: 0,
        release_date: "",
        structure_type: "seasonal",
        is_featured: false,
        trailer_key: "",
        genres: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("animes")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) {
                toast.error("İçerik bulunamadı veya bir hata oluştu.");
                router.push("/panel/series");
                return;
            }

            if (data) {
                const anime = data as AnimeRow;
                setAnimeId(anime.id);
                setFormData({
                    title: anime.title || "",
                    original_title: anime.original_title || "",
                    slug: anime.slug || "",
                    overview: anime.overview || "",
                    poster_path: anime.poster_path || "",
                    backdrop_path: anime.backdrop_path || "",
                    vote_average: anime.vote_average || 0,
                    release_date: anime.release_date || "",
                    structure_type: anime.structure_type || "seasonal",
                    is_featured: anime.is_featured || false,
                    trailer_key: (anime as AnimeRow).trailer_key || "",
                    genres: anime.genres || [],
                });
            }
            setIsLoading(false);
        };

        fetchData();
    }, [slug, router, supabase]);

    const handleSubmit = async (formDataSubmit: FormData) => {
        if (!animeId) return;
        formDataSubmit.set("id", animeId.toString());
        formDataSubmit.set("title", formData.title);
        formDataSubmit.set("original_title", formData.original_title);
        formDataSubmit.set("slug", formData.slug);
        formDataSubmit.set("overview", formData.overview);
        formDataSubmit.set("poster_path", formData.poster_path);
        formDataSubmit.set("backdrop_path", formData.backdrop_path);
        formDataSubmit.set("vote_average", formData.vote_average.toString());
        formDataSubmit.set("release_date", formData.release_date);
        formDataSubmit.set("structure_type", formData.structure_type);
        formDataSubmit.set("is_featured", formData.is_featured.toString());
        formDataSubmit.set("trailer_key", formData.trailer_key);
        formDataSubmit.set("genres", JSON.stringify(formData.genres));
        const result = await updateAnime(formDataSubmit);
        if (result.success) {
            toast.success("Değişiklikler başarıyla kaydedildi!");
            router.push("/panel/series");
        } else {
            toast.error("Güncelleme başarısız: " + (result.error || "Bilinmeyen hata"));
        }
    };

    if (isLoading) {
        return null;
    }
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/panel/series">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-text-main hover:text-white hover:bg-white/5">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-rubik font-bold text-white mb-2">İçerik Düzenle</h2>
                        <p className="text-text-main/60 text-sm">
                            <span className="text-primary font-medium">{formData.title}</span> içeriğini düzenliyorsunuz.
                        </p>
                    </div>
                </div>
            </div>

            <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <EditSidebar formData={formData} setFormData={setFormData} />
                <EditFormFields formData={formData} setFormData={setFormData} />
                <div className="lg:col-span-2 flex items-center justify-end pt-6 border-t border-white/5">
                    <SaveButton />
                </div>
            </form>
        </div>
    );
}

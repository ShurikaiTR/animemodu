import { EpisodeManager } from "./EpisodeManager";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EpisodesContentProps {
    params: Promise<{ id: string }>;
}

export async function EpisodesContent({ params }: EpisodesContentProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: anime, error } = await supabase
        .from("animes")
        .select("title, slug")
        .eq("id", Number(id))
        .single();

    if (error || !anime) {
        redirect("/panel/catalog");
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href={`/panel/catalog/${id}`}>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-text-main hover:text-white hover:bg-white/5">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-rubik font-bold text-white mb-2">Bölüm Yönetimi</h2>
                        <p className="text-text-main/60 text-sm">
                            <span className="text-primary font-medium">{anime.title}</span> için bölümleri yönet.
                        </p>
                    </div>
                </div>
            </div>

            <EpisodeManager animeId={Number(id)} />
        </div>
    );
}

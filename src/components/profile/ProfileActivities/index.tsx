"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import ActivityItem from "./ActivityItem";

interface Activity {
    id: number;
    type: "watch" | "comment" | "like" | "follow" | "rate";
    user: {
        username: string;
        avatar: string;
    };
    target: {
        title: string;
        image?: string;
        link: string;
    };
    meta?: string;
    timestamp: string;
}

const ACTIVITIES: Activity[] = [
    {
        id: 1,
        type: "watch",
        user: { username: "Shurikai", avatar: "" },
        target: { title: "One Piece", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1974&auto=format&fit=crop", link: "/anime/one-piece" },
        meta: "1089. Bölüm",
        timestamp: "2 saat önce"
    },
    {
        id: 2,
        type: "rate",
        user: { username: "Shurikai", avatar: "" },
        target: { title: "Jujutsu Kaisen", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1974&auto=format&fit=crop", link: "/anime/jujutsu-kaisen" },
        meta: "10/10",
        timestamp: "5 saat önce"
    },
    {
        id: 3,
        type: "comment",
        user: { username: "Shurikai", avatar: "" },
        target: { title: "Attack on Titan", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1974&auto=format&fit=crop", link: "/anime/attack-on-titan" },
        meta: "Final sezonu inanılmazdı!",
        timestamp: "1 gün önce"
    },
    {
        id: 4,
        type: "follow",
        user: { username: "Shurikai", avatar: "" },
        target: { title: "AhmetK", link: "/profil/ahmetk" },
        timestamp: "2 gün önce"
    }
];

export default function ProfileActivities() {
    return (
        <div className="bg-bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-white font-rubik mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                Son Aktiviteler
            </h3>

            <div className="space-y-6">
                {ACTIVITIES.map((activity, index) => (
                    <ActivityItem key={activity.id} activity={activity} index={index} />
                ))}
            </div>

            <Button variant="glass" className="w-full mt-6 group bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border-transparent hover:border-white/10 transition-all font-medium">
                Daha Fazla Göster
                <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
        </div>
    );
}

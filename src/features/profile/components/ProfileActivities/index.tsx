import { ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/button";
import ActivityItem from "./ActivityItem";
import type { Activity } from "@/shared/types/helpers";

interface ProfileActivitiesProps {
    activities: Activity[];
    username: string;
}

export default function ProfileActivities({ activities, username }: ProfileActivitiesProps) {
    if (activities.length === 0) {
        return (
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 h-fit sticky top-24">
                <h3 className="text-xl font-bold text-white font-rubik mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Son Aktiviteler
                </h3>
                <p className="text-text-main/50 text-sm text-center py-8">
                    Henüz aktivite yok
                </p>
            </div>
        );
    }

    return (
        <div className="bg-bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-white font-rubik mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                Son Aktiviteler
            </h3>

            <div className="space-y-6">
                {activities.map((activity, index) => (
                    <ActivityItem
                        key={activity.id}
                        activity={activity}
                        username={username}
                        index={index}
                    />
                ))}
            </div>

            {activities.length >= 20 && (
                <Button
                    variant="glass"
                    className="w-full mt-6 group bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border-transparent hover:border-white/10 transition-all font-medium"
                >
                    Daha Fazla Göster
                    <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
                </Button>
            )}
        </div>
    );
}

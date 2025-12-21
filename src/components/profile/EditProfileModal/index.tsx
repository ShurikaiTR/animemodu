"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { User, Image as ImageIcon, Globe, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GeneralTab from "./GeneralTab";
import ImagesTab from "./ImagesTab";
import SocialsTab from "./SocialsTab";
import TabSidebar from "./TabSidebar";
import ModalActions from "./ModalActions";
import type { ProfileRow } from "@/types/helpers";
import { toast } from "sonner";
import { createOrUpdateProfile } from "@/actions/profile/mutate";

interface EditProfileModalProps {
    user: ProfileRow & {
        email?: string;
        avatar?: string;
        banner?: string;
        location?: string | null;
        age?: string | null;
        bio?: string | null;
        socials?: { twitter?: string; instagram?: string; github?: string; website?: string }
    };
    children: React.ReactNode;
}

const TABS = [
    { id: "general", label: "Genel Bilgiler", icon: User },
    { id: "images", label: "Görseller", icon: ImageIcon },
    { id: "socials", label: "Sosyal Medya", icon: Globe },
];

export default function EditProfileModal({ user, children }: EditProfileModalProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [isPending, startTransition] = useTransition();

    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [bannerPreview, setBannerPreview] = useState(user.banner);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === 'avatar') setAvatarPreview(url);
            if (type === 'banner') setBannerPreview(url);
        }
    };

    const handleSave = async (formData: FormData) => {
        startTransition(async () => {
            const data = {
                username: user.username,
                full_name: formData.get("full_name") as string,
                bio: formData.get("bio") as string,
                location: formData.get("location") as string,
                avatar_url: avatarPreview,
                banner_url: bannerPreview,
                social_media: user.socials,
                age: formData.get("age") as string,
            };

            const result = await createOrUpdateProfile(user.id, data);

            if (result.success) {
                toast.success("Profil başarıyla güncellendi");
                setOpen(false);
            } else {
                toast.error(result.error || "Profil güncellenirken bir hata oluştu");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="bg-[#12141a] border-white/10 p-0 overflow-hidden sm:max-w-[900px] h-[600px] flex gap-0 shadow-2xl rounded-3xl border-none"
            >
                <DialogTitle className="sr-only">Profili Düzenle</DialogTitle>

                <DialogClose asChild>
                    <button className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-colors border border-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </DialogClose>

                <TabSidebar
                    tabs={TABS}
                    activeTab={activeTab}
                    isPending={isPending}
                    onTabChange={setActiveTab}
                />

                <form action={handleSave} className="flex-1 flex flex-col min-w-0 bg-[#12141a]">
                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {activeTab === "general" && <GeneralTab user={user} />}
                                {activeTab === "images" && (
                                    <ImagesTab
                                        user={user}
                                        avatarPreview={avatarPreview || ""}
                                        bannerPreview={bannerPreview || ""}
                                        onAvatarChange={(e) => handleImageUpload(e, 'avatar')}
                                        onBannerChange={(e) => handleImageUpload(e, 'banner')}
                                    />
                                )}
                                {activeTab === "socials" && <SocialsTab user={user} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <ModalActions isPending={isPending} onCancel={() => setOpen(false)} />
                </form>
            </DialogContent>
        </Dialog>
    );
}


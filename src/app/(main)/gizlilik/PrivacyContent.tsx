import * as Icons from "lucide-react";

import { SECTION_PART_1 } from "./PrivacyData";

export interface PolicyData {
    title: string;
    icon: Icons.LucideIcon;
    content: React.ReactNode;
    defaultOpen?: boolean;
}

export const PRIVACY_SECTIONS: PolicyData[] = [
    ...SECTION_PART_1,
    {
        title: "Veri Güvenliği",
        icon: Icons.Shield,
        content: (
            <>
                <p className="mb-6">Verilerinizi korumak için aldığımız önlemler:</p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Şifre Güvenliği:</strong> Tüm şifreler bcrypt ile hashlenir.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>HTTPS:</strong> Tüm bağlantılar şifreli olarak iletilir.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Satır Bazlı Güvenlik:</strong> Her kullanıcı sadece kendi verilerine erişebilir.</div>
                    </li>
                </ul>
            </>
        )
    },
    {
        title: "İçerik Sorumluluğu",
        icon: Icons.AlertTriangle,
        content: (
            <>
                <p className="mb-4">
                    AnimeModu herhangi bir video içeriği <strong>barındırmamaktadır</strong>.
                    Tüm animeler harici kaynaklardan embed edilmektedir.
                </p>
                <p>
                    Telif hakkı sahiplerinin talebi üzerine içerikler kaldırılabilir.
                    DMCA talepleri için iletişim sayfamızı kullanabilirsiniz.
                </p>
            </>
        )
    },
    {
        title: "Haklarınız",
        icon: Icons.Scale,
        content: (
            <>
                <p className="mb-6">Kullanıcı olarak sahip olduğunuz haklar:</p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Hesap Silme:</strong> Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak kaldırılır.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Veri Düzenleme:</strong> Profil bilgilerinizi istediğiniz zaman güncelleyebilirsiniz.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>İçerik Silme:</strong> Yorumlarınızı ve izleme listenizi silebilirsiniz.</div>
                    </li>
                </ul>
            </>
        )
    },
    {
        title: "İletişim",
        icon: Icons.Mail,
        content: (
            <p>
                Gizlilik politikamız hakkında sorularınız veya DMCA talepleri için
                iletişim sayfamızdan bize ulaşabilirsiniz.
            </p>
        )
    }
];

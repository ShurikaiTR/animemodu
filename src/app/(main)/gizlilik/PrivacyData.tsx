import * as Icons from "lucide-react";
import { PolicyData } from "./PrivacyContent";

export const SECTION_PART_1: PolicyData[] = [
    {
        title: "Topladığımız Bilgiler",
        icon: Icons.User,
        defaultOpen: true,
        content: (
            <>
                <p className="mb-6">Kayıt olduğunuzda ve sitemizi kullandığınızda aşağıdaki bilgileri toplarız:</p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Hesap Bilgileri:</strong> Kullanıcı adı ve e-posta adresi. Şifreniz güvenli şekilde hashlenır ve biz dahil kimse göremez.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Profil Bilgileri (Opsiyonel):</strong> Bio, konum, yaş, profil fotoğrafı ve sosyal medya linkleri.</div>
                    </li>
                </ul>
            </>
        )
    },
    {
        title: "Kullanım Verileri",
        icon: Icons.ListChecks,
        content: (
            <>
                <p className="mb-6">Site içi aktiviteleriniz kaydedilir:</p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>İzleme Listesi:</strong> Listeye eklediğiniz animeler, izleme durumu ve puanlarınız.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Favoriler:</strong> Favori olarak işaretlediğiniz animeler.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Yorumlar ve İncelemeler:</strong> Anime ve bölümlere yaptığınız yorumlar.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Aktivite Geçmişi:</strong> Liste güncellemeleri, takip etme gibi aktiviteler.</div>
                    </li>
                </ul>
            </>
        )
    },
    {
        title: "Veri Paylaşımı",
        icon: Icons.Share2,
        content: (
            <>
                <p className="mb-6">Verilerinizi üçüncü taraflara <strong>satmıyoruz</strong>. Ancak:</p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Supabase:</strong> Veritabanı ve kimlik doğrulama hizmeti için kullanılır.</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Google Analytics:</strong> Site trafiğini analiz etmek ve kullanıcı deneyimini iyileştirmek için kullanılır.</div>
                    </li>
                </ul>
            </>
        )
    },
    {
        title: "Çerezler",
        icon: Icons.Cookie,
        content: (
            <>
                <p className="mb-6">Sitemizde minimal düzeyde çerez kullanılır:</p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Oturum Çerezi:</strong> Giriş yapmanızı ve oturumunuzu açık tutmanızı sağlar (zorunlu).</div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <div className="size-1.5 rounded-full bg-primary shrink-0 mt-[0.65rem] shadow-[0_0_8px_rgba(23,54,207,0.6)]" />
                        <div className="text-text-main/80 flex-1"><strong>Analiz Çerezleri:</strong> Google Analytics tarafından site kullanımını anonim olarak takip etmek için kullanılır.</div>
                    </li>
                </ul>
            </>
        )
    }
];

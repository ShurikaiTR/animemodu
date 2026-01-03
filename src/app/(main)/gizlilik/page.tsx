import { Metadata } from "next";
import Container from "@/shared/components/container";
import {
    User,
    ListChecks,
    Share2,
    Cookie,
    Shield,
    Scale,
    Calendar,
    AlertTriangle,
    Mail,
} from "lucide-react";
import PolicySection from "./PolicySection";
import PolicyCTA from "./PolicyCTA";

export const metadata: Metadata = {
    title: "Gizlilik Politikası - AnimeModu",
    description: "AnimeModu veri güvenliği ve gizlilik politikası detayları.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="pb-24">
            <Container>
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tight">
                                Gizlilik Politikası
                            </h1>
                            <p className="text-text-main/50 text-lg md:text-xl max-w-2xl leading-relaxed">
                                AnimeModu&apos;nda veri güvenliğiniz bizim için önemlidir.
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 whitespace-nowrap">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-primary text-sm font-semibold">
                                Son Güncelleme: 2 Ocak 2026
                            </span>
                        </div>
                    </div>

                    {/* Intro */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                        <p className="text-text-main/80 text-lg leading-relaxed">
                            Bu Gizlilik Politikası, AnimeModu hizmetlerini kullandığınızda bilgilerinizin
                            nasıl toplandığını, kullanıldığını ve korunduğunu açıklar. Sitemizi kullanarak
                            bu politikayı kabul etmiş sayılırsınız.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        <PolicySection title="Topladığımız Bilgiler" icon={User} defaultOpen>
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
                        </PolicySection>

                        <PolicySection title="Kullanım Verileri" icon={ListChecks}>
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
                        </PolicySection>

                        <PolicySection title="Veri Paylaşımı" icon={Share2}>
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
                        </PolicySection>

                        <PolicySection title="Çerezler" icon={Cookie}>
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
                        </PolicySection>

                        <PolicySection title="Veri Güvenliği" icon={Shield}>
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
                        </PolicySection>

                        <PolicySection title="İçerik Sorumluluğu" icon={AlertTriangle}>
                            <p className="mb-4">
                                AnimeModu herhangi bir video içeriği <strong>barındırmamaktadır</strong>.
                                Tüm animeler harici kaynaklardan embed edilmektedir.
                            </p>
                            <p>
                                Telif hakkı sahiplerinin talebi üzerine içerikler kaldırılabilir.
                                DMCA talepleri için iletişim sayfamızı kullanabilirsiniz.
                            </p>
                        </PolicySection>

                        <PolicySection title="Haklarınız" icon={Scale}>
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
                        </PolicySection>

                        <PolicySection title="İletişim" icon={Mail}>
                            <p>
                                Gizlilik politikamız hakkında sorularınız veya DMCA talepleri için
                                iletişim sayfamızdan bize ulaşabilirsiniz.
                            </p>
                        </PolicySection>
                    </div>

                    {/* CTA */}
                    <PolicyCTA />
                </div>
            </Container>
        </div>
    );
}

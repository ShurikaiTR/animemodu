import { Calendar } from "lucide-react";
import { Metadata } from "next";

import Container from "@/shared/components/container";

import PolicyCTA from "./PolicyCTA";
import PolicySection from "./PolicySection";
import { PRIVACY_SECTIONS } from "./PrivacyContent";

export const metadata: Metadata = {
    title: "Gizlilik Politikası · AnimeModu",
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
                        {PRIVACY_SECTIONS.map((section) => (
                            <PolicySection
                                key={section.title}
                                title={section.title}
                                icon={section.icon}
                                defaultOpen={section.defaultOpen}
                            >
                                {section.content}
                            </PolicySection>
                        ))}
                    </div>

                    {/* CTA */}
                    <PolicyCTA />
                </div>
            </Container>
        </div>
    );
}

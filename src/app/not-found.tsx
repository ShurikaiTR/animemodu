import Link from "next/link";
import Image from "next/image";
import { Home, Wand2, Skull, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-bg-main overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-bg-main" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bg-secondary via-bg-main to-black opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_70%,transparent_100%)]" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-start">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 animate-in fade-in zoom-in duration-1000 slide-in-from-right-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/20 rounded-full blur-3xl animate-pulse" />
              <Image
                src="/img/404-wizard.svg"
                alt="Failed Spell Wizard"
                fill
                sizes="(max-width: 640px) 288px, 384px"
                className="object-contain drop-shadow-[var(--shadow-primary-glow)] hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute -left-4 top-20 bg-black/40 backdrop-blur-md border border-primary/30 p-4 rounded-xl animate-bounce shadow-lg hidden sm:block">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs text-primary font-mono">GRIMOIRE UYARISI</span>
                </div>
                <p className="text-white font-bold text-sm">SAYFA KÜL OLDU</p>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
            <div className="relative inline-block">
              <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-rubik leading-none select-none">
                404
              </h1>
              <div className="absolute -top-1 -left-1 w-full h-full text-8xl sm:text-9xl font-black text-white/10 font-rubik leading-none select-none animate-pulse blur-sm">
                404
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-rubik leading-tight">
                Büyü Ters Tepti!
              </h2>
              <p className="text-text-main text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Sanırım ışınlanma büyüsünü yanlış telaffuz ettin. &quot;Ana Sayfa&quot; yerine &quot;Hiçlik&quot; dedin ve kendini veritabanının karanlık tarafında buldun. Bir dahaki sefere büyü kitabını daha dikkatli oku!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/">
                  <span className="mr-2 relative z-10">Güvenli Bölgeye Işınlan</span>
                  <Home className="w-5 h-5 relative z-10" />
                </Link>
              </Button>

              <BackButton />
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-mono text-text-main/60">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary animate-pulse" />
                <span>MANA: TÜKENDİ</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>BÜYÜ: HATALI</span>
              </div>
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-500" />
                <span>KONUM: ARAF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










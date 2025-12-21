export type AuthState = "login" | "register" | "forgot-password";

export const AUTH_CONFIG = {
    login: {
        title: "Tekrar Hoşgeldin!",
        desc: "Sınırsız anime dünyasına giriş yap.",
        image: "/img/auth/gojo.png",
        imageAlt: "Gojo Satoru",
        accent: "from-primary to-purple-600",
        btnColor: "bg-primary hover:bg-primary/90",
        shadowClass: "shadow-[0_0_20px_rgba(47,128,237,0.3)] hover:shadow-[0_0_40px_rgba(47,128,237,0.6)]",
        ringClass: "focus-visible:ring-primary/50",
    },
    register: {
        title: "Aramıza Katıl!",
        desc: "Kendi anime listeni oluştur ve maceraya başla.",
        image: "/img/auth/luffy.png",
        imageAlt: "Monkey D. Luffy",
        accent: "from-accent-orange to-red-500",
        btnColor: "bg-accent-orange hover:bg-accent-orange/90",
        shadowClass: "shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.6)]",
        ringClass: "focus-visible:ring-accent-orange/50",
    },
    "forgot-password": {
        title: "Yolunu mu Kaybettin?",
        desc: "Endişelenme, hesabını kurtarmana yardım edeceğiz.",
        image: "/img/auth/zoro.png",
        imageAlt: "Roronoa Zoro",
        accent: "from-accent-green to-emerald-700",
        btnColor: "bg-accent-green hover:bg-accent-green/90",
        shadowClass: "shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_40px_rgba(22,163,74,0.6)]",
        ringClass: "focus-visible:ring-accent-green/50",
    }
} as const;


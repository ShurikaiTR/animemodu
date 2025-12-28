import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { AuthModalProvider } from "@/shared/contexts/AuthModalContext";
import { Toaster } from "@/shared/components/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
});

import { getSiteInfo } from "@/features/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo();
    const description = "Türkiye'nin en büyük anime izleme platformu. HD kalitede binlerce anime serisi ve filmi. Türkçe altyazılı anime arşivi.";

    return {
      title: {
        default: siteInfo.site_name,
        template: `%s | ${siteInfo.site_name}`,
      },
      description,
      icons: {
        icon: siteInfo.site_favicon,
      },
      openGraph: {
        title: siteInfo.site_name,
        description,
        type: "website",
        locale: "tr_TR",
        siteName: siteInfo.site_name,
      },
      twitter: {
        card: "summary_large_image",
        title: siteInfo.site_name,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: "AnimeModu",
      description: "Türkiye'nin en büyük anime izleme platformu.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${rubik.variable} antialiased bg-bg-main text-text-main font-inter`}
      >
        <AuthProvider>
          <AuthModalProvider>
            {children}
          </AuthModalProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

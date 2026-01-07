import { ReactNode, Suspense } from "react";

import Footer from "@/shared/components/layout/Footer";
import Header from "@/shared/components/layout/Header";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <Header />
            <main className="grow min-h-screen pt-28">
                {children}
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    );
}

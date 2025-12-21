import { ReactNode, Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <Header />
            <main className="flex-grow min-h-screen">
                {children}
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    );
}

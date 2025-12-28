import { ReactNode, Suspense } from "react";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <Header />
            <main className="grow min-h-screen pt-36">
                {children}
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";
import AuthModal from "@/components/auth/AuthModal";
import Container from "@/components/ui/container";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenuButton from "./MobileMenuButton";
import SearchForm from "./SearchForm";
import UserActions from "./UserActions";

interface HeaderProps {
    siteLogo: string;
    siteName: string;
}

export default function Header({ siteLogo, siteName }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { user, isLoading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/arsiv?ara=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setIsSearchOpen(false);
    };

    return (
        <>
            <header
                className={cn(
                    "fixed left-0 w-full z-50 transition-all duration-500",
                    (isScrolled || isMobileMenuOpen) ? "bg-bg-main/95 backdrop-blur-sm border-b border-bg-secondary" : "bg-transparent border-b border-transparent",
                    "xl:top-0"
                )}
                style={{
                    top: isMobileMenuOpen ? '250px' : '0px'
                }}
            >
                <Container>
                    <div className="relative overflow-hidden xl:overflow-visible">
                        <div className="flex flex-row justify-between items-center h-20 lg:h-24 relative">
                            <MobileMenuButton
                                isOpen={isMobileMenuOpen}
                                setIsOpen={setIsMobileMenuOpen}
                            />

                            <Link href="/" className="relative block w-32 md:w-48 h-10 md:h-12 ml-4 mr-auto xl:ml-0 xl:mr-0">
                                <Image
                                    src={siteLogo}
                                    alt={siteName}
                                    fill
                                    className="object-contain"
                                    loading="eager"
                                    priority
                                />
                            </Link>

                            <div className="hidden xl:block">
                                <Navigation isMobileMenuOpen={false} />
                            </div>

                            <div className="flex items-center justify-end gap-4 lg:gap-8 xl:gap-11">
                                <SearchForm
                                    isOpen={isSearchOpen}
                                    setIsOpen={setIsSearchOpen}
                                    query={searchQuery}
                                    setQuery={setSearchQuery}
                                    onSubmit={handleSearchSubmit}
                                />

                                <UserActions
                                    user={user}
                                    isLoading={isLoading}
                                    signOut={signOut}
                                    onLoginClick={() => setIsAuthOpen(true)}
                                />
                            </div>
                        </div>
                    </div>
                </Container>

                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            </header>
            <div className="xl:hidden">
                <Navigation isMobileMenuOpen={isMobileMenuOpen} />
            </div>
        </>
    );
}

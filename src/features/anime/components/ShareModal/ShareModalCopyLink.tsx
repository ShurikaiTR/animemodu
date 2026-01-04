"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/shared/components/button";

interface ShareModalCopyLinkProps {
    shareUrl: string;
}

export default function ShareModalCopyLink({ shareUrl }: ShareModalCopyLinkProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold text-white/40 uppercase">
                Link Kopyala
            </label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl p-2">
                <input
                    className="flex-1 bg-transparent border-none text-sm text-white/70 focus:outline-none truncate px-2 selection:bg-primary/30"
                    readOnly
                    type="text"
                    value={shareUrl}
                />
                <Button
                    onClick={handleCopy}
                    className="bg-primary hover:bg-primary-hover text-white rounded-xl h-9 px-4 font-bold transition-all"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Kopyalandı!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 mr-2" />
                            Kopyala
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

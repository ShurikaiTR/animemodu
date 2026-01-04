import { Calendar, Star } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";

import type { EditFormData } from "./types";

interface MetaFieldsProps {
    formData: EditFormData;
    setFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

export function MetaFields({ formData, setFormData }: MetaFieldsProps) {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateIconClick = () => {
        if (dateInputRef.current) {
            try {
                if ('showPicker' in HTMLInputElement.prototype) {
                    dateInputRef.current.showPicker();
                } else {
                    dateInputRef.current.focus();
                }
            } catch {
                dateInputRef.current.focus();
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
                <Label variant="panel">Puan (0-10)</Label>
                <div className="relative group">
                    <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-text-main/30">
                        <Star className="w-5 h-5" />
                    </div>
                    <Input
                        variant="panel"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.vote_average}
                        onChange={(e) => setFormData({ ...formData, vote_average: parseFloat(e.target.value) })}
                    />
                </div>
            </div>
            <div className="space-y-2.5">
                <Label variant="panel">Yayın Tarihi</Label>
                <div className="relative group">
                    <div
                        onClick={handleDateIconClick}
                        className="absolute left-3.5 inset-y-0 flex items-center cursor-pointer z-10 transition-colors group-focus-within:text-primary text-text-main/30 hover:text-primary"
                    >
                        <Calendar className="w-5 h-5 transition-transform group-hover:scale-110 active:scale-95" />
                    </div>
                    <Input
                        ref={dateInputRef}
                        variant="panel"
                        type="date"
                        value={formData.release_date}
                        onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                        onFocus={(e) => {
                            try {
                                if ('showPicker' in HTMLInputElement.prototype) {
                                    e.target.showPicker();
                                }
                            } catch {
                                // Fallback if showPicker fails
                            }
                        }}
                        className="[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}

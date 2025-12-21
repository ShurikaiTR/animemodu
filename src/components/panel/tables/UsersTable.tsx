"use client";

import { User } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/actions/user";
import { DeleteConfirmationModal } from "./UsersTable/DeleteConfirmationModal";
import { UserTableRow } from "./UsersTable/UserTableRow";
import type { UserItem } from "./UsersTable/types";

interface UsersTableProps {
    items: UserItem[];
}

export function UsersTable({ items }: UsersTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleDelete = async () => {
        if (!deleteId) return;

        startTransition(async () => {
            const result = await deleteUser(deleteId);
            if (!result.success) {
                toast.error("Kullanıcı silinirken bir hata oluştu: " + result.error);
            } else {
                if (result.deletedSelf && user?.id === deleteId) {
                    toast.success("Hesabınız silindi. Çıkış yapılıyor...");
                    await signOut();
                    router.push("/");
                } else {
                    toast.success("Kullanıcı başarıyla silindi.");
                }
                setDeleteId(null);
            }
        });
    };

    return (
        <>
            <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="flex items-center gap-3 text-white text-lg font-bold font-rubik">
                        <User className="w-5 h-5 text-primary" /> Kullanıcılar
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Kullanıcı</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Rol</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Kayıt Tarihi</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr className="border-b border-white/5 hover:bg-transparent">
                                    <td colSpan={4} className="p-4 align-middle h-24 text-center text-white/50">
                                        Henüz hiç kullanıcı yok.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <UserTableRow key={item.id} item={item} onDelete={setDeleteId} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                isPending={isPending}
                username={items.find(item => item.id === deleteId)?.username || null}
            />
        </>
    );
}

export type { UserItem } from "./UsersTable/types";

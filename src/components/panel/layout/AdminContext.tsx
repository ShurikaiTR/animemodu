"use client";

import React, { createContext, useState, useCallback } from "react";
import { createContextHook } from "@/lib/context/utils";

interface AdminContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    return (
        <AdminContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = createContextHook(AdminContext, "useAdmin", "AdminProvider");

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type MenuItem = {
  title: string;
  icon?: LucideIcon;
  href?: string;
  items?: { title: string; href: string; icon?: LucideIcon }[];
  isHeader?: boolean;
};

interface SidebarMenuProps {
  items: MenuItem[];
  expandedMenu: string | null;
  setExpandedMenu: (title: string | null) => void;
}

export function SidebarMenu({ items, expandedMenu, setExpandedMenu }: SidebarMenuProps) {
  const pathname = usePathname();

  const toggleMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item, idx) => {
        if (item.isHeader) {
          return (
            <li key={idx} className="px-6 pt-8 pb-3">
              <span className="text-[10px] font-bold text-text-main/40 uppercase tracking-[0.2em] font-rubik">
                {item.title}
              </span>
            </li>
          );
        }

        const hasSubmenu = item.items && item.items.length > 0;
        const isActive = item.href === pathname || item.items?.some((sub) => sub.href === pathname);
        const isExpanded = expandedMenu === item.title;

        return (
          <li key={idx} className="relative px-3">
            {hasSubmenu ? (
              <div className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "flex items-center justify-between w-full p-3 font-rubik text-sm font-semibold rounded-xl transition-all duration-300",
                    isExpanded
                      ? "text-white bg-white/5"
                      : "text-text-main hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon
                      className={cn("w-5 h-5 transition-colors", isActive || isExpanded ? "text-primary" : "text-text-main/50")}
                    />}
                    <span>{item.title}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="flex flex-col gap-1 border-l border-white/5 ml-5 pl-4 py-1">
                    {item.items!.map((subItem, subIdx) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subIdx}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 relative py-2 px-3 overflow-hidden font-rubik text-sm transition-all rounded-lg group",
                            isSubActive
                              ? "font-semibold text-primary bg-primary/10"
                              : "text-text-main/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {isSubActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
                          )}
                          {subItem.icon && <subItem.icon className={cn("w-4 h-4 transition-opacity", isSubActive ? "opacity-100" : "opacity-40 group-hover:opacity-70")} />}
                          <span className="font-medium">{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 relative p-3 overflow-hidden font-rubik text-sm font-semibold transition-all duration-300 rounded-xl group",
                  isActive
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-text-main hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary shadow-[0_0_8px_rgba(47,128,237,0.5)]" />
                )}
                {item.icon && <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-text-main/50 group-hover:text-text-main")} />}
                <span>{item.title}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}













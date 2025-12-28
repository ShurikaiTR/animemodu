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
    <ul className="flex flex-col gap-2">
      {items.map((item, idx) => {
        if (item.isHeader) {
          return (
            <li key={idx} className="px-8 pt-6 pb-2">
              <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider">
                {item.title}
              </span>
            </li>
          );
        }

        const hasSubmenu = item.items && item.items.length > 0;
        const isActive = item.href === pathname || item.items?.some((sub) => sub.href === pathname);
        const isExpanded = expandedMenu === item.title;

        return (
          <li key={idx} className="relative px-4">
            {hasSubmenu ? (
              <div className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "flex items-center justify-between w-full p-4 rounded-xl text-base font-rubik transition-all duration-300",
                    isActive || isExpanded
                      ? "bg-bg-secondary/50 text-white"
                      : "text-text-main hover:bg-bg-secondary/30 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {item.icon && <item.icon
                      className={cn("w-5 h-5", isActive || isExpanded ? "text-primary" : "text-text-main")}
                    />}
                    <span>{item.title}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out pl-4",
                    isExpanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="flex flex-col gap-1 border-l-2 border-white/5 pl-4 ml-4">
                    {item.items!.map((subItem, subIdx) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subIdx}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors",
                            isSubActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-text-main hover:text-white hover:bg-white/5"
                          )}
                        >
                          {subItem.icon && <subItem.icon className="w-4 h-4 opacity-70" />}
                          {subItem.title}
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
                  "flex items-center gap-4 p-4 rounded-xl text-base font-rubik transition-all duration-300",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-text-main hover:bg-bg-secondary/30 hover:text-white"
                )}
              >
                {item.icon && <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-text-main")} />}
                <span>{item.title}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}













/**
 * @module components/dashboard/PortalSidebar
 * @description Sidebar terkelompok Cream Mocha yang dapat dilipat dengan logo Denvora asli dan kartu peran bersih.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, LogOut } from "lucide-react";
import type { PortalNavItem } from "@/components/dashboard/PortalShell";

interface PortalSidebarProps {
  portalLabel: string;
  portalSubtitle: string;
  navItems: PortalNavItem[];
  activeTab: string;
  collapsed: boolean;
  loggingOut: boolean;
  onSelectTab: (tabId: string) => void;
  onLogout: () => void;
}

export function PortalNavList({
  navItems,
  activeTab,
  mini,
  onSelect,
}: {
  navItems: PortalNavItem[];
  activeTab: string;
  mini: boolean;
  onSelect: (tabId: string) => void;
}) {
  return (
    <nav className="space-y-1" aria-label="Menu portal perpustakaan">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        const showGroup = !mini && Boolean(item.group) && (idx === 0 || navItems[idx - 1]?.group !== item.group);

        return (
          <div key={item.id}>
            {showGroup && (
              <p className="px-3 pt-3.5 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C2B09E]/65">
                {item.group}
              </p>
            )}
            <button
              type="button"
              title={item.label}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center rounded-xl py-2.5 text-[13px] font-medium transition-all cursor-pointer ${
                mini ? "justify-center px-2" : "gap-3 px-3.5"
              } ${
                active
                  ? "bg-(--accent-primary) text-[#F6EFE6] shadow-sm"
                  : "text-[#E9DCCB]/85 hover:bg-[#3A281C] hover:text-[#F6EFE6]"
              }`}
            >
              <Icon size={17} strokeWidth={1.85} className="shrink-0" />
              {!mini && <span className="truncate">{item.label}</span>}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

export function PortalSidebar({
  portalLabel,
  portalSubtitle,
  navItems,
  activeTab,
  collapsed,
  loggingOut,
  onSelectTab,
  onLogout,
}: PortalSidebarProps) {
  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:justify-between lg:shrink-0 bg-[#2B1D14] dark:bg-[#140D09] text-[#F6EFE6] border-r border-[#4A3528] transition-[width] duration-300 ease-out sticky top-0 h-screen ${
        collapsed ? "lg:w-[78px] px-2.5 py-4" : "lg:w-[256px] p-4"
      }`}
    >
      <div className="flex flex-col min-h-0 overflow-y-auto">
        <div className="flex justify-center">
          <Link
            href="/"
            title="Denvora Lexora — Beranda"
            className={`flex items-center justify-center overflow-hidden rounded-full bg-[#FBF7F1] shadow-xs transition-all ${
              collapsed ? "h-11 w-11 p-1.5" : "h-11 px-4 w-full max-w-[200px]"
            }`}
          >
            {collapsed ? (
              <Image
                src="/splash/logo-mark.png"
                alt="Logo Denvora Lexora"
                width={40}
                height={40}
                className="h-7 w-7 object-contain"
              />
            ) : (
              <Image
                src="/images/denvora-lexora-logo.png"
                alt="Denvora Lexora"
                width={240}
                height={160}
                className="h-[64px] w-auto object-contain"
              />
            )}
          </Link>
        </div>

        {!collapsed && (
          <div className="mt-4 mb-1 rounded-2xl bg-[#3A281C]/75 border border-[#4A3528] px-3.5 py-2.5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C87E4F] leading-snug">
              {portalLabel}
            </p>
            <p className="mt-1 text-[11px] text-[#C2B09E] truncate">{portalSubtitle}</p>
          </div>
        )}

        <div className="mt-3">
          <PortalNavList
            navItems={navItems}
            activeTab={activeTab}
            mini={collapsed}
            onSelect={onSelectTab}
          />
        </div>
      </div>

      <div className="space-y-1 border-t border-[#4A3528] pt-3">
        <Link
          href="/"
          title="Beranda Publik"
          className={`w-full flex items-center rounded-xl py-2 text-xs font-medium text-[#E9DCCB] hover:bg-[#3A281C] ${
            collapsed ? "justify-center px-2" : "gap-2.5 px-3.5"
          }`}
        >
          <Globe size={15} className="shrink-0" />
          {!collapsed && <span>Beranda Publik</span>}
        </Link>
        <button
          type="button"
          disabled={loggingOut}
          onClick={onLogout}
          title="Keluar Akun"
          className={`w-full flex items-center rounded-xl py-2 text-xs font-semibold text-[#FAD5D1] hover:bg-[#9E3B33]/30 cursor-pointer disabled:opacity-60 ${
            collapsed ? "justify-center px-2" : "gap-2.5 px-3.5"
          }`}
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && <span>{loggingOut ? "Keluar..." : "Keluar Akun"}</span>}
        </button>
      </div>
    </aside>
  );
}

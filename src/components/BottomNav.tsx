"use client";

import { Sparkles, BookMarked, Clock, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "发现", icon: Sparkles },
  { href: "/shelf", label: "书架", icon: BookMarked },
  { href: "/history", label: "历史", icon: Clock },
  { href: "/settings", label: "设置", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="btm-nav btm-nav-sm bg-base-200 border-t border-base-300 z-50">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={active ? "active text-primary" : "text-base-content/60"}
          >
            <Icon size={20} />
            <span className="btm-nav-label text-xs">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

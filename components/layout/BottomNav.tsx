"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, CheckSquare, BarChart2 } from "lucide-react";

const tabs = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/goals", icon: Target, label: "Goals" },
  { href: "/habits", icon: CheckSquare, label: "Habits" },
  { href: "/progress", icon: BarChart2, label: "Progress" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                active
                  ? "text-accent"
                  : "text-muted hover:text-white/70"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? "drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]" : ""}
              />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

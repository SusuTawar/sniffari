"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/swipe", label: "Swipe", icon: "🐾" },
  { href: "/chats", label: "Chats", icon: "💬" },
  { href: "/profile", label: "Profile", icon: "🐕" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/swipe") return pathname === "/swipe";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-muted/20 bg-white sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="hidden sm:flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

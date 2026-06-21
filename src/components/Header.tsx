"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KakaoImpactLogo from "./KakaoImpactLogo";
import TechForImpactLogo from "./TechForImpactLogo";

// 카카오임팩트 GNB 구조: 워드마크 + 중앙 메뉴 + Family site / 언어 액션.
const NAV: { label: string; href: string }[] = [
  { label: "PROJECTS", href: "/" },
  { label: "STORIES", href: "/stories" },
  { label: "GALLERY", href: "/gallery" },
];

// 현재 경로가 해당 메뉴의 활성 상태인지
function isActive(href: string, pathname: string): boolean {
  if (href === "#") return false;
  if (href === "/") return pathname === "/" || pathname.startsWith("/projects");
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#eee]"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(160%) blur(12px)",
        WebkitBackdropFilter: "saturate(160%) blur(12px)",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-8 text-[#1C1C1C]">
        {/* 좌: 테크포임팩트 캠퍼스 워드마크 (홈) */}
        <Link href="/" aria-label="테크포임팩트 캠퍼스" className="text-[#1C1C1C]">
          <TechForImpactLogo height={13} />
        </Link>

        {/* 중앙: 메뉴 */}
        <nav className="flex gap-11 max-md:hidden">
          {NAV.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative py-1.5 text-[15px] font-bold tracking-[0.04em] transition-opacity after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-[#1C1C1C] after:transition-transform after:duration-300 after:ease-out after:content-[''] ${
                  active
                    ? "opacity-100 after:scale-x-100"
                    : "opacity-55 hover:opacity-100 after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 우: 카카오임팩트 워드마크 */}
        <a
          href="https://www.kakaoimpact.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오임팩트"
          className="text-[#1C1C1C] max-md:hidden"
        >
          <KakaoImpactLogo height={18} />
        </a>

        {/* 모바일: 햄버거 */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="메뉴"
          aria-expanded={open}
          className="hidden text-[#1C1C1C] md:hidden max-md:flex"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 패널 */}
      {open && (
        <nav className="border-t border-[#eee] bg-white md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col px-8 py-2">
            {NAV.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-3.5 text-[15px] font-bold tracking-[0.04em] ${
                    active ? "text-ink" : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

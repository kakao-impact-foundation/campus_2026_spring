"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KakaoImpactLogo from "./KakaoImpactLogo";
import TechForImpactCampusLogo from "./TechForImpactCampusLogo";

// 카카오임팩트 GNB 구조: 워드마크 + 중앙 메뉴 + Family site / 언어 액션.
const NAV: { label: string; href: string; external?: boolean }[] = [
  { label: "PROJECTS", href: "/" },
  { label: "STORIES", href: "/stories" },
  { label: "GALLERY", href: "/gallery" },
  { label: "ABOUT", href: "https://techforimpact.io/campus/info", external: true },
];

// 외부 링크 아이콘 (옅은 회색 ↗)
function ExternalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#bbb]"
      aria-hidden
    >
      <path d="M4.5 13.5L13.5 4.5M13.5 4.5H6M13.5 4.5V12" />
    </svg>
  );
}

// 현재 경로가 해당 메뉴의 활성 상태인지
function isActive(href: string, pathname: string): boolean {
  if (href === "#") return false;
  if (href === "/") return pathname === "/" || pathname.startsWith("/projects");
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // 이미 프로젝트 홈(/)에 있을 때 로고·PROJECTS 클릭 → 필터 리셋.
  // 정적 export 에선 같은 라우트로의 라우터 내비게이션이 무동작이라,
  // 라우터 대신 커스텀 이벤트로 ProjectGrid 에 알린다. (그 외 페이지는 기존대로 홈 이동)
  const resetIfHome = (href: string, e: React.MouseEvent) => {
    if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.dispatchEvent(new Event("campus:reset-filters"));
    }
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#eee]"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(160%) blur(12px)",
        WebkitBackdropFilter: "saturate(160%) blur(12px)",
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-8 text-[#1C1C1C]">
        {/* 좌: 테크포임팩트 캠퍼스 워드마크 (홈) */}
        <Link
          href="/"
          aria-label="테크포임팩트 캠퍼스"
          className="text-[#1C1C1C]"
          onClick={(e) => resetIfHome("/", e)}
        >
          <TechForImpactCampusLogo height={20} />
        </Link>

        {/* 중앙: 메뉴 */}
        <nav className="flex gap-11 max-md:hidden">
          {NAV.map((item) => {
            const active = isActive(item.href, pathname);
            const cls = `relative py-1.5 font-kakao text-[15px] font-bold tracking-[0.04em] transition-opacity after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-[#1C1C1C] after:transition-transform after:duration-300 after:ease-out after:content-[''] ${
              active
                ? "opacity-100 after:scale-x-100"
                : "opacity-55 hover:opacity-100 after:scale-x-0 hover:after:scale-x-100"
            }`;
            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cls} inline-flex items-center gap-1`}
              >
                {item.label}
                <ExternalIcon />
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cls}
                onClick={(e) => resetIfHome(item.href, e)}
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
          <KakaoImpactLogo height={19} />
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
              const cls = `py-3.5 font-kakao text-[15px] font-bold tracking-[0.04em] ${
                active ? "text-ink" : "text-muted"
              }`;
              return item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`${cls} inline-flex items-center gap-1`}
                >
                  {item.label}
                  <ExternalIcon />
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    resetIfHome(item.href, e);
                    setOpen(false);
                  }}
                  className={cls}
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

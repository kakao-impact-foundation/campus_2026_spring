"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GUIDE } from "@/lib/guide";

// 좌측 목차 (깃북 스타일). 데스크톱은 sticky 사이드바, 모바일은 접히는 패널.
// 현재 문서 = 검정(#1C1C1C) — 학교 필터와 같은 "선택은 검정" 규칙.
export default function GuideSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-7">
      {GUIDE.map((section) => (
        <div key={section.title}>
          <div className="font-kakao text-muted mb-2 px-3 text-[12px] font-bold tracking-[0.1em] uppercase">
            {section.title}
          </div>
          <ul className="flex flex-col gap-0.5">
            {section.docs.map((doc) => {
              const href = `/guide/${doc.slug}`;
              const active = pathname === href;
              return (
                <li key={doc.slug}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-[7px] text-[14px] leading-[1.5] transition ${
                      active
                        ? "bg-soft font-bold text-[#1C1C1C]"
                        : "hover:bg-soft hover:text-ink text-[#666]"
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* 데스크톱 — 헤더(h-20) 아래에 고정 */}
      <aside className="border-hair sticky top-20 hidden h-[calc(100vh-5rem)] w-[248px] shrink-0 overflow-y-auto border-r py-10 pr-6 lg:block">
        {nav}
      </aside>

      {/* 모바일 — 목차 토글 */}
      <div className="border-hair bg-ground/95 sticky top-20 z-30 -mx-8 mb-6 border-b px-8 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="font-kakao text-ink flex w-full items-center gap-2 py-3.5 text-[14px] font-bold"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M3 4.5h12M3 9h12M3 13.5h8" />
          </svg>
          목차
          <svg
            width="14"
            height="14"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="M3.5 6L9 11.5L14.5 6" />
          </svg>
        </button>
        {open && <div className="pb-6">{nav}</div>}
      </div>
    </>
  );
}

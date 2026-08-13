"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { semesterHref, semesterOptionLabel } from "@/lib/semesters";

// 학기 선택 드롭다운. 학기마다 페이지가 따로 있으므로 항목은 링크(next/link)로,
// 정적 export·basePath 환경에서도 안전하게 이동한다.
// 칩 스타일은 학교 필터(SchoolBar)와 맞췄다.
export default function SemesterSelect({
  semester,
  semesters,
  hrefs,
}: {
  semester: string;
  semesters: string[];
  // 항목별 이동 경로 재정의(갤러리 등 다른 탭용). 없으면 프로젝트 경로(semesterHref).
  hrefs?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭·Esc 로 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-full border-[1.5px] border-soft bg-ground px-[17px] py-2 text-[13.5px] font-semibold text-[#1C1C1C] hover:border-soft2 hover:bg-soft"
      >
        {semesterOptionLabel(semester)}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-40 mt-2 min-w-[152px] list-none overflow-hidden rounded-2xl border border-[#eee] bg-ground py-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.1)]"
        >
          {semesters.map((s) => {
            const active = s === semester;
            return (
              <li key={s}>
                <Link
                  href={hrefs?.[s] ?? semesterHref(s)}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "true" : undefined}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[13.5px] whitespace-nowrap hover:bg-soft ${
                    active ? "font-bold text-ink" : "font-semibold text-[#555]"
                  }`}
                >
                  {semesterOptionLabel(s)}
                  {active && <span aria-hidden>✓</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

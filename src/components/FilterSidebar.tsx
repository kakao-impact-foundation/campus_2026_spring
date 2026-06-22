"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import {
  CATEGORIES,
  CATEGORY_COLOR,
  CATEGORY_ORGS,
  Category,
} from "@/lib/categories";

// 사이드바 필터 선택 상태. 카테고리(주제) 또는 조직 단위.
export type Selection =
  | { kind: "all" }
  | { kind: "cat"; val: Category }
  | { kind: "org"; val: string };

type Props = {
  projects: Project[];
  selection: Selection;
  onSelect: (s: Selection) => void;
  onReset: () => void;
};

export default function FilterSidebar({
  projects,
  selection,
  onSelect,
  onReset,
}: Props) {
  // 카운트는 학교 필터와 무관하게 전체 기준 (시안 동작과 동일)
  const orgCount: Record<string, number> = {};
  for (const p of projects) orgCount[p.org] = (orgCount[p.org] ?? 0) + 1;
  const catCount = (c: Category) =>
    CATEGORY_ORGS[c].reduce((s, o) => s + (orgCount[o] ?? 0), 0);

  // 모바일 접힘 상태 — 첫 화면에서 프로젝트가 보이도록 기본 닫힘.
  const [open, setOpen] = useState(false);

  // 현재 선택 요약 (모바일 토글 라벨)
  const current =
    selection.kind === "all" ? "전체" : selection.val;

  // 선택/초기화 시 패널 자동 닫기 → 결과 바로 확인
  const pick = (s: Selection) => {
    onSelect(s);
    setOpen(false);
  };
  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  return (
    <aside className="font-kakao">
      {/* 모바일 전용 토글 — 데스크톱에서는 숨김 */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mb-3 hidden w-full items-center justify-between rounded-xl border border-[#e6e6e6] px-4 py-3 text-[14.5px] font-bold max-[780px]:flex"
      >
        <span className="inline-flex items-center gap-2">
          주제 필터
          <span className="font-semibold text-muted">{current}</span>
        </span>
        <svg
          width="16"
          height="16"
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

      {/* 필터 본문 — 데스크톱 항상 표시, 모바일은 토글 시에만 */}
      <div className={open ? "block" : "max-[780px]:hidden"}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted max-[780px]:hidden">
        주제 카테고리
      </p>

      <button
        onClick={() => pick({ kind: "all" })}
        aria-pressed={selection.kind === "all"}
        className="mb-2 flex w-full justify-between rounded-[9px] px-2.5 py-[9px] text-left text-[14.5px] font-bold aria-pressed:bg-soft2"
      >
        <span>전체</span>
        <span className="text-xs font-semibold text-muted">
          {projects.length}
        </span>
      </button>

      <ul className="mb-[22px] list-none">
        {CATEGORIES.map((cat) => {
          const color = CATEGORY_COLOR[cat];
          const catActive = selection.kind === "cat" && selection.val === cat;
          return (
            <li key={cat} className="mb-1.5">
              <button
                onClick={() => pick({ kind: "cat", val: cat })}
                aria-pressed={catActive}
                style={catActive ? { background: color } : undefined}
                className="flex w-full items-center justify-between gap-2 rounded-[9px] px-2.5 py-[9px] text-left text-[14.5px] font-bold hover:bg-soft"
              >
                <span className="inline-flex items-center gap-[9px]">
                  <span
                    className="size-[9px] shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  {cat}
                </span>
                <span className="text-xs font-semibold text-muted">
                  {catCount(cat)}
                </span>
              </button>

              <ul className="mt-0.5 mb-2 list-none">
                {CATEGORY_ORGS[cat].map((org) => {
                  const orgActive =
                    selection.kind === "org" && selection.val === org;
                  return (
                    <li key={org}>
                      <button
                        onClick={() => pick({ kind: "org", val: org })}
                        aria-pressed={orgActive}
                        className="flex w-full items-center justify-between gap-2 rounded-lg py-1.5 pr-2.5 pl-[30px] text-left text-[13px] text-[#666] hover:bg-soft aria-pressed:font-bold aria-pressed:text-ink"
                      >
                        <span className="inline-flex items-center">
                          {orgActive && (
                            <span
                              className="mr-[7px] inline-block size-1.5 rounded-full"
                              style={{ background: color }}
                            />
                          )}
                          {org}
                        </span>
                        <span className="text-[11.5px] text-muted">
                          {orgCount[org] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <button
        onClick={handleReset}
        className="px-2.5 py-1 text-[12.5px] text-muted hover:text-ink"
      >
        필터 초기화
      </button>
      </div>
    </aside>
  );
}

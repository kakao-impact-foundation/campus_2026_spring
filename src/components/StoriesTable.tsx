"use client";

import { useMemo, useState, type ReactNode } from "react";
import { type Story, storyKinds } from "@/lib/stories";

// 외부 링크(↗) 아이콘
function ExternalIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4.5 13.5L13.5 4.5M13.5 4.5H6M13.5 4.5V12" />
    </svg>
  );
}

// 구분별 작은 아이콘 (영상=재생, 카드뉴스=이미지, 그 외(블로그)=글)
function KindIcon({ kind }: { kind: string }) {
  if (kind === "숏폼" || kind === "롱폼" || kind.includes("영상")) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  }
  if (kind === "카드뉴스") {
    return (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 16l5-5 4 4 3-3 4 4" />
      </svg>
    );
  }
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 5h14M5 10h14M5 15h9" />
    </svg>
  );
}

// 필터 칩 (구분·월 공통 톤: 선택 시 검정)
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full border-[1.5px] border-soft bg-ground px-[17px] py-2 text-[13.5px] font-semibold text-[#1C1C1C] transition-colors hover:bg-soft aria-pressed:border-[#1C1C1C] aria-pressed:bg-[#1C1C1C] aria-pressed:text-white"
    >
      {label}
    </button>
  );
}

export default function StoriesTable({
  stories,
  semesterSelect,
}: {
  stories: Story[];
  // 학기(기수) 전환 드롭다운 — 필터 줄 우측에 놓인다 (프로젝트·갤러리 탭과 같은 자리)
  semesterSelect?: ReactNode;
}) {
  const [filter, setFilter] = useState("전체");
  const [month, setMonth] = useState(""); // "" = 전체 월

  // 데이터에 등장하는 구분 목록 ("전체" + 블로그·숏폼·…)
  const kinds = useMemo(() => ["전체", ...storyKinds(stories)], [stories]);

  // 데이터에 등장하는 월 목록 — 숫자순 정렬
  const months = useMemo(() => {
    const set = new Set<string>();
    for (const s of stories) if (s.month) set.add(s.month);
    return [...set].sort(
      (a, b) => (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0),
    );
  }, [stories]);

  const list = useMemo(
    () =>
      stories.filter(
        (s) =>
          (filter === "전체" || s.kind === filter) &&
          (month === "" || s.month === month),
      ),
    [stories, filter, month],
  );

  return (
    <div className="mx-auto max-w-[1280px] px-8 pb-24">
      {/* 필터(구분 + 월) + 개수 + 학기 전환 */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {kinds.map((f) => (
            <FilterChip
              key={f}
              label={f}
              active={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
          {/* 월 필터 — 다시 누르면 해제(전체) */}
          {months.map((m) => (
            <FilterChip
              key={m}
              label={m}
              active={month === m}
              onClick={() => setMonth((cur) => (cur === m ? "" : m))}
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">
            총 <b className="font-bold text-ink">{list.length}</b>개
          </span>
          {semesterSelect}
        </div>
      </div>

      {/* 행 */}
      <div className="divide-y divide-black/[0.07] border-t border-black/10">
        {list.map((s, i) => (
          <a
            key={`${s.link}-${i}`}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[64px_1fr_220px_24px] items-center gap-4 rounded-lg py-5 transition-colors hover:bg-soft max-sm:grid-cols-1 max-sm:gap-1.5"
          >
            <div className="pl-2 text-[14px] font-bold text-ink max-sm:pl-0 max-sm:text-[12.5px] max-sm:font-semibold max-sm:text-muted">
              {s.month}
            </div>

            <div className="min-w-0">
              <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-bold text-muted">
                <KindIcon kind={s.kind} />
                {s.kind}
              </span>
              <div className="line-clamp-2 text-[15.5px] font-semibold leading-snug text-ink underline-offset-2 decoration-[#ccc] group-hover:underline">
                {s.title}
              </div>
            </div>

            <div className="max-sm:mt-1">
              <div className="text-[14px] font-bold text-ink">{s.name}</div>
              <div className="text-[12.5px] text-muted">
                {s.school} · {s.org}
              </div>
            </div>

            <div className="flex justify-end pr-2 text-muted transition-colors group-hover:text-ink max-sm:hidden">
              <ExternalIcon />
            </div>
          </a>
        ))}

        {list.length === 0 && (
          <div className="py-20 text-center text-muted">
            해당하는 스토리가 없어요.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Story, STORY_KINDS } from "@/lib/stories";

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

// 구분별 작은 아이콘 (블로그=글, 숏폼=재생)
function KindIcon({ kind }: { kind: string }) {
  if (kind === "숏폼") {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M8 5v14l11-7z" />
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

export default function StoriesTable({ stories }: { stories: Story[] }) {
  const [filter, setFilter] = useState<(typeof STORY_KINDS)[number]>("전체");

  const list = useMemo(
    () => stories.filter((s) => filter === "전체" || s.kind === filter),
    [stories, filter],
  );

  return (
    <div className="mx-auto max-w-[1280px] px-8 pb-24">
      {/* 필터 + 개수 */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {STORY_KINDS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className="rounded-full border-[1.5px] border-soft bg-ground px-[17px] py-2 text-[13.5px] font-semibold text-[#1C1C1C] transition-colors hover:bg-soft aria-pressed:border-[#1C1C1C] aria-pressed:bg-[#1C1C1C] aria-pressed:text-white"
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted">
          총 <b className="font-bold text-ink">{list.length}</b>개
        </span>
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

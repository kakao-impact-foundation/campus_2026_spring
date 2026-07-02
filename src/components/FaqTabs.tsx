"use client";

import { useMemo, useState } from "react";

type FaqItem = { category: string; q: string; a: React.ReactNode };

// 카테고리 탭으로 묶은 FAQ. 탭 선택 시 해당 카테고리 질문만 노출.
export default function FaqTabs({ items }: { items: FaqItem[] }) {
  // 등장 순서대로 카테고리 목록
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const it of items) if (!seen.includes(it.category)) seen.push(it.category);
    return seen;
  }, [items]);

  const [active, setActive] = useState(categories[0]);

  return (
    <div>
      {/* 카테고리 탭 (학교 필터 칩과 동일 톤: 선택 시 검정) */}
      <div className="mb-7 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            className="rounded-full border-[1.5px] border-soft bg-ground px-[17px] py-2 text-[13.5px] font-semibold text-[#1C1C1C] hover:border-soft2 hover:bg-soft aria-pressed:border-[#1C1C1C] aria-pressed:bg-[#1C1C1C] aria-pressed:text-white"
          >
            {c}
          </button>
        ))}
      </div>

      {/* 질문 목록 — 모든 카테고리를 같은 그리드 칸에 겹쳐, 컨테이너 높이를
          가장 내용이 많은 탭에 맞춰 고정(전환 시 레이아웃 점프 방지). */}
      <div className="grid">
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <div
              key={c}
              aria-hidden={!isActive}
              className={`col-start-1 row-start-1 transition-opacity duration-200 ${
                isActive ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <div className="flex flex-col divide-y divide-hair border-y border-hair">
                {items
                  .filter((it) => it.category === c)
                  .map((f) => (
                    <div key={f.q} className="py-6">
                      <h4 className="text-[17px] font-bold text-ink">
                        Q. {f.q}
                      </h4>
                      <div className="mt-2.5 text-[16px] leading-[1.7] text-[#555]">
                        {f.a}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

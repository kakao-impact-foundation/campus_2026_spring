"use client";

import { useEffect, useState } from "react";

// 우측 "이 페이지에서" — 현재 보고 있는 섹션을 따라 표시가 움직인다.
export default function GuideToc({
  items,
}: {
  items: { id: string; text: string; level: 2 | 3 }[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) return;
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    // 뷰포트 상단 근처에 들어온 제목을 활성으로. 헤더(80px) 만큼 위를 잘라낸다.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <aside className="sticky top-20 hidden h-fit w-[196px] shrink-0 py-10 pl-6 xl:block">
      <div className="font-kakao text-muted mb-3 text-[12px] font-bold tracking-[0.1em] uppercase">
        이 페이지에서
      </div>
      <ul className="border-hair flex flex-col gap-0.5 border-l">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`-ml-px block border-l-[2px] py-[5px] text-[13px] leading-[1.5] transition ${
                it.level === 3 ? "pl-[18px]" : "pl-3"
              } ${
                active === it.id
                  ? "text-ink border-[#1C1C1C] font-semibold"
                  : "text-muted hover:text-ink border-transparent"
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";

// 지원하기 버튼 — 모집 마감일(deadline, 해당일 23:59까지)이 지나면 "모집 마감"으로 비활성.
//  · 정적 빌드라 마감 판정은 방문자 브라우저에서 실시간 계산(마운트 후 갱신).
export default function ApplyButton({
  href,
  deadline,
  label = "지원하기",
  className = "",
}: {
  href: string;
  deadline: string; // "YYYY-MM-DD"
  label?: string;
  className?: string;
}) {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const [y, m, d] = deadline.split("-").map(Number);
    const end = new Date(y, m - 1, d); // 마감일 자정 기준
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((end.getTime() - today.getTime()) / 86400000);
    // 방문 시점의 클라이언트 시계와 1회 동기화 (외부 시스템 동기화 — 의도적 허용)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClosed(days < 0);
  }, [deadline]);

  // border border-transparent: 아웃라인 버튼(1px 테두리)과 높이를 정확히 맞추기 위함
  const base =
    "inline-flex items-center gap-2 rounded-full border border-transparent px-7 py-3.5 font-kakao text-[17px] font-semibold transition";

  if (closed) {
    return (
      <span className={`${base} cursor-default bg-soft text-muted ${className}`}>
        모집 마감
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-[#1C1C1C] text-white hover:opacity-90 ${className}`}
    >
      {label}
      <svg
        width="14"
        height="14"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4.5 13.5L13.5 4.5M13.5 4.5H6M13.5 4.5V12" />
      </svg>
    </a>
  );
}

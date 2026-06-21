"use client";

import { useState } from "react";

// 썸네일 위 오버레이용 — 클릭 시 카드 이동을 막고 폴더 링크를 복사한다.
export default function CopyFolderButton({
  url,
  className = "",
}: {
  url: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("아래 링크를 복사하세요", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={onClick}
      aria-label="구글드라이브 폴더 링크 복사"
      title="폴더 링크 복사"
      className={`flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_1px_4px_rgba(0,0,0,0.15)] backdrop-blur transition hover:bg-white ${className}`}
    >
      {copied ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12.5 10 17.5 19 6.5" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
        </svg>
      )}
    </button>
  );
}

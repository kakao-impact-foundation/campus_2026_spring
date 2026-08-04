"use client";

import { useEffect } from "react";
import { Innovator } from "@/lib/2026-fall";

// 사회혁신가 상세 팝업 — 카드 클릭 시 표시. Esc·배경 클릭·닫기 버튼으로 닫힘.
export default function InnovatorModal({
  innovator,
  onClose,
}: {
  innovator: Innovator;
  onClose: () => void;
}) {
  // Esc 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${innovator.org} · ${innovator.name}`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-ground relative flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[24px] sm:max-h-[88vh] sm:rounded-[24px]"
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="bg-soft hover:bg-soft2 hover:text-ink absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full text-[#555] transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="overflow-y-auto px-7 py-8 max-sm:px-6 sm:px-9 sm:py-10">
          {/* 조직 유형 */}
          <div className="text-muted text-[13px] font-semibold">
            {innovator.orgType}
          </div>

          {/* 기관명(헤드라인) · 사회혁신가 — 카드와 같은 순서 */}
          <h2 className="font-kakao text-ink mt-2 text-[30px] leading-[1.2] font-extrabold tracking-[-0.02em] max-sm:text-[25px]">
            {innovator.org}
          </h2>
          <p className="mt-1.5 text-[17px] font-bold text-[#333]">
            {innovator.name}
          </p>

          {/* 해시태그 */}
          {innovator.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {innovator.tags.map((t) => (
                <span
                  key={t}
                  className="bg-soft rounded-full px-3 py-1 text-[13px] font-semibold text-[#444]"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* 매칭 학교 */}
          {innovator.schools.length > 0 && (
            <Block title="매칭 학교">
              <div className="flex flex-wrap gap-2">
                {innovator.schools.map((s) => (
                  <span
                    key={s}
                    className="border-hair text-ink rounded-full border-[1.5px] px-3.5 py-1.5 text-[13.5px] font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Block>
          )}

          {/* 조직 소개 */}
          {innovator.intro && (
            <Block title="조직 소개">
              <div className="text-[15px] leading-[1.8] text-[#444]">
                <RichText text={innovator.intro} />
              </div>
            </Block>
          )}

          {/* 질문 키트 */}
          {innovator.questions.length > 0 && (
            <Block title="사회 현장의 질문들, 기술과 만난다면?">
              <ol className="flex flex-col gap-4">
                {innovator.questions.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-kakao text-muted text-[15px] font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="flex-1 text-[15px] leading-[1.8] text-[#444]">
                      {q}
                    </p>
                  </li>
                ))}
              </ol>
            </Block>
          )}
        </div>
      </div>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-hair mt-8 border-t pt-7">
      <h3 className="font-kakao text-muted mb-4 text-[15px] font-bold tracking-[0.02em]">
        {title}
      </h3>
      {children}
    </section>
  );
}

// 줄바꿈을 유지하고 URL·이메일을 링크로 변환.
const LINK_RE = /(https?:\/\/[^\s]+|www\.[^\s]+|[\w.+-]+@[\w.-]+\.[a-z]{2,})/gi;

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {linkifyLine(line)}
        </span>
      ))}
    </>
  );
}

function linkifyLine(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    // 뒤따르는 문장부호는 링크에서 제외
    const raw = m[0].replace(/[),.]+$/, "");
    const trailing = m[0].slice(raw.length);
    const href = raw.includes("@")
      ? `mailto:${raw}`
      : raw.startsWith("http")
        ? raw
        : `https://${raw}`;
    out.push(
      <a
        key={`${m.index}-${raw}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink decoration-hair hover:decoration-ink font-medium underline underline-offset-2"
      >
        {raw}
      </a>,
    );
    if (trailing) out.push(trailing);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

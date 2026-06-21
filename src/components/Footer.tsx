"use client";

import KakaoImpactLogo from "./KakaoImpactLogo";

// 다크 푸터 (카카오임팩트 주니어스쿨 포럼 톤).
// 워드마크 → divider → (소셜 아이콘 / 관련 사이트 드롭다운) → 하단 바.
const RELATED = [
  { label: "카카오임팩트", href: "https://www.kakaoimpact.org" },
  { label: "테크포임팩트", href: "https://techforimpact.io" },
];
type SocialName = "kakaotalk" | "instagram" | "youtube" | "brunch";
const SOCIALS: { name: SocialName; label: string; href: string }[] = [
  { name: "kakaotalk", label: "카카오톡채널", href: "https://pf.kakao.com/_MiBCd" },
  {
    name: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/kakao_impact",
  },
  { name: "youtube", label: "YouTube", href: "https://www.youtube.com/c/kakaoimpact" },
];

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "kakaotalk") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M12 4C7.6 4 4 6.9 4 10.4c0 2.3 1.5 4.3 3.8 5.4-.2.6-.7 2.2-.8 2.6 0 .1.1.3.3.2.2-.1 2.4-1.6 3.3-2.2.5.1 1 .1 1.4.1 4.4 0 8-2.9 8-6.4S16.4 4 12 4z" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        aria-hidden
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="#fff" stroke="none" />
      </svg>
    );
  }
  // youtube — 흰 사각형 + 배경색 재생 삼각형
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <rect x="2.5" y="6" width="19" height="12" rx="3.6" fill="#fff" />
      <path d="M10.3 9.2 15 12l-4.7 2.8z" fill="#3a3a3a" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-[70px] bg-foot text-white">
      <div className="mx-auto max-w-[1280px] px-8">
        {/* 워드마크 (하단 divider 없음) */}
        <div className="pt-10 pb-6">
          <KakaoImpactLogo height={22} />
        </div>

        {/* 소셜 아이콘(좌) / 관련 사이트 · TOP(우) */}
        <div className="flex flex-wrap items-center justify-between gap-5 pb-8 max-sm:flex-col max-sm:items-start">
          <div className="flex gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full bg-[#3a3a3a] transition-colors hover:bg-[#4a4a4a]"
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 관련 사이트 — 바로가기 버튼(둥근 pill, ↗) */}
            {RELATED.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-foot-line px-4 py-2.5 text-[13px] font-semibold text-foot-txt transition-colors hover:border-[#5a5a5a] hover:text-white"
              >
                {r.label}
                <span className="text-[11px] opacity-70">↗</span>
              </a>
            ))}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-[10px] bg-[#3a3a3a] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#4a4a4a]"
            >
              TOP ↑
            </button>
          </div>
        </div>

        {/* 하단 바: 기관 정보 · 저작권 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-foot-line py-[18px] pb-7 text-[12.5px] text-foot-txt max-sm:flex-col max-sm:items-start max-sm:gap-2">

          <span>재단법인 카카오임팩트</span>
          <a href="mailto:contact.us@kakaoimpact.org" className="hover:text-white">
            문의 : contact.us@kakaoimpact.org
          </a>
          <span>© Kakao Impact Foundation. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

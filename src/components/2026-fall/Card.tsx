import Link from "next/link";
import { Innovator, themeColor } from "@/lib/2026-fall";

// 로고 표시 조직: 이미지를 우측에 배치 (글씨 비겹침)
// 그 외 이미지는 카드 전체 배경으로 사용
const LOGO_ORGS = new Set(["공익법센터 어필"]);

export default function InnovatorCard({ innovator }: { innovator: Innovator }) {
  const tags = innovator.tags.slice(0, 3);
  const color = themeColor(innovator.tags);
  const img = innovator.cardImageUrl;
  const isLogo = img && LOGO_ORGS.has(innovator.org);
  const isBg = img && !isLogo;

  /* ── 배경 이미지 카드 ── */
  if (isBg) {
    return (
      <Link
        href={`/2026-fall/${innovator.id}`}
        className="focus-visible:outline-accent relative flex h-[212px] w-full flex-col overflow-hidden rounded-[18px] text-left transition hover:-translate-y-[3px] focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-[3px]"
        style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* 하단 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full flex-col gap-[6px] p-[22px_22px_20px]">
          <div className="line-clamp-2 text-[21px] leading-[1.3] font-extrabold tracking-[-0.015em] text-white drop-shadow-sm">
            {innovator.org}
          </div>
          <div className="truncate text-[14px] leading-[1.5] font-semibold text-white/80">
            {innovator.name}
          </div>
          {tags[0] && (
            <div className="mt-auto flex items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: color ?? "#d4d4d4" }}
              />
              <span className="text-[13px] font-bold text-white/90">{tags[0]}</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  /* ── 로고 우측 배치 카드 ── */
  return (
    <Link
      href={`/2026-fall/${innovator.id}`}
      className="bg-soft hover:bg-soft2 focus-visible:outline-accent relative flex h-[212px] w-full overflow-hidden rounded-[18px] text-left transition hover:-translate-y-[3px] focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-[3px]"
    >
      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col gap-[7px] p-[22px_22px_20px]">
        <div
          className={`line-clamp-2 text-[21px] leading-[1.3] font-extrabold tracking-[-0.015em] ${isLogo ? "pr-[72px]" : ""}`}
        >
          {innovator.org}
        </div>
        <div className="truncate text-[14px] leading-[1.5] font-semibold text-[#4a4a4a]">
          {innovator.name}
        </div>
        {tags[0] && (
          <div className="mt-auto flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: color ?? "#d4d4d4" }}
            />
            <span className="text-[13px] font-bold text-ink">{tags[0]}</span>
          </div>
        )}
      </div>

      {/* 로고 (우측 상단) */}
      {isLogo && (
        <div className="absolute top-[18px] right-[18px] flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" className="h-full w-full object-contain p-[6px]" />
        </div>
      )}
    </Link>
  );
}

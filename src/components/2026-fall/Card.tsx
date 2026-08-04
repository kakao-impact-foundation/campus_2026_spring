import { Innovator } from "@/lib/2026-fall";

// 사회혁신가 카드 — 이미지 없이 기관명·이름·대표 태그. 텍스트 전용·옅은 회색 면·높이 고정.
// 기관명이 헤드라인, 사회혁신가 이름은 그 아래 보조 정보.
// 클릭 시 상세 팝업을 여는 버튼으로 동작(onSelect).
export default function InnovatorCard({
  innovator,
  onSelect,
}: {
  innovator: Innovator;
  onSelect: (innovator: Innovator) => void;
}) {
  const tags = innovator.tags.slice(0, 3);

  return (
    <button
      type="button"
      onClick={() => onSelect(innovator)}
      className="bg-soft hover:bg-soft2 focus-visible:outline-accent relative flex h-[212px] w-full flex-col gap-[7px] overflow-hidden rounded-[18px] p-[22px_22px_20px] text-left transition hover:-translate-y-[3px] focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-[3px]"
    >
      {/* 기관명 (헤드라인) */}
      <div className="line-clamp-2 text-[21px] leading-[1.3] font-extrabold tracking-[-0.015em]">
        {innovator.org}
      </div>

      {/* 사회혁신가 이름 */}
      <div className="truncate text-[14px] leading-[1.5] font-semibold text-[#4a4a4a]">
        {innovator.name}
      </div>

      {/* 대표 태그 */}
      <div className="mt-auto flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-[#444]"
          >
            #{t}
          </span>
        ))}
      </div>
    </button>
  );
}

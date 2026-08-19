import Link from "next/link";
import { Innovator, themeColor } from "@/lib/2026-fall";

export default function InnovatorCard({ innovator }: { innovator: Innovator }) {
  const tags = innovator.tags.slice(0, 3);
  const color = themeColor(innovator.tags);

  return (
    <Link
      href={`/2026-fall/${innovator.id}`}
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
      {tags[0] && (
        <div className="mt-auto flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: color ?? "#d4d4d4" }}
          />
          <span className="text-[13px] font-bold text-ink">{tags[0]}</span>
        </div>
      )}
    </Link>
  );
}

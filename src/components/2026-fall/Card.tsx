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
      <div className="mt-auto flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <span
            key={t}
            className="rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#444]"
            style={{ background: i === 0 && color ? color : "white" }}
          >
            #{t}
          </span>
        ))}
      </div>
    </Link>
  );
}

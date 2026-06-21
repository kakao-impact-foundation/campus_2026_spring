import Link from "next/link";
import { Project } from "@/lib/types";
import { CATEGORY_COLOR } from "@/lib/categories";
import AwardBadge from "./AwardBadge";

// 카드: 텍스트 전용 · 옅은 회색 면 · 높이 고정. 카테고리 = 테마색 점.
export default function ProjectCard({ project }: { project: Project }) {
  const cat = project.category;
  const color = cat ? CATEGORY_COLOR[cat] : "#e5e5e5";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="relative flex h-[206px] flex-col gap-[9px] overflow-hidden rounded-[18px] bg-soft p-[22px_22px_20px] transition hover:-translate-y-[3px] hover:bg-soft2 focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-[3px] focus-visible:outline-accent"
    >
      {project.award && (
        <AwardBadge label={project.award} className="absolute top-4 right-4 z-10" />
      )}
      <div
        className={`text-[12.5px] font-semibold text-muted ${project.award ? "truncate pr-[92px]" : ""}`}
      >
        {project.school} · {project.team}
      </div>
      <div className="truncate text-[20px] font-extrabold leading-[1.3] tracking-[-0.015em]">
        {project.name}
      </div>
      <p className="line-clamp-2 max-h-[2.9em] text-[13.5px] leading-[1.55] text-[#4a4a4a]">
        {project.oneLiner}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {cat && (
          <span className="inline-flex items-center gap-[7px] text-[12.5px] font-bold text-[#1C1C1C]">
            <span
              className="size-[9px] shrink-0 rounded-full"
              style={{ background: color }}
            />
            {cat}
          </span>
        )}
        <span className="text-xs font-semibold text-muted before:mr-2 before:text-[#cfcfcf] before:content-['·']">
          {project.org}
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { Project } from "@/lib/types";
import { CATEGORY_COLOR } from "@/lib/categories";
import AwardBadge from "./AwardBadge";

// 카드: 텍스트 전용 · 옅은 회색 면 · 높이 고정. 카테고리 = 테마색 점.
//  · 기본: 상세 페이지로 이동하는 링크.
//  · onSelect 전달 시: 링크 대신 버튼으로 동작(파트너 페이지의 모달 트리거 등).
//  · hideAward: 수상 배지 숨김.
export default function ProjectCard({
  project,
  hideAward = false,
  onSelect,
  surface = "bg-soft hover:bg-soft2",
}: {
  project: Project;
  hideAward?: boolean;
  onSelect?: (project: Project) => void;
  // 카드 면 색상 클래스 (기본: 옅은 회색). 파트너 페이지는 #F6F8FA 로 덮어씀.
  surface?: string;
}) {
  const cat = project.category;
  const color = cat ? CATEGORY_COLOR[cat] : "#e5e5e5";
  const showAward = !!project.award && !hideAward;
  const className =
    `relative flex h-[206px] w-full flex-col gap-[9px] overflow-hidden rounded-[18px] ${surface} p-[22px_22px_20px] text-left transition hover:-translate-y-[3px] focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-[3px] focus-visible:outline-accent`;

  const inner = (
    <>
      {showAward && (
        <AwardBadge
          label={project.award}
          className="absolute top-4 right-4 z-10"
        />
      )}
      <div
        className={`text-[12.5px] font-semibold text-muted ${showAward ? "truncate pr-[92px]" : ""}`}
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
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(project)} className={className}>
        {inner}
      </button>
    );
  }
  return (
    <Link href={`/projects/${project.id}`} className={className}>
      {inner}
    </Link>
  );
}

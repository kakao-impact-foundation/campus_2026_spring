"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import ProjectDetailView from "./ProjectDetailView";

// 파트너 모집 페이지용 대표 프로젝트 그리드.
//  · 수상 배지는 숨기고(hideAward), 클릭 시 상세로 이동하는 대신 모달로 미리보기.
export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  // 모달 열림 동안 Esc 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 max-[780px]:grid-cols-2 max-[540px]:grid-cols-1">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} hideAward onSelect={setSelected} />
        ))}
      </div>

      {selected && (
        <Modal project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function Modal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-5 max-md:p-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-6 w-full max-w-[880px] rounded-[22px] bg-ground px-10 py-9 max-md:px-6 max-md:py-7"
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="sticky top-0 z-10 -mt-2 -mr-2 ml-auto flex size-10 items-center justify-center rounded-full bg-ground/90 text-muted backdrop-blur transition hover:bg-soft hover:text-ink"
        >
          <svg
            width="22"
            height="22"
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

        <ProjectDetailView project={project} inModal />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Project } from "@/lib/types";
import FilterSidebar, { Selection } from "./FilterSidebar";
import SchoolBar from "./SchoolBar";
import ProjectCard from "./ProjectCard";

// 학교 칩 표시 순서 (데이터에 있는 학교만 노출)
// 가나다 순 (전체 다음 단국대부터)
const SCHOOL_ORDER = ["단국대", "서강대", "연세대", "이화여대", "한양대"];

// 상세 → 목록 복귀 시 필터 유지용 (탭 세션 한정)
const FILTER_KEY = "project-list-filters";
type SavedFilters = { school: string; selection: Selection; seed: number };

// 시안과 동일한 결정적 셔플 — 서버/클라이언트 렌더 결과가 일치해 하이드레이션 안전.
function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const r = arr.slice();
  let s = seed;
  for (let i = r.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345 + i) & 0x7fffffff;
    const j = Math.floor((i + 1) * (s / 0x7fffffff));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [school, setSchool] = useState("전체");
  const [selection, setSelection] = useState<Selection>({ kind: "all" });
  const [seed, setSeed] = useState(7);
  const [restored, setRestored] = useState(false);

  // 마운트 시 저장된 필터 복원 (SSR/하이드레이션 불일치 방지를 위해 effect 에서)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(FILTER_KEY);
      if (raw) {
        const s = JSON.parse(raw) as SavedFilters;
        if (s.school) setSchool(s.school);
        if (s.selection) setSelection(s.selection);
        if (typeof s.seed === "number") setSeed(s.seed);
      }
    } catch {
      /* 무시 */
    }
    setRestored(true);
  }, []);

  // 변경 시 저장 (복원 완료 후에만 — 기본값으로 덮어쓰기 방지)
  useEffect(() => {
    if (!restored) return;
    const data: SavedFilters = { school, selection, seed };
    sessionStorage.setItem(FILTER_KEY, JSON.stringify(data));
  }, [restored, school, selection, seed]);

  const schools = useMemo(() => {
    const present = new Set(projects.map((p) => p.school));
    return ["전체", ...SCHOOL_ORDER.filter((s) => present.has(s))];
  }, [projects]);

  const list = useMemo(() => {
    const filtered = projects.filter((p) => {
      if (school !== "전체" && p.school !== school) return false;
      if (selection.kind === "cat") return p.category === selection.val;
      if (selection.kind === "org") return p.org === selection.val;
      return true;
    });
    return shuffleSeeded(filtered, seed);
  }, [projects, school, selection, seed]);

  const reset = () => {
    setSchool("전체");
    setSelection({ kind: "all" });
  };

  return (
    <div className="mx-auto max-w-[1280px] px-8">
      {/* 모바일: 학교 버튼을 맨 위로 (데스크톱에서는 메인 상단에 렌더) */}
      <div className="hidden max-[780px]:block">
        <SchoolBar schools={schools} selected={school} onSelect={setSchool} />
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-12 pb-10 max-[1040px]:grid-cols-[200px_1fr] max-[1040px]:gap-9 max-[780px]:grid-cols-1 max-[780px]:gap-7">
        {/* 스크롤 시 헤더(80px) 아래에 고정 */}
        <div className="sticky top-[96px] self-start max-[780px]:static">
          <FilterSidebar
            projects={projects}
            selection={selection}
            onSelect={setSelection}
            onReset={reset}
          />
        </div>

        <main>
          {/* 학교 버튼: 데스크톱 전용 (모바일은 그리드 위에서 노출) */}
          <div className="max-[780px]:hidden">
            <SchoolBar schools={schools} selected={school} onSelect={setSchool} />
          </div>

          <div className="mb-[26px] flex items-center justify-between gap-4">
            <span className="text-sm text-muted">
              총 <b className="font-bold text-ink">{list.length}</b>개 프로젝트
            </span>
            <button
              onClick={() => setSeed((s) => (s * 7 + 3) & 0x7fffffff)}
              className="rounded-full bg-soft px-3.5 py-2 text-[13px] font-semibold text-[#444] hover:bg-soft2"
            >
              셔플
            </button>
          </div>

          {list.length ? (
            <div className="grid grid-cols-3 gap-4 max-[780px]:grid-cols-2 max-[540px]:grid-cols-1">
              {list.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="py-[70px] text-center text-muted">
              해당 조건의 프로젝트가 없어요.
              <br />
              <button
                onClick={reset}
                className="mt-2 px-2.5 py-1 text-[12.5px] text-muted hover:text-ink"
              >
                필터 초기화
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

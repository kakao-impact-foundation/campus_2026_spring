"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Project } from "@/lib/types";
import { CATEGORIES, Category } from "@/lib/categories";
import FilterSidebar, { Selection } from "./FilterSidebar";
import SchoolBar from "./SchoolBar";
import ProjectCard from "./ProjectCard";

// 학교 칩 표시 순서 (데이터에 있는 학교만 노출)
// 가나다 순 (전체 다음 단국대부터)
const SCHOOL_ORDER = ["단국대", "서강대", "연세대", "이화여대", "한양대"];

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
  // 필터 상태의 단일 소스 = URL 쿼리(?school=…&cat=… | &org=…).
  // 공유 시 링크에 필터가 담기고, 뒤로가기도 URL 복원으로 자연히 유지된다.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [seed, setSeed] = useState(7); // 셔플 순서 — 공유 대상 아님(URL 미포함)

  const schools = useMemo(() => {
    const present = new Set(projects.map((p) => p.school));
    return ["전체", ...SCHOOL_ORDER.filter((s) => present.has(s))];
  }, [projects]);

  // URL → 필터 상태 (유효하지 않은 값은 무시하고 전체로 폴백)
  const orgSet = useMemo(() => new Set(projects.map((p) => p.org)), [projects]);
  const rawSchool = searchParams.get("school") ?? "";
  const school = schools.includes(rawSchool) ? rawSchool : "전체";
  const selection = useMemo<Selection>(() => {
    const cat = searchParams.get("cat");
    if (cat && (CATEGORIES as readonly string[]).includes(cat))
      return { kind: "cat", val: cat as Category };
    const org = searchParams.get("org");
    if (org && orgSet.has(org)) return { kind: "org", val: org };
    return { kind: "all" };
  }, [searchParams, orgSet]);

  // 필터 변경 → URL 쿼리 갱신 (replace: 클릭마다 히스토리 안 쌓임, 스크롤 유지)
  const writeParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setSchool = (s: string) =>
    writeParams((p) => (s === "전체" ? p.delete("school") : p.set("school", s)));

  const setSelection = (sel: Selection) =>
    writeParams((p) => {
      p.delete("cat");
      p.delete("org");
      if (sel.kind === "cat") p.set("cat", sel.val);
      else if (sel.kind === "org") p.set("org", sel.val);
    });

  const list = useMemo(() => {
    const filtered = projects.filter((p) => {
      if (school !== "전체" && p.school !== school) return false;
      if (selection.kind === "cat") return p.category === selection.val;
      if (selection.kind === "org") return p.org === selection.val;
      return true;
    });
    return shuffleSeeded(filtered, seed);
  }, [projects, school, selection, seed]);

  const reset = () => router.replace(pathname, { scroll: false });

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

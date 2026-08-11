import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import SemesterSelect from "@/components/SemesterSelect";
import { Project } from "@/lib/types";

// 학기 목록 페이지 본문 — 홈(/ = 현재 학기)과 /semesters/[sem] 이 공유한다.
// 히어로 통계는 넘겨받은 학기의 프로젝트만으로 집계한다.
export default function SemesterProjects({
  semester,
  semesters,
  projects,
}: {
  semester: string;
  semesters: string[]; // 드롭다운 목록 (최신순)
  projects: Project[]; // 해당 학기 프로젝트
}) {
  const schools = new Set(projects.map((p) => p.school)).size;
  const orgs = new Set(projects.map((p) => p.org)).size;
  // 참가 학생 수 = 팀별 (팀장 1 + 팀원 명수) 합계
  // 과거 학기는 팀장 컬럼이 비어 있어 팀원 명수만 더해진다.
  const students = projects.reduce((sum, p) => {
    const members = p.members
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean).length;
    return sum + (p.leader.trim() ? 1 : 0) + members;
  }, 0);

  return (
    <>
      <Hero
        semester={semester}
        schools={schools}
        orgs={orgs}
        students={students}
        projects={projects.length}
      />

      {/* 학기 전환 — 카드 그리드 상단 우측 */}
      {semesters.length > 1 && (
        <div className="mx-auto mb-6 flex max-w-[1280px] justify-end px-8">
          <SemesterSelect semester={semester} semesters={semesters} />
        </div>
      )}

      {/* useSearchParams 사용 → 정적 export 빌드 위해 Suspense 경계 필요 */}
      <Suspense>
        <ProjectGrid projects={projects} />
      </Suspense>
    </>
  );
}

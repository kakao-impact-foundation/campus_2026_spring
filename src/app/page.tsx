import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import { getAllProjects } from "@/lib/projects";

// 리스트 페이지 — 빌드 시 전체 프로젝트를 로드하고, 필터·셔플은 클라이언트에서.
export default async function Home() {
  const projects = await getAllProjects();
  // 히어로 통계 = 데이터 기준 집계
  const schools = new Set(projects.map((p) => p.school)).size;
  const orgs = new Set(projects.map((p) => p.org)).size;
  // 참가 학생 수 = 팀별 (팀장 1 + 팀원 명수) 합계
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
        schools={schools}
        orgs={orgs}
        students={students}
        projects={projects.length}
      />
      {/* useSearchParams 사용 → 정적 export 빌드 위해 Suspense 경계 필요 */}
      <Suspense>
        <ProjectGrid projects={projects} />
      </Suspense>
    </>
  );
}

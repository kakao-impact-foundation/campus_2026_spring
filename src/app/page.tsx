import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import { getAllProjects } from "@/lib/projects";

// 리스트 페이지 — 빌드 시 전체 프로젝트를 로드하고, 필터·셔플은 클라이언트에서.
export default async function Home() {
  const projects = await getAllProjects();
  // 히어로 통계 = 데이터 기준 집계
  const schools = new Set(projects.map((p) => p.school)).size;
  const orgs = new Set(projects.map((p) => p.org)).size;
  return (
    <>
      <Hero schools={schools} orgs={orgs} projects={projects.length} />
      <ProjectGrid projects={projects} />
    </>
  );
}

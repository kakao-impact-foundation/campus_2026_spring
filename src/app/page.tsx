import SemesterProjects from "@/components/SemesterProjects";
import { getProjectsBySemester, getSemesters } from "@/lib/projects";
import { CURRENT_SEMESTER } from "@/lib/semesters";

// 홈 = 현재 학기 목록. 이전 학기는 /semesters/[sem] 로 분리돼 있다.
// 빌드 시 시트 전체를 로드하고, 필터·셔플은 클라이언트에서.
export default async function Home() {
  const [projects, semesters] = await Promise.all([
    getProjectsBySemester(CURRENT_SEMESTER),
    getSemesters(),
  ]);
  return (
    <SemesterProjects
      semester={CURRENT_SEMESTER}
      semesters={semesters}
      projects={projects}
    />
  );
}

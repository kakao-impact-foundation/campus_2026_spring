import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SemesterProjects from "@/components/SemesterProjects";
import { getProjectsBySemester, getSemesters } from "@/lib/projects";
import { CURRENT_SEMESTER, semesterLabel } from "@/lib/semesters";

// 지난 학기 목록 페이지. 현재 학기는 홈(/)이 담당하므로 여기서 제외한다.
// 정적 export: 시트에 있는 학기만 미리 생성하고, 그 외 경로는 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const semesters = await getSemesters();
  return semesters
    .filter((sem) => sem !== CURRENT_SEMESTER)
    .map((sem) => ({ sem }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sem: string }>;
}): Promise<Metadata> {
  const { sem } = await params;
  const title = `${semesterLabel(sem)} 돕는 기술 프로젝트 — 테크포임팩트 캠퍼스`;
  const description = `${semesterLabel(sem)}에 학생들이 사회혁신가와 함께 만든 돕는 기술을 소개합니다`;
  return { title, description, openGraph: { title, description } };
}

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ sem: string }>;
}) {
  const { sem } = await params;
  const [projects, semesters] = await Promise.all([
    getProjectsBySemester(sem),
    getSemesters(),
  ]);
  if (!projects.length) notFound();

  return (
    <SemesterProjects
      semester={sem}
      semesters={semesters}
      projects={projects}
    />
  );
}

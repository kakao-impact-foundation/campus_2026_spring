import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SemesterStories from "@/components/SemesterStories";
import {
  cohortTitle,
  getStoriesBySemester,
  getStorySemesters,
} from "@/lib/stories";
import { semesterLabel } from "@/lib/semesters";

// 지난 학기(기수) 스토리 목록. 최신 학기는 /stories 가 담당하므로 여기서 제외한다.
// 정적 export: 시트에 있는 학기만 미리 생성하고, 그 외 경로는 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const semesters = await getStorySemesters();
  return semesters.slice(1).map((sem) => ({ sem }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sem: string }>;
}): Promise<Metadata> {
  const { sem } = await params;
  const title = `${cohortTitle(sem)} 스토리 — 테크포임팩트 캠퍼스`;
  const description = `${semesterLabel(sem)} 캠퍼스 크리에이터들이 기록한 현장의 이야기와 숏폼.`;
  return { title, description, openGraph: { title, description } };
}

export default async function StorySemesterPage({
  params,
}: {
  params: Promise<{ sem: string }>;
}) {
  const { sem } = await params;
  const [stories, semesters] = await Promise.all([
    getStoriesBySemester(sem),
    getStorySemesters(),
  ]);
  if (!stories.length) notFound();

  return (
    <SemesterStories semester={sem} semesters={semesters} stories={stories} />
  );
}

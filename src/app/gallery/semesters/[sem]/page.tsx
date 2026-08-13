import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SemesterGallery from "@/components/SemesterGallery";
import { getGalleriesBySemester, getGallerySemesters } from "@/lib/gallery";
import { semesterLabel } from "@/lib/semesters";

// 지난 학기 갤러리 목록. 최신 학기는 /gallery 가 담당하므로 여기서 제외한다.
// 정적 export: 시트에 있는 학기만 미리 생성하고, 그 외 경로는 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const semesters = await getGallerySemesters();
  return semesters.slice(1).map((sem) => ({ sem }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sem: string }>;
}): Promise<Metadata> {
  const { sem } = await params;
  const title = `${semesterLabel(sem)} 갤러리 — 테크포임팩트 캠퍼스`;
  const description = `${semesterLabel(sem)} 성과발표회 현장 사진 갤러리.`;
  return { title, description, openGraph: { title, description } };
}

export default async function GallerySemesterPage({
  params,
}: {
  params: Promise<{ sem: string }>;
}) {
  const { sem } = await params;
  const [galleries, semesters] = await Promise.all([
    getGalleriesBySemester(sem),
    getGallerySemesters(),
  ]);
  if (!galleries.length) notFound();

  return (
    <SemesterGallery
      semester={sem}
      semesters={semesters}
      galleries={galleries}
    />
  );
}

import type { Metadata } from "next";
import SemesterGallery from "@/components/SemesterGallery";
import { getGalleriesBySemester, getGallerySemesters } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "갤러리 — 테크포임팩트 캠퍼스",
  description: "대학별 성과발표회 현장 사진 갤러리.",
};

// /gallery 는 데이터가 있는 최신 학기를 보여준다. 지난 학기는 /gallery/semesters/[sem].
export default async function GalleryList() {
  const semesters = await getGallerySemesters();
  const semester = semesters[0];
  const galleries = semester ? await getGalleriesBySemester(semester) : [];

  return (
    <SemesterGallery
      semester={semester ?? ""}
      semesters={semesters}
      galleries={galleries}
    />
  );
}

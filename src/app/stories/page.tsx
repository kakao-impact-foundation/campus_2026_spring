import type { Metadata } from "next";
import SemesterStories from "@/components/SemesterStories";
import { getStoriesBySemester, getStorySemesters } from "@/lib/stories";

export const metadata: Metadata = {
  title: "스토리 — 테크포임팩트 캠퍼스",
  description: "캠퍼스 크리에이터들이 기록한 현장의 이야기와 숏폼.",
};

// /stories 는 데이터가 있는 최신 학기(기수)를 보여준다. 지난 학기는 /stories/semesters/[sem].
export default async function Stories() {
  const semesters = await getStorySemesters();
  const semester = semesters[0];
  const stories = semester ? await getStoriesBySemester(semester) : [];

  return (
    <SemesterStories
      semester={semester ?? ""}
      semesters={semesters}
      stories={stories}
    />
  );
}

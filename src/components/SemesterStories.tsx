import SemesterSelect from "@/components/SemesterSelect";
import StoriesTable from "@/components/StoriesTable";
import {
  type Story,
  cohortTitle,
  storyOptionLabel,
  storySemesterHref,
} from "@/lib/stories";
import { semesterEyebrow } from "@/lib/semesters";

// 스토리 목록 본문 — /stories(최신 학기)와 /stories/semesters/[sem] 이 공유한다.
// 히어로는 학기(기수) 기준: "Tech for Impact · 2026 Spring" + "캠퍼스 크리에이터 3기".
export default function SemesterStories({
  semester,
  semesters,
  stories,
}: {
  semester: string;
  semesters: string[]; // 드롭다운 목록 (최신순)
  stories: Story[]; // 해당 학기 스토리
}) {
  const creators = new Set(stories.map((s) => s.name).filter(Boolean)).size;

  // 드롭다운 항목별 이동 경로·표기 (최신 학기 = /stories, 지난 학기 = /stories/semesters/<학기>)
  const latest = semesters[0];
  const hrefs = Object.fromEntries(
    semesters.map((s) => [s, storySemesterHref(s, latest)]),
  );
  const labels = Object.fromEntries(
    semesters.map((s) => [s, storyOptionLabel(s)]),
  );

  return (
    <>
      {/* Hero */}
      <div className="pt-14 pb-10">
        <div className="mx-auto max-w-[1280px] px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {semesterEyebrow(semester)}
          </span>
          <h2 className="mt-3.5 font-kakao text-[54px] font-extrabold leading-[1.08] tracking-[-0.03em] max-md:text-4xl">
            {cohortTitle(semester)}
          </h2>
          <p className="mt-5 text-[18px] text-[#555]">
            <b className="font-bold text-ink">{creators}</b>명의 캠퍼스
            크리에이터들이 기록한 현장의 이야기를 들려드립니다
          </p>
        </div>
      </div>

      <StoriesTable
        stories={stories}
        semesterSelect={
          semesters.length > 1 ? (
            <SemesterSelect
              semester={semester}
              semesters={semesters}
              hrefs={hrefs}
              labels={labels}
            />
          ) : null
        }
      />
    </>
  );
}

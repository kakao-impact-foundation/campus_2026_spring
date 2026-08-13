import Link from "next/link";
import CopyFolderButton from "@/components/CopyFolderButton";
import SemesterSelect from "@/components/SemesterSelect";
import {
  type Gallery,
  formatDate,
  getFolderImageIds,
  driveThumb,
  folderShareUrl,
  gallerySemesterHref,
} from "@/lib/gallery";
import { semesterEyebrow } from "@/lib/semesters";

// 갤러리 목록 본문 — /gallery(최신 학기)와 /gallery/semesters/[sem] 이 공유한다.
export default async function SemesterGallery({
  semester,
  semesters,
  galleries,
}: {
  semester: string;
  semesters: string[]; // 드롭다운 목록 (최신순)
  galleries: Gallery[]; // 해당 학기 갤러리
}) {
  // 카드 썸네일 = 각 폴더의 첫 번째 사진
  const cards = await Promise.all(
    galleries.map(async (g) => {
      const cover = g.folderId ? ((await getFolderImageIds(g.folderId))[0] ?? null) : null;
      return { ...g, cover };
    }),
  );

  // 드롭다운 항목별 이동 경로 (최신 학기 = /gallery, 지난 학기 = /gallery/semesters/<학기>)
  const latest = semesters[0];
  const hrefs = Object.fromEntries(
    semesters.map((s) => [s, gallerySemesterHref(s, latest)]),
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
            성과발표회 갤러리
          </h2>
          <p className="mt-5 text-[18px] text-[#555]">
            한 학기의 여정을 마무리하는 성과발표회 현장의 순간들을 담았습니다
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-8 pb-24">
        {/* 학기 전환 — 카드 그리드 상단 우측 (프로젝트 탭과 동일) */}
        {semesters.length > 1 && (
          <div className="mb-6 flex justify-end">
            <SemesterSelect
              semester={semester}
              semesters={semesters}
              hrefs={hrefs}
            />
          </div>
        )}

        {/* 대학별 카드 */}
        <div className="grid grid-cols-3 gap-4 max-[780px]:grid-cols-2 max-[540px]:grid-cols-1">
          {cards.map((g) => (
            <div
              key={g.id}
              className="group relative overflow-hidden rounded-[18px] bg-soft transition hover:-translate-y-[3px]"
            >
              <Link
                href={`/gallery/${g.id}`}
                className="block focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-[3px] focus-visible:outline-accent"
              >
                <div className="aspect-[16/10] overflow-hidden bg-soft2">
                  {g.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={driveThumb(g.cover, 800)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-[13px] font-semibold text-muted">
                      준비 중
                    </div>
                  )}
                </div>
                <div className="px-[20px] py-[16px]">
                  <div className="text-[12.5px] font-semibold text-muted">
                    {formatDate(g.date)}
                  </div>
                  <div className="mt-1 text-[20px] font-extrabold tracking-[-0.015em]">
                    {g.school}
                  </div>
                </div>
              </Link>

              {/* 썸네일 우측 상단: 폴더 링크 복사 */}
              {g.folderId && (
                <CopyFolderButton
                  url={folderShareUrl(g.folderId)}
                  className="absolute top-3 right-3 z-10"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

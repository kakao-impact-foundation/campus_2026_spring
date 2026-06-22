import type { Metadata } from "next";
import Link from "next/link";
import CopyFolderButton from "@/components/CopyFolderButton";
import {
  getGalleries,
  formatDate,
  getFolderImageIds,
  driveThumb,
  folderShareUrl,
} from "@/lib/gallery";

export const metadata: Metadata = {
  title: "갤러리 — 테크포임팩트 캠퍼스",
  description: "대학별 성과발표회 현장 사진 갤러리.",
};

export default async function GalleryList() {
  const galleries = await getGalleries();
  // 카드 썸네일 = 각 폴더의 첫 번째 사진
  const cards = await Promise.all(
    galleries.map(async (g) => {
      const cover = g.folderId ? ((await getFolderImageIds(g.folderId))[0] ?? null) : null;
      return { ...g, cover };
    }),
  );

  return (
    <>
      {/* Hero */}
      <div className="pt-14 pb-10">
        <div className="mx-auto max-w-[1280px] px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Tech for Impact · 2026 Spring
          </span>
          <h2 className="mt-3.5 font-kakao text-[54px] font-extrabold leading-[1.08] tracking-[-0.03em] max-md:text-4xl">
            성과발표회 갤러리
          </h2>
          <p className="mt-5 text-[18px] text-[#555]">
            한 학기의 여정을 마무리하는 성과발표회 현장의 순간들을 담았습니다
          </p>
        </div>
      </div>

      {/* 대학별 카드 */}
      <div className="mx-auto max-w-[1280px] px-8 pb-24">
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

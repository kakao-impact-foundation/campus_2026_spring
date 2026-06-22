import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/components/CopyLinkButton";
import PhotoGrid from "@/components/PhotoGrid";
import {
  getGalleries,
  getGalleryById,
  folderShareUrl,
  getFolderImageIds,
  formatDate,
} from "@/lib/gallery";

// 정적 export: 모든 갤러리 상세를 빌드 시 생성, 그 외 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGalleries()).map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const g = await getGalleryById(id);
  if (!g) return {};
  return { title: `${g.school} 성과발표회 갤러리 — 테크포임팩트 캠퍼스` };
}

export default async function GalleryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const g = await getGalleryById(id);
  if (!g) notFound();

  const photoIds = g.folderId ? await getFolderImageIds(g.folderId) : [];

  return (
    <div className="pt-[30px] pb-[110px]">
      <div className="mx-auto max-w-[1280px] px-8">
        <Link
          href="/gallery"
          className="inline-block text-[13.5px] font-semibold text-muted hover:text-ink"
        >
          ← 갤러리
        </Link>

        {/* Hero */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Gallery · {formatDate(g.date)}
            </span>
            <h1 className="mt-2.5 font-kakao text-[40px] font-extrabold leading-[1.1] tracking-[-0.03em] max-md:text-[30px]">
              {g.school} 성과발표회
            </h1>
          </div>
          {g.folderId && <CopyLinkButton url={folderShareUrl(g.folderId)} />}
        </div>

        {/* 구분선 */}
        <hr className="mt-7 border-t border-black/10" />

        {/* 사진 — 파일명 없는 카드 그리드 (점진 로딩) */}
        {photoIds.length > 0 ? (
          <div className="mt-8">
            <PhotoGrid ids={photoIds} />
          </div>
        ) : (
          <div className="mt-8 py-24 text-center text-muted">
            {g.folderId
              ? "사진을 불러오지 못했어요. 폴더 공개 설정을 확인해 주세요."
              : `${g.school} 성과발표회 사진은 곧 공개됩니다.`}
          </div>
        )}
      </div>
    </div>
  );
}

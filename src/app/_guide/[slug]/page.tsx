import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allDocs, findDoc, headings, neighbors, sectionOf } from "@/lib/guide";
import GuideBody from "@/components/guide/GuideBody";
import GuideToc from "@/components/guide/GuideToc";
import GuidePager from "@/components/guide/GuidePager";

// 정적 export: 빌드 시 모든 가이드 문서를 미리 생성하고, 그 외 경로는 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = findDoc(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} — 참가자 가이드`,
    description: doc.summary,
  };
}

export default async function GuideDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = findDoc(slug);
  if (!doc) notFound();

  const section = sectionOf(slug);
  const { prev, next } = neighbors(slug);

  return (
    <div className="flex items-start gap-8">
      <article className="min-w-0 flex-1 pt-14 pb-20 max-lg:pt-4">
        {/* 문서 헤더 */}
        <header className="border-hair mb-10 border-b pb-8">
          {section && (
            <div className="font-kakao text-muted mb-2.5 text-[13px] font-bold tracking-[0.04em]">
              {section}
            </div>
          )}
          <h1 className="font-kakao text-ink text-[34px] leading-[1.2] font-extrabold tracking-[-0.03em] max-md:text-[27px]">
            {doc.title}
          </h1>
          <p className="mt-3.5 max-w-[620px] text-[16.5px] leading-[1.75] break-keep text-[#666]">
            {doc.summary}
          </p>
        </header>

        <GuideBody blocks={doc.blocks} />
        <GuidePager prev={prev} next={next} />
      </article>

      <GuideToc items={headings(doc)} />
    </div>
  );
}

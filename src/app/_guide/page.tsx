import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE, allDocs } from "@/lib/guide";

export const metadata: Metadata = {
  title: "참가자 가이드 — 테크포임팩트 캠퍼스",
  description: "테크포임팩트 캠퍼스 참가자를 위한 운영 매뉴얼",
};

// 가이드 홈 — 전체 문서 인덱스.
export default function GuideHome() {
  const first = allDocs()[0];

  return (
    <div className="pt-14 pb-20 max-lg:pt-4">
      {/* 타이틀 */}
      <div className="border-hair mb-12 border-b pb-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="bg-accent font-kakao rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-[#1C1C1C]">
            초안
          </span>
          <span className="font-kakao text-muted text-[13px] font-bold tracking-[0.04em]">
            2026년 2학기
          </span>
        </div>
        <h1 className="font-kakao text-ink text-[42px] leading-[1.15] font-extrabold tracking-[-0.03em] max-md:text-[31px]">
          참가자{" "}
          <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
            가이드
          </span>
        </h1>
        <p className="mt-4 max-w-[600px] text-[17px] leading-[1.75] break-keep text-[#555]">
          한 학기 동안 무엇을 언제 어떻게 하는지 정리한 매뉴얼입니다. 왼쪽
          목차에서 필요한 문서로 바로 이동할 수 있습니다.
        </p>

        {first && (
          <Link
            href={`/guide/${first.slug}`}
            className="font-kakao mt-7 inline-flex items-center gap-1.5 rounded-full bg-[#1C1C1C] px-[22px] py-3 text-[14px] font-bold text-white transition hover:bg-[#333]"
          >
            처음부터 읽기
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 3.5L11.5 9L6 14.5" />
            </svg>
          </Link>
        )}
      </div>

      {/* 섹션별 문서 목록 */}
      <div className="flex flex-col gap-12">
        {GUIDE.map((section, si) => (
          <section key={section.title}>
            <div className="mb-4 flex items-baseline gap-2.5">
              <span className="font-kakao text-muted text-[13px] font-bold">
                {String(si + 1).padStart(2, "0")}
              </span>
              <h2 className="font-kakao text-ink text-[20px] font-extrabold tracking-[-0.02em]">
                {section.title}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
              {section.docs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/guide/${doc.slug}`}
                  className="group bg-soft hover:bg-soft2 flex flex-col gap-1.5 rounded-[16px] p-[20px_22px] transition hover:-translate-y-[2px]"
                >
                  <span className="text-ink text-[16.5px] leading-[1.4] font-bold">
                    {doc.title}
                  </span>
                  <span className="text-[14px] leading-[1.6] break-keep text-[#666]">
                    {doc.summary}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

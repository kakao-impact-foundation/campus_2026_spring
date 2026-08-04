import type { Metadata } from "next";
import { getInnovators, orderedSchools } from "@/lib/2026-fall";
import InnovatorsList from "@/components/2026-fall/List";

export const metadata: Metadata = {
  title: "2학기 프로젝트 주제 · 사회혁신가 — 테크포임팩트 캠퍼스",
  description:
    "2026년 2학기 대학생 팀과 함께할 사회혁신가와 프로젝트 주제를 소개합니다",
};

// 26-2학기 사회혁신가 목록 (/2026-fall) — GNB "2026 Fall" 메뉴가 가리키는 페이지.
export default async function InnovatorsPage() {
  const innovators = await getInnovators();
  const schools = orderedSchools(innovators);
  return (
    <div className="mx-auto max-w-[1280px] px-8 pt-14 pb-20 break-keep">
      {/* 타이틀 */}
      <div className="mb-10">
        <span className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">
          Tech for Impact · 2026 Fall
        </span>
        <h1 className="font-kakao mt-3.5 text-[54px] leading-[1.08] font-extrabold tracking-[-0.03em] max-md:text-4xl">
          26-2학기 사회혁신가
        </h1>
        <p className="mt-5 text-[18px] text-[#555]">
          <b className="text-ink font-bold">22인의 사회혁신가</b>가 테크포임팩트
          캠퍼스 여정을 함께합니다.
          {/* 강제 줄바꿈은 데스크톱에서만 — 모바일은 자연스럽게 흐르게 둔다 */}
          <br className="max-md:hidden" /> 현장의 문제를 가장 가까이에서
          마주해온 사회혁신가들과 함께, 지역에 필요한 돕는 기술을 기획하고
          만들어가는 여정을 시작해 보세요.
        </p>
      </div>

      <InnovatorsList innovators={innovators} schools={schools} />
    </div>
  );
}

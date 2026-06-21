import type { Metadata } from "next";
import StoriesTable from "@/components/StoriesTable";
import { getStories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "스토리 — 테크포임팩트 캠퍼스",
  description: "캠퍼스 크리에이터들이 기록한 현장의 이야기와 숏폼.",
};

export default async function Stories() {
  const stories = await getStories();

  return (
    <>
      {/* Hero */}
      <div className="pt-14 pb-10">
        <div className="mx-auto max-w-[1280px] px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Tech for Impact · 2026 Spring
          </span>
          <h2 className="mt-3.5 text-[54px] font-extrabold leading-[1.08] tracking-[-0.03em] max-md:text-4xl">
            캠퍼스 크리에이터
          </h2>
          <p className="mt-5 text-[18px] text-[#555]">
            <b className="font-bold text-ink">9</b>명의 캠퍼스 크리에이터들이 기록한 현장의 이야기를 들려드립니다
          </p>
        </div>
      </div>

      <StoriesTable stories={stories} />
    </>
  );
}

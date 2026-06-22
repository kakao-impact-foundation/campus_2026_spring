import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Embed from "@/components/Embed";
import AwardBadge from "@/components/AwardBadge";
import { getAllProjects, getProjectById } from "@/lib/projects";
import { CATEGORY_COLOR } from "@/lib/categories";
import { Project } from "@/lib/types";

// 정적 export: 빌드 시 모든 프로젝트 상세를 미리 생성하고, 그 외 경로는 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return {};
  return {
    title: `${project.name} — 테크포임팩트 캠퍼스`,
    description: project.oneLiner,
  };
}

// 스토리 5문항 제목 (순서 고정)
const STORY_ORDER: { key: keyof Project["story"]; title: string }[] = [
  { key: "problem", title: "우리가 주목한 문제" },
  { key: "solution", title: "우리가 만든 '돕는 기술'" },
  { key: "challenge", title: "가장 도전적이었던 순간" },
  { key: "progress", title: "지금 어디까지 왔나" },
  { key: "reflection", title: "한 학기를 돌아보며" },
];

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProjectById(id);
  if (!p) notFound();

  const cat = p.category;
  // 상세 액센트 = 그 프로젝트의 카테고리 테마색 (없으면 카카오 옐로우)
  const accent = cat ? CATEGORY_COLOR[cat] : "var(--color-accent)";
  const story = STORY_ORDER.filter(({ key }) => p.story[key].trim());

  // 팀원 = 팀장 + 팀원 구분 없이 (시트의 쉼표/가운뎃점 구분 모두 정규화)
  const teamMembers = [p.leader, ...p.members.split(/\s*[,·]\s*/)]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" · ");

  // 진행 단계: "프로토타입 완성 (설명)" → 라벨 / 설명 분리
  const stageMatch = p.stage.match(/^(.*?)\s*\((.*)\)\s*$/);
  const stageLabel = (stageMatch ? stageMatch[1] : p.stage).trim();
  const stageNote = stageMatch ? stageMatch[2].trim() : "";

  const techTags = p.techStack.split(/,\s*/).filter(Boolean);

  // 다중 이름(쉼표 구분) → 가운뎃점 표기
  const joinNames = (s: string) =>
    s
      .split(/\s*,\s*/)
      .filter(Boolean)
      .join(" · ");
  const advisorsText = joinNames(p.advisors) || "추후 공개";
  const mentorsText = joinNames(p.mentors) || "추후 공개";
  // 사회혁신가 = 조직명 (+ 담당자 성함·직함)
  const innovatorText = [p.org, p.innovator].filter(Boolean).join(" · ");

  return (
    <div
      className="px-8 pt-[30px] pb-[110px]"
      style={{ ["--cat" as string]: accent }}
    >
      <div className="mx-auto max-w-[800px]">
        <Link
          href="/"
          className="inline-block text-[13.5px] font-semibold text-muted hover:text-ink"
        >
          ← 목록으로
        </Link>

        {/* ───────── 섹션 1 · 헤더 + 팀 정보 ───────── */}
        <div className="mt-6 mb-3.5 flex flex-wrap items-center gap-2.5 text-sm">
          {cat && (
            <span className="inline-flex items-center gap-[7px] font-bold text-ink">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              {cat}
            </span>
          )}
          {p.award && <AwardBadge label={p.award} className="px-3" />}
        </div>

        <h1 className="mb-3.5 font-kakao text-[46px] font-extrabold leading-[1.12] tracking-[-0.03em] max-md:text-[32px]">
          {p.name}
        </h1>
        <p className="text-[18px] leading-[1.5] text-[#444]">{p.oneLiner}</p>
        {/* 팀 크레딧 — 채운 회색 패널(섹션 2의 외곽선 카드와 구분) */}
        <dl className="mt-8 divide-y divide-black/[0.05] rounded-2xl bg-soft px-7">
          <SpecRow k="소속 · 팀" v={`${p.school} · ${p.team}`} />
          <SpecRow k="팀원" v={teamMembers} />
          <SpecRow k="지도교수" v={advisorsText} />
          <SpecRow k="사회혁신가" v={innovatorText} />
          <SpecRow k="카카오멘토" v={mentorsText} />
        </dl>

        {/* ───────── 섹션 2 · 돕는기술 소개 ───────── */}
        <section className="mt-14">
          <SectionHead n="01">돕는기술 소개</SectionHead>

          <Embed url={p.videoUrl} kind="video" label="시연 영상" />

          {/* 프로젝트 정보 표 — 테두리 박스(팀 크레딧과 구분) */}
          <dl className="mt-7 divide-y divide-black/[0.06] rounded-2xl border border-[#e6e6e6] px-7">
            <SpecRow k="결과물·핵심 기술" v={p.outputTech} />
            <SpecRow k="현재 진행 단계" v={stageLabel} note={stageNote} />
            <SpecRow k="사용 기술 스택" tags={techTags} />
            <SpecRow k="서비스 바로가기" href={p.serviceUrl} />
            <SpecRow k="Github 링크" href={p.repoUrl} />
            {/* <SpecRow k="유튜브 링크" href={p.youtubeUrl} /> */}
          </dl>
        </section>

        {/* ───────── 섹션 3 · 돕는기술 이야기 ───────── */}
        {story.length > 0 && (
          <section className="mt-16">
            <SectionHead n="02">돕는기술 이야기</SectionHead>
            <div>
              {story.map(({ key, title }, i) => (
                <div
                  key={key}
                  className="py-[30px] first:pt-0 [&+div]:border-t [&+div]:border-black/15"
                >
                  <h3 className="mb-4 flex items-center gap-3 text-[22px] font-extrabold tracking-[-0.02em]">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-ink"
                      style={{ background: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {title}
                  </h3>
                  <p className="whitespace-pre-line text-[15.5px] leading-[1.85] text-[#333]">
                    {p.story[key]}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ───────── 섹션 4 · 발표 자료 ───────── */}
        <section className="mt-16">
          <SectionHead n="03">발표 자료</SectionHead>
          <Embed url={p.deckUrl} kind="doc" label="발표 자료 · PDF" />
        </section>
      </div>
    </div>
  );
}

function SectionHead({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-7 text-[14px] font-bold tracking-[0.01em] text-ink">
      SECTION {n}. {children}
    </h2>
  );
}

function SpecRow({
  k,
  v,
  note,
  href,
  tags,
}: {
  k: string;
  v?: string;
  note?: string;
  href?: string | null;
  tags?: string[];
}) {
  // href 행: 값이 있으면 링크, 없으면 추후 추가 자리표시
  const isLinkRow = href !== undefined;
  return (
    <div className="flex gap-5 py-[18px] max-md:flex-col max-md:gap-1">
      <dt className="w-[110px] flex-none pt-px text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">
        {k}
      </dt>
      <dd className="min-w-0 text-[15px] leading-[1.5]">
        {tags ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex rounded-full bg-soft px-3 py-1 text-[13px] font-medium text-ink ring-1 ring-black/5"
              >
                {t}
              </span>
            ))}
          </div>
        ) : isLinkRow ? (
          href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium break-all text-ink underline decoration-[#ccc] underline-offset-2 hover:decoration-ink"
            >
              {href}
            </a>
          ) : (
            <span className="text-[13px] text-muted">추후 추가 예정</span>
          )
        ) : (
          v
        )}
        {note && (
          <span className="mt-1 block text-[13px] text-muted">{note}</span>
        )}
      </dd>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import FeaturedProjects from "@/components/FeaturedProjects";
import ApplyButton from "@/components/ApplyButton";
import { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "사회혁신가 모집 — 테크포임팩트 캠퍼스",
  description:
    "대학생들과 함께 사회문제를 ‘돕는 기술’로 해결해 나갈 사회혁신조직을 모집합니다",
};

// 대표 프로젝트 = 큐레이션한 6개 (지정 순서대로 노출).
// 시트 행 순서로 id가 바뀔 수 있어 이름 기준(공백 무시)으로 매칭한다.
const FEATURED_NAMES = [
  "다람쥐 택시 프로젝트", // 지역소멸
  "HERO", // 지역소멸
  "Ogoo", // 마음건강
  "나란히", // 사회적포용
  "도란도란", // 사회적포용
  "시원한 길", // 기후
];
function featuredProjects(projects: Project[]): Project[] {
  const norm = (s: string) => s.replace(/\s/g, "");
  const byName = new Map(projects.map((p) => [norm(p.name), p]));
  return FEATURED_NAMES.map((n) => byName.get(norm(n))).filter(
    (p): p is Project => Boolean(p),
  );
}

// 지원(구글 폼) 링크 — 상단 버튼·신청 방법·하단 CTA 공통.
const APPLY_URL = "https://forms.gle/8qbE1hWpAeVDRkZA7";

// ── 섹션 데이터 (초안 — 실제 모집 내용 확정 후 교체) ──
const TARGET_SPECS: { k: string; v: React.ReactNode }[] = [
  {
    k: "모집 대상",
    v: "사회문제 해결 활동을 이어오고 있는 비영리단체, NGO, 사회적기업, 소셜벤처, 스타트업, 공공기관 등",
  },
  {
    k: "모집 분야",
    v: "교육, 장애, 돌봄, 기후·환경, 지역, 건강·복지, 사회적 포용 등 다양한 사회문제 해결 분야",
  },
  { k: "모집 규모", v: "25개 팀 내외" },
  { k: "모집 기간", v: "2026.07.01.(수) ~ 07.15.(수) 23:59" },
  { k: "최종 선정", v: "2026.07.17.(금) 개별 안내" },
  {
    k: "신청 방법",
    v: (
      <a
        href={APPLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[15px] font-semibold text-ink transition hover:opacity-70"
      >
        온라인 신청 폼 작성하기
        <svg
          width="13"
          height="13"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4.5 13.5L13.5 4.5M13.5 4.5H6M13.5 4.5V12" />
        </svg>
      </a>
    ),
  },
];

const BENEFITS = [
  {
    title: "돕는 기술 결과물",
    desc: "학생들이 만든 다양한 결과물을 통해 현장에 필요한 기술 아이디어와 새로운 해결 가능성을 살펴볼 수 있습니다.",
    icon: (
      <>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </>
    ),
  },
  {
    title: "현장 적용 지원",
    desc: "프로젝트의 후속 활동과 현장 적용을 함께 검토하며, 필요 시 재단과 협의를 통해 추가 지원을 연계합니다.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  },
  {
    title: "홍보 및 확산",
    desc: "카카오임팩트 채널과 성과발표회를 통해 참여 조직의 활동과 프로젝트를 더 많은 사람들에게 알릴 수 있습니다.",
    icon: (
      <>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
  },
  {
    title: "활동비 지원",
    desc: "한 학기 동안 학생들과 함께하는 사회혁신 조직에는 조직당 활동 지원비 200만 원(세전)을 제공합니다.",
    icon: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        <path d="M7 6h1v4" />
        <path d="m16.71 13.88.7.71-2.82 2.82" />
      </>
    ),
  },
];

// 사회혁신가 참여 여정 (월별 타임라인)
const JOURNEY: {
  month: string;
  title: string;
  mode: string;
  desc: React.ReactNode;
}[] = [
  {
    month: "7월",
    title: "사회혁신가 OT",
    mode: "온라인",
    desc: (
      <>
        프로그램의 취지와 운영 방식, 주요 일정을 안내합니다.
        <br />
        사회혁신가는 학기 중 역할과
        참여 방식을 함께 확인합니다.
      </>
    ),
  },
  {
    month: "8월",
    title: "개강 워크숍",
    mode: "온라인",
    desc: (
      <>
        교수진, 사회혁신가, 카카오 멘토, 학생들이 함께 한 학기 프로젝트를
        시작합니다.
        <br />
        사회혁신가는 현장의 사회문제를
        소개하고, 학생들은 관심 있는 주제를 선택해 팀을 구성합니다.
      </>
    ),
  },
  {
    month: "9~11월",
    title: "멘토링 & 필드트립",
    mode: "온·오프라인",
    desc: (
      <>
        학생들과 프로젝트를 함께 발전시키며 문제 정의와 프로젝트 방향에 피드백을
        제공합니다.
        <br />
        학생들을 현장으로 초대해 실제 사용자와 환경을 함께 살펴보고, 문제를 깊이
        이해할 수 있도록 돕습니다.
      </>
    ),
  },
  {
    month: "10월",
    title: "중간 체크인",
    mode: "온라인",
    desc: (
      <>
        학생들이 프로젝트의 진행 상황과 중간 결과물을 공유합니다.
        <br />
        사회혁신가는 현장 관점에서
        프로젝트 방향과 보완점에 대한 피드백을 제공합니다.
      </>
    ),
  },
  {
    month: "12월",
    title: "성과발표회",
    mode: "오프라인",
    desc: (
      <>
        학교별로 학생들이 만든 최종 ‘돕는 기술’ 결과물을 발표합니다.
        <br />
        사회혁신가는 결과물에 대한
        피드백을 전하고 후속 발전 가능성을 함께 살펴봅니다.
      </>
    ),
  },
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "어떤 조직이 참여할 수 있나요? 개인도 신청할 수 있나요?",
    a: (
      <>
        <p>
          사회문제 해결 활동을 이어오고 있는 NGO, 사회적기업, 소셜벤처, 스타트업, 공공기관 등 다양한 조직이 참여할 수 있습니다.
          <br />
          개인도 신청하실 수 있습니다. 다만 지속적인 활동 기반(예: 개인사업자, 고유번호증 보유 단체 등)을 갖춘 경우를 우선적으로 검토합니다.
        </p>
      </>
    ),
  },
  {
    q: "기술에 대한 전문 지식이 없어도 참여할 수 있나요?",
    a: (
      <>
        물론입니다. 사회혁신가의 역할은 현장의 문제와 경험을 공유하고, 학생들에게 현장 관점의 피드백을 제공하는 것입니다.
        <br />
        사회혁신가는 현장의 전문성을, 학생들과 카카오 멘토는 기술을 더해 함께 ‘돕는 기술’을 만들어갑니다.
      </>
    ),
  },
  {
    q: "기술 서비스를 운영하고 있어야 하나요?",
    a: (
      <>
        아닙니다. 기술 서비스를 운영하고 있지 않아도 괜찮습니다.
        <br />
        해결하고 싶은 사회문제가 있고, 기술을 활용한 새로운 해결 가능성을 함께
        탐색해보고 싶다면 지원하실 수 있습니다.
      </>
    ),
  },
  {
    q: "어떤 사회문제를 제안할 수 있나요?",
    a: (
      <>
        교육, 장애, 돌봄, 기후·환경, 지역, 건강·복지, 사회적 포용 등 분야와
        관계없이 다양한 사회문제를 제안하실 수 있습니다.
        <br />
        다음 세대인 대학생들에게 현장의 문제를 전하고, 함께 해결 가능성을 탐색해보고 싶은 사회문제라면 모두 환영합니다.
      </>
    ),
  },
  {
    q: "얼마나 참여해야 하나요? 꼭 오프라인으로 참여해야 하나요?",
    a: (
      <>
        학기 중 월 1~2회 내외의 정기 활동에 참여하며, 학생들과는 프로젝트 진행에 맞춰 함께 소통합니다.
        <br />
        필드트립과 성과발표회는 오프라인으로 진행되며, 세부 일정은 7월 사회혁신가 OT 이후 함께 조율할 예정입니다.
      </>
    ),
  },
  {
    q: "사회혁신가는 몇 개 팀과 함께하나요?",
    a: (
      <>
        2026년 2학기에는 전국 12개 대학이 참여하며, 사회혁신가 한 분당 약 3~4개 학생팀과 함께합니다.
        <br />
        학생들의 다양한 전공과 배경을 바탕으로 여러 ‘돕는 기술’ 아이디어를 만나볼 수 있습니다.
      </>
    ),
  },
  {
    q: "어떤 기준으로 사회혁신가를 선발하나요?",
    a: (
      <>
        사회혁신가의 활동 경험과 전문성, 학생들과의 협업 가능성, 사회문제의 구체성과 기술 활용 가능성 등을 종합적으로 검토합니다.
        <br />
        또한 2026년 2학기에는 전국 12개 대학이 함께하는 만큼, 다양한 분야와 지역의 사회문제가 균형 있게 반영될 수 있도록 함께 고려해 선발합니다.
      </>
    ),
  },
  {
    q: "학생들이 만든 결과물을 실제 현장에 활용할 수 있나요?",
    a: (
      <>
        사회혁신가와 학생들이 현장 적용을 희망하는 프로젝트는 후속 활동과 추가 지원을 통해 실제 현장 적용 가능성을 함께 모색합니다.
        <br />
        ‘돕는 기술’이 실제 사회 변화로 이어지고, 다음 세대 사회혁신가가 성장할 수 있도록 함께 지원합니다.
      </>
    ),
  },
  {
    q: "활동 지원비는 어떻게 지급되나요?",
    a: (
      <>
        선발된 사회혁신 조직에는 한 학기 활동을 위한 조직당 활동 지원비 200만 원(세전)을 지급합니다.
        <br />
        활동 지원비는 학기 초 지급되며, 세부 일정과 방법은 사회혁신가 OT에서 안내드립니다.
      </>
    ),
  },
];

// 참여 대학 (2023~2026-1, 전국 19개교).
// logo: public/logos/ 에 파일을 넣고 경로를 채우면 로고로 표시, 없으면 학교명 텍스트.
const SCHOOLS: { name: string; logo?: string }[] = [
  { name: "가천대학교" },
  { name: "경운대" },
  { name: "고려대학교(세종)" },
  { name: "단국대학교" },
  { name: "동국대학교" },
  { name: "부산외대" },
  { name: "서강대학교" },
  { name: "서울대학교" },
  { name: "서울시립대학교" },
  { name: "서울여자대학교" },
  { name: "연세대학교" },
  { name: "이화여자대학교" },
  { name: "한동대학교" },
  { name: "한라대" },
  { name: "한양대학교" },
  { name: "대구경북과학기술원(DGIST)" },
  { name: "광주과학기술원(GIST)" },
  { name: "한국과학기술원(KAIST)" },
  { name: "울산과학기술원(UNIST)" },
];

export default async function Partner() {
  const featured = featuredProjects(await getAllProjects());
  return (
    <>
      {/* Hero */}
      <div className="pt-14 pb-10">
        <div className="mx-auto max-w-[1280px] px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Tech for Impact · Partner
          </span>
          <h2 className="mt-3.5 font-kakao text-[54px] font-extrabold leading-[1.08] tracking-[-0.03em] max-md:text-4xl">
            함께할 사회혁신가를
            <br className="md:hidden" /> 찾습니다
          </h2>
          <p className="mt-5 max-w-[640px] text-[18px] text-[#555]">
            대학생들과 함께 사회문제를 ‘돕는 기술’로 해결해 나갈 사회혁신조직을 모집합니다.
          </p>
          <ApplyButton
            href={APPLY_URL}
            deadline="2026-07-15"
            className="mt-7"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-8 pb-24">
        {/* 01 · 모집 취지·소개 */}
        <Section
          n="01"
          title={
            <>
              사회 현장에서 시작하는{" "}
              <span className="bg-[linear-gradient(transparent_62%,#FFEA2C_62%)] bg-no-repeat">
                테크포임팩트 캠퍼스
              </span>
            </>
          }
        >
          <div className="flex flex-col gap-5 text-[16px] leading-[1.8] text-[#444]">
            <p>
              카카오임팩트는 기술을 통해 사회문제 해결에 기여하는 경험을 확산하기
              위해 2023년부터{" "}
              <b className="font-semibold text-ink">「테크포임팩트 캠퍼스」</b>를
              운영하고 있습니다.
              <br />
              대학생들이 실제 사회문제를 탐구하고 AI·디지털 기술을 활용해 해결책을
              기획·개발하는 프로젝트형 수업입니다.
              <br />
              이 수업은 교수, 사회혁신가, 카카오 멘토가 함께하는{" "}
              <b className="font-semibold text-ink">컬렉티브 임팩트(Collective Impact)</b> 모델을
              기반으로 운영됩니다.
            </p>
            <p>
              학생들은 사회혁신가와 함께 사회문제 해결에 필요한 기술을 만들고,
              카카오임팩트는 이러한 기술을{" "}
              <b className="font-semibold text-ink">‘돕는 기술’</b>이라 부릅니다.
              <br />
              이를 위해 사회혁신가는 실제 현장의 문제와 경험을 학생들에게
              공유하고, 결과물에 대한 현장 관점의 피드백을 제공합니다.
              <br />
              학생들에게 현장의 경험을 전하고, <b className="font-semibold text-ink">기술을 활용한 변화 가능성</b>을 탐색해보고 싶은 사회혁신가를 모집합니다.
            </p>
          </div>
        </Section>

        {/* 02 · 대표 프로젝트 */}
        {featured.length > 0 && (
          <Section
            n="02"
            title={
              <>
                <span className="bg-[linear-gradient(transparent_62%,#FFEA2C_62%)] bg-no-repeat">
                  돕는 기술
                </span>{" "}
                프로젝트 사례
              </>
            }
          >
            {/* 통계 문장(좌) + 전체 보러가기(우)를 한 줄에 */}
            <div className="mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start max-md:gap-3">
              <p className="max-w-[820px] text-[16px] leading-[1.85] text-[#444]">
                2023년 KAIST에서 시작한 테크포임팩트 캠퍼스 수업은 2026년
                1학기까지
                <br />
                전국 <b className="font-semibold text-ink">18개</b> 대학,{" "}
                <b className="font-semibold text-ink">487명</b>의 학생들이{" "}
                <b className="font-semibold text-ink">34개</b> 사회혁신 조직과
                함께 <b className="font-semibold text-ink">95개</b>의 ‘돕는 기술’
                프로젝트를 만들었습니다.
                {/* <br />
                지난 학기 학생들이 만든 대표 ‘돕는 기술’ 프로젝트 6개를 소개합니다. */}
              </p>
              <Link
                href="/"
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[14px] font-semibold text-muted transition hover:text-ink"
              >
                전체 보러가기
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 3.5L11.5 9L6 14.5" />
                </svg>
              </Link>
            </div>
            <FeaturedProjects projects={featured} />
          </Section>
        )}

        {/* 03 · 모집 안내 */}
        <Section
          n="03"
          title={
            <>
              사회혁신가{" "}
              <span className="bg-[linear-gradient(transparent_62%,#FFEA2C_62%)] bg-no-repeat">
                참여 안내
              </span>
            </>
          }
        >
          <p className="mb-8 max-w-[840px] text-[16px] leading-[1.8] text-[#444]">
            <b className="font-semibold text-ink">
              현장에서 해결하고 싶은 사회문제
            </b>
            가 있고,{" "}
            <b className="font-semibold text-ink">
              기술을 활용한 새로운 해결 가능성
            </b>
            을 탐색해보고 싶은 사회혁신가를 기다립니다.
            <br />
            학생들에게 현장의 경험을 전하고, 학생들이 만든 ‘돕는 기술’을 통해
            새로운 해결 가능성을 함께 발견해보세요.
          </p>
          <dl className="flex max-w-[880px] flex-col gap-3.5">
            {TARGET_SPECS.map((s) => (
              <div
                key={s.k}
                className="flex gap-3.5 max-md:flex-col max-md:gap-1"
              >
                <dt className="w-[88px] flex-none whitespace-nowrap text-[16px] font-bold text-ink">
                  {s.k}
                </dt>
                <dd className="text-[16px] leading-[1.7] text-[#444]">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 04 · 참여 혜택 */}
        <Section
          n="04"
          title={
            <>
              테크포임팩트{" "}
              <span className="bg-[linear-gradient(transparent_62%,#FFEA2C_62%)] bg-no-repeat">
                참여 혜택
              </span>
            </>
          }
        >
          <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl bg-soft px-5 py-6">
                <span className="flex size-12 items-center justify-center rounded-full bg-ground text-ink shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {b.icon}
                  </svg>
                </span>
                <h4 className="mt-5 text-[17px] font-bold text-ink">
                  {b.title}
                </h4>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#555]">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 05 · 사회혁신가 참여 여정 */}
        <Section
          n="05"
          title={
            <>
              사회혁신가{" "}
              <span className="bg-[linear-gradient(transparent_62%,#FFEA2C_62%)] bg-no-repeat">
                참여 여정
              </span>
            </>
          }
        >
          <p className="mb-10 max-w-[820px] text-[16px] leading-[1.8] text-[#444]">
            사회혁신가는 한 학기 동안{" "}
            <b className="font-semibold text-ink">월 1~2회 내외</b>의 온·오프라인
            활동에 참여합니다.
            <br />
            학생들의 ‘돕는 기술’ 프로젝트가 실제 현장과 연결될 수 있도록 경험을
            공유하고, 현장 관점의 피드백을 제공합니다.
          </p>
          {/* 월별 타임라인 */}
          <ol className="max-w-[820px]">
            {JOURNEY.map((j, i) => (
              <li key={j.title} className="flex gap-5">
                {/* 월 라벨 */}
                <div className="w-[64px] flex-none pt-0.5 text-right font-kakao text-[15px] font-bold text-ink max-[520px]:w-[52px] max-[520px]:text-[13px]">
                  {j.month}
                </div>
                {/* 레일: 점 + 연결선 */}
                <div className="flex w-3 flex-none flex-col items-center">
                  <span className="mt-1.5 size-3 flex-none rounded-full border-2 border-ink bg-ground" />
                  {i < JOURNEY.length - 1 && (
                    <span className="w-px flex-1 bg-hair" />
                  )}
                </div>
                {/* 내용 */}
                <div className={i < JOURNEY.length - 1 ? "flex-1 pb-9" : "flex-1"}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[17px] font-bold text-ink">{j.title}</h4>
                    <span className="rounded-full bg-soft px-2.5 py-0.5 text-[12px] font-semibold text-muted">
                      {j.mode}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-[1.7] text-[#555]">
                    {j.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 하단 CTA */}
        <div className="mt-20 flex flex-col items-center gap-5 rounded-[24px] bg-soft px-8 py-10 text-center">
          <blockquote className="flex max-w-[620px] flex-col items-center">
            {/* 장식용 인용부호 */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="#FAE100"
              aria-hidden
            >
              <path d="M10 5C6.7 5 4 7.7 4 11v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H7c0-1.7 1.3-3 3-3a1 1 0 1 0 0-3z" />
              <path d="M20 5c-3.3 0-6 2.7-6 6v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3c0-1.7 1.3-3 3-3a1 1 0 1 0 0-3z" />
            </svg>
            <p className="mt-4 font-kakao text-[19px] leading-[1.8] text-[#333] max-md:text-[17px]">
              첫 술에 배부를 리 없지만, 분명 아주 맛있을 거예요.
              <br />
              다음 밥상을 누구와 어떻게 차리면 좋을지, 아이디어도 생길 거고요.
            </p>
            <footer className="mt-3.5 text-[14px] font-semibold text-muted">
              최문철 · 꿈이자라는뜰사회적협동조합 조합장
            </footer>
          </blockquote>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1C1C1C] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:opacity-90"
          >
            지원하기
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4.5 13.5L13.5 4.5M13.5 4.5H6M13.5 4.5V12" />
            </svg>
          </a>
        </div>

        {/* 자주 묻는 질문 */}
        <Section
          n="06"
          title={
            <>
              사회혁신가{" "}
              <span className="bg-[linear-gradient(transparent_62%,#FFEA2C_62%)] bg-no-repeat">
                FAQ
              </span>
            </>
          }
        >
          <div className="flex flex-col divide-y divide-hair border-y border-hair">
            {FAQS.map((f) => (
              <div key={f.q} className="py-6">
                <h4 className="text-[17px] font-bold text-ink">Q. {f.q}</h4>
                <div className="mt-2.5 text-[16px] leading-[1.7] text-[#555]">
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 보류: '함께 만들어온 돕는 기술' — 내일 다시 작업 (임시 비활성) */}
        {false && (
        <Section n="07" title="함께 만들어온 ‘돕는 기술’">
          {/* 참여 대학 로고 월 — 로고 파일이 있으면 로고, 없으면 학교명 텍스트 */}
          <div className="overflow-hidden rounded-[20px] border border-hair bg-ground">
            <div className="grid grid-cols-5 gap-px bg-hair max-[900px]:grid-cols-3 max-[560px]:grid-cols-2">
              {SCHOOLS.map((s) => (
                <div
                  key={s.name}
                  className="flex h-[88px] items-center justify-center bg-ground px-3 text-center"
                >
                  {s.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="max-h-10 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[13.5px] font-semibold text-[#555]">
                      {s.name}
                    </span>
                  )}
                </div>
              ))}
              {/* 마지막 줄 빈 칸을 흰 배경으로 메움 (5열=1·3열=2·2열=1) */}
              <div className="bg-ground" aria-hidden />
              <div
                className="hidden bg-ground max-[900px]:block max-[560px]:hidden"
                aria-hidden
              />
            </div>
          </div>
        </Section>
        )}

        {/* 문의 */}
        <Section
          n="07"
          title={
            <>
              {/* 테크포임팩트{" "} */}
              <span className="bg-[linear-gradient(transparent_62%,#FFEA2C_62%)] bg-no-repeat">
                문의
              </span>
            </>
          }
        >
          <div className="max-w-[760px]">
            <p className="text-[16px] leading-[1.8] text-[#444]">
              테크포임팩트 캠퍼스 프로그램과 관련해 궁금한 사항이 있으시면 언제든
              편하게 문의해 주세요.
              <br />
              남겨주신 문의는 순차적으로 확인 후 영업일 기준 2일 이내에 답변드리겠습니다.
            </p>
            <p className="mt-6 text-[15px] font-semibold text-muted">
              카카오임팩트 에듀임팩트팀
            </p>
            <a
              href="mailto:contact.us@kakaoimpact.org"
              className="mt-1 inline-block text-[17px] font-bold text-ink underline decoration-hair underline-offset-4 hover:decoration-ink"
            >
              contact.us@kakaoimpact.org
            </a>
          </div>
        </Section>
      </div>
    </>
  );
}

// 번호 붙은 섹션 헤더 (상세 페이지 톤과 동일). action: 타이틀 우측 보조 액션.
function Section({
  n,
  title,
  action,
  children,
}: {
  n: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 first:mt-4">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-kakao text-[17px] font-bold text-muted">
            {n}
          </span>
          <h3 className="font-kakao text-[28px] font-extrabold tracking-[-0.02em] text-ink max-md:text-[24px]">
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import FeaturedProjects from "@/components/FeaturedProjects";
import FaqTabs from "@/components/FaqTabs";
import ApplyButton from "@/components/ApplyButton";
import KakaoImpactLogo from "@/components/KakaoImpactLogo";
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
  "껌구리의 도시 상경기", // 기후 (서강대)
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
// 온라인 사전 설명회 참석 신청 링크
const INFO_SESSION_URL = "https://forms.gle/Q3sQ9JYtcsPKnrnE8";

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
  { k: "모집 기간", v: "07.08(수) ~ 07.19(일) 23:59" },
  {
    k: "사전 설명회",
    v: (
      <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1">
        07.14(화) 19:00 온라인
        <a
          href={INFO_SESSION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#e8e8e6] px-3 py-0.5 text-[14px] font-semibold text-ink ring-1 ring-black/[0.12] transition hover:bg-[#dedede]"
        >
          사전 설명회 신청하기
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
      </span>
    ),
  },
  { k: "최종 선정", v: "07.21(화) 개별 안내" },
  { k: "사회혁신가 OT", v: "07.28(화) 19:00 온라인" },
  {
    k: "신청 방법",
    v: (
      <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1">
        온라인 설문폼 제출
      <a
        href={APPLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#e8e8e6] px-3 py-0.5 text-[14px] font-semibold text-ink ring-1 ring-black/[0.12] transition hover:bg-[#dedede]"
      >
        참여 신청하기
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
      </span>
    ),
  },
];

// 아이콘 = 배경 원(포인트 핑크)이 포함된 SVG (public/benefits). <img>로 렌더.
const BENEFITS = [
  {
    title: "현장에 필요한 기술",
    desc: "현장에 필요한 기술 아이디어와 새로운 해결 가능성 모색",
    icon: "/benefits/idea.svg",
  },
  {
    title: "현장 적용 지원",
    desc: "후속 활동과 현장 적용을 검토하고 필요시 추가 지원 연계",
    icon: "/benefits/handshake.svg",
  },
  {
    title: "조직 홍보",
    desc: "카카오임팩트 채널과 성과발표회로 조직의 활동을 널리 확산",
    icon: "/benefits/megaphone.svg",
  },
  {
    title: "활동비 200만원",
    desc: "한 학기 동안 함께하는 조직에 활동 지원비 제공",
    icon: "/benefits/money.svg",
  },
];

// 사회혁신가 참여 여정 (월별 타임라인) — desc는 문장 배열(문장별 <p>로 렌더)
// 두 번째 문장의 '사회혁신가 역할' 핵심 문구는 검정·볼드로 강조.
const JOURNEY: {
  month: string;
  title: string;
  mode: string;
  desc: React.ReactNode[];
}[] = [
  {
    month: "07.27(화)",
    title: "사회혁신가 OT",
    mode: "온라인",
    desc: [
      "프로그램과 운영 일정, 참여 방식을 안내합니다.",
      <>
        사회혁신가는{" "}
        <b className="font-semibold text-ink">
          한 학기 역할과 활동을 함께 확인
        </b>
        합니다.
      </>,
    ],
  },
  {
    month: "08.29(토)",
    title: "개강 워크숍",
    mode: "온라인",
    desc: [
      "학생, 교수진, 카카오 멘토와 함께 프로젝트를 시작합니다.",
      <>
        사회혁신가는{" "}
        <b className="font-semibold text-ink">현장의 사회문제를 소개</b>합니다.
      </>,
    ],
  },
  {
    month: "9~11월",
    title: "멘토링 & 필드트립",
    mode: "온·오프라인",
    desc: [
      "학생들과 함께 프로젝트를 발전시킵니다.",
      <>
        사회혁신가는{" "}
        <b className="font-semibold text-ink">
          현장 관점의 피드백과 필드트립을 진행
        </b>
        합니다.
      </>,
    ],
  },
  {
    month: "10.13(화)",
    title: "중간 체크인",
    mode: "온라인",
    desc: [
      "학생들이 프로젝트 진행 상황을 공유합니다.",
      <>
        사회혁신가는{" "}
        <b className="font-semibold text-ink">현장 관점의 피드백을 제공</b>합니다.
      </>,
    ],
  },
  {
    month: "12월",
    title: "성과발표회",
    mode: "오프라인",
    desc: [
      "학생들이 최종 ‘돕는 기술’ 결과물을 발표합니다.",
      <>
        사회혁신가는 <b className="font-semibold text-ink">결과물을 검토</b>하고{" "}
        <b className="font-semibold text-ink">후속 발전 가능성</b>을 함께
        살펴봅니다.
      </>,
    ],
  },
];

// FAQ — a는 문장 그룹 배열(그룹별 <p>로 렌더, 사이에 여백)
const FAQS: { category: string; q: string; a: string[] }[] = [
  {
    category: "참여 자격",
    q: "어떤 조직이 참여할 수 있나요? 개인도 신청할 수 있나요?",
    a: [
      "사회문제 해결 활동을 이어오고 있는 NGO, 사회적기업, 소셜벤처, 스타트업, 공공기관 등 다양한 조직이 참여할 수 있습니다.",
      "개인도 신청하실 수 있습니다. 다만 지속적인 활동 기반(예: 개인사업자, 고유번호증 보유 단체 등)을 갖춘 경우를 우선적으로 검토합니다.",
    ],
  },
  {
    category: "참여 자격",
    q: "기술에 대한 전문 지식이 없어도 참여할 수 있나요?",
    a: [
      "물론입니다. 사회혁신가의 역할은 현장의 문제와 경험을 공유하고, 학생들에게 현장 관점의 피드백을 제공하는 것입니다.",
      "사회혁신가는 현장의 전문성을, 학생들과 카카오 멘토는 기술을 더해 함께 ‘돕는 기술’을 만들어갑니다.",
    ],
  },
  {
    category: "참여 자격",
    q: "기술 서비스를 운영하고 있어야 하나요?",
    a: [
      "아닙니다. 기술 서비스를 운영하고 있지 않아도 괜찮습니다.",
      "해결하고 싶은 사회문제가 있고, 기술을 활용한 새로운 해결 가능성을 함께 탐색해보고 싶다면 지원하실 수 있습니다.",
    ],
  },
  {
    category: "신청 및 선발",
    q: "어떤 사회문제를 제안할 수 있나요?",
    a: [
      "교육, 장애, 돌봄, 기후·환경, 지역, 건강·복지, 사회적 포용 등 분야와 관계없이 다양한 사회문제를 제안하실 수 있습니다.",
      "다음 세대인 대학생들에게 현장의 문제를 전하고, 함께 해결 가능성을 탐색해보고 싶은 사회문제라면 모두 환영합니다.",
    ],
  },
  {
    category: "신청 및 선발",
    q: "어떤 기준으로 사회혁신가를 선발하나요?",
    a: [
      "사회혁신가의 활동 경험과 전문성, 학생들과의 협업 가능성, 사회문제의 구체성과 기술 활용 가능성 등을 종합적으로 검토합니다.",
      "또한 2026년 2학기에는 전국 12개 대학이 함께하는 만큼, 다양한 분야와 지역의 사회문제가 균형 있게 반영될 수 있도록 함께 고려해 선발합니다.",
    ],
  },
  {
    category: "활동 안내",
    q: "사회혁신가는 어느 정도 참여하게 되나요? 꼭 오프라인으로 참여해야 하나요?",
    a: [
      "학기 중 월 1~2회 내외의 정기 활동에 참여하며, 학생들과는 프로젝트 진행에 맞춰 함께 소통합니다.",
      "필드트립과 성과발표회는 오프라인으로 진행되며, 세부 일정은 7월 사회혁신가 OT 이후 함께 조율할 예정입니다.",
    ],
  },
  {
    category: "활동 안내",
    q: "사회혁신가는 몇 개 팀과 함께하나요?",
    a: [
      "2026년 2학기에는 전국 12개 대학이 참여하며, 사회혁신가 한 분당 약 3~4개 학생팀과 함께합니다.",
      "학생들의 다양한 전공과 배경을 바탕으로 여러 ‘돕는 기술’ 아이디어를 만나볼 수 있습니다.",
    ],
  },
  {
    category: "지원 및 후속 연계",
    q: "학생들이 만든 결과물을 실제 현장에 활용할 수 있나요?",
    a: [
      "사회혁신가와 학생들이 현장 적용을 희망하는 프로젝트는 후속 활동과 추가 지원을 통해 실제 현장 적용 가능성을 함께 모색합니다.",
      "‘돕는 기술’이 실제 사회 변화로 이어지고, 다음 세대 사회혁신가가 성장할 수 있도록 함께 지원합니다.",
    ],
  },
  {
    category: "지원 및 후속 연계",
    q: "활동 지원비는 어떻게 지급되나요?",
    a: [
      "선발된 사회혁신 조직에는 한 학기 활동을 위한 조직당 활동 지원비 200만 원(세전)을 지급합니다.",
      "활동 지원비는 학기 초 지급되며, 세부 일정과 방법은 사회혁신가 OT에서 안내드립니다.",
    ],
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

// 정적 export(basePath /campus_2026_spring) 대응 — public 자산 경로 프리픽스.
// 빌드 시 서버에서 평가. dev(BUILD_TARGET 미설정)에선 "" 라 로컬에서도 정상.
const PAGES_REPO = process.env.PAGES_REPO ?? "campus_2026_spring";
const ASSET_BASE =
  process.env.BUILD_TARGET === "static" && PAGES_REPO ? `/${PAGES_REPO}` : "";

// 주최·후원 (교육부 · 대교협)
const HOST_LOGOS = [
  { name: "교육부", logo: "/logos/partners/교육부.png", cls: "h-12" },
  // 대교협은 가로가 길어 살짝 작게 (11.5 = 46px)
  { name: "한국대학교육협의회", logo: "/logos/partners/대교협.png", cls: "h-[46px]" },
];

// 2026-2 참여 대학 로고 (4대 과기원 먼저, 이후 가나다순). public/logos/schools
// 로고 = techforimpact.io 공식 세트를 받아 셀프호스팅(깔끔한 트림본).
const PARTNER_SCHOOLS: { name: string; logo: string; imgCls?: string }[] = [
  // 4대 과기원 (첫 행)
  {
    name: "KAIST",
    logo: "/logos/schools/kaist.png",
    imgCls: "max-h-9 max-w-[112px] translate-y-[4px]",
  },
  {
    name: "DGIST",
    logo: "/logos/schools/dgist.png",
    imgCls: "max-h-9 max-w-[112px] -translate-y-[5px]",
  },
  { name: "GIST", logo: "/logos/schools/gist.png", imgCls: "max-h-6 max-w-[100px]" },
  { name: "UNIST", logo: "/logos/schools/unist.png", imgCls: "max-h-9 max-w-[112px]" },
  // 이후 가나다순
  { name: "가천대학교", logo: "/logos/schools/gachon.png" },
  { name: "경운대학교", logo: "/logos/schools/kyungwoon.png" },
  { name: "고려대학교(세종)", logo: "/logos/schools/korea.svg" },
  { name: "단국대학교", logo: "/logos/schools/dankook.svg" },
  { name: "동국대학교", logo: "/logos/schools/dongguk.png" },
  { name: "부산외국어대학교", logo: "/logos/schools/bufs.png" },
  { name: "서강대학교", logo: "/logos/schools/sogang.svg" },
  { name: "서울대학교", logo: "/logos/schools/snu.png" },
  { name: "서울시립대학교", logo: "/logos/schools/uos.png" },
  { name: "서울여자대학교", logo: "/logos/schools/swu.png" },
  { name: "연세대학교", logo: "/logos/schools/yonsei.png" },
  { name: "이화여자대학교", logo: "/logos/schools/ewha.png" },
  { name: "한라대학교", logo: "/logos/schools/halla.png" },
  { name: "한양대학교", logo: "/logos/schools/hanyang.png" },
];

export default async function Partner() {
  const featured = featuredProjects(await getAllProjects());
  return (
    <>
      {/* Hero — 배경 이미지 풀블리드 밴드 (본문 흰 배경과 구분) */}
      {/* break-keep: 모바일에서 한글이 어절(띄어쓰기) 단위로만 줄바꿈되도록 */}
      {/* 배경 라인아트는 오른쪽에 몰려 있어 왼쪽 정렬 텍스트와 겹치지 않음 */}
      {/* 밴드 높이는 고정하고 bg-cover 로 세로만 살짝 크롭 (전체 비율은 너무 높아 축소).
          텍스트는 세로 중앙 정렬, 작은 화면에선 최소 높이 보장. */}
      <div
        className="flex min-h-[520px] items-center break-keep border-b border-hair bg-soft bg-cover bg-[center_42%] py-14 md:min-h-[520px]"
        style={{ backgroundImage: `url(${ASSET_BASE}/hero-bg.jpg)` }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-8">
          <h2 className="font-kakao text-[34px] font-extrabold leading-[1.12] tracking-[-0.03em] text-point max-md:text-[26px] max-md:leading-[1.28]">
            기술로 풀고 싶은{" "}
            <br className="md:hidden" />사회 문제가 있다면?
          </h2>
          <span className="mt-4 block font-kakao text-[54px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink max-md:text-4xl max-md:leading-[1.28]">
            테크포임팩트 캠퍼스 사회혁신가 지원하기
          </span>
          <p className="mt-10 max-w-[640px] text-[18px] font-semibold leading-[1.6] text-ink md:mt-12">
            현장의 문제와 경험을{" "}
            <br className="md:hidden" />
            대학생들에게 전해주세요
            <br />
            학생들은 AI·디지털 기술로{" "}
            <br className="md:hidden" />
            새로운 해결 가능성을 제안합니다
          </p>
          {/* 핵심 요약 (한 줄, 가운데점 구분) */}
          <p className="mt-7 text-[15px] font-medium text-[#555] md:mt-9">
            3개월 프로젝트 · 200만원 지원 · 기술 아이디어 발굴
          </p>
          <ApplyButton
            href={APPLY_URL}
            deadline="2026-07-17"
            label="참여 신청하기"
            className="mt-10 md:mt-12"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] break-keep px-8 pt-12 pb-24">
        {/* 01 · 모집 취지·소개 */}
        <Section
          n="01"
          title={
            <>
              사회 현장에서 시작하는{" "}
              <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
                테크포임팩트 캠퍼스
              </span>
            </>
          }
        >
          {/* 문장별 <p> 분리 — 모바일은 문장 사이 여백, 데스크톱은 여백 없이 줄바꿈만 */}
          <div className="flex flex-col gap-3 text-[16px] leading-[1.8] text-[#444] md:gap-0">
            <p>
              <b className="font-semibold text-ink">「테크포임팩트 캠퍼스」</b>는
              대학생들이 사회혁신가와 함께 실제 사회문제를 탐구하고, AI·디지털
              기술을 활용한 <b className="font-semibold text-ink">‘돕는 기술’</b>을
              만드는 프로젝트형 수업입니다.
            </p>
            <p>
              카카오임팩트는 2023년부터 더 많은 청년들이 기술을 통해 사회문제
              해결에 기여하는 경험을 할 수 있도록 이 프로그램을 운영하고 있습니다.
            </p>
            <p>
              대학생들에게 현장의 경험을 전하고,{" "}
              <b className="font-semibold text-ink">기술을 활용한 변화 가능성</b>을
              탐색해보고 싶은 사회혁신가를 모집합니다.
            </p>
          </div>
        </Section>

        {/* 02 · 모집 안내 */}
        <Section
          n="02"
          title={
            <>
              사회혁신가{" "}
              <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
                참여 안내
              </span>
            </>
          }
        >
          {/* <p className="mb-8 max-w-[840px] text-[16px] leading-[1.8] text-[#444]">
            <b className="font-semibold text-ink">
              현장에서 해결하고 싶은 사회문제
            </b>
            가 있고,{" "}
            <b className="font-semibold text-ink">
              기술을 활용한 새로운 해결 가능성
            </b>
            을 탐색해보고 싶은 사회혁신가를 기다립니다.
          </p> */}
          <dl className="flex max-w-[880px] flex-col gap-3.5">
            {TARGET_SPECS.map((s) => (
              <div
                key={s.k}
                className="flex items-center gap-3.5 max-md:flex-col max-md:items-start max-md:gap-1"
              >
                <dt className="w-[104px] flex-none whitespace-nowrap text-[16px] leading-[1.7] font-bold text-ink">
                  {s.k}
                </dt>
                <dd className="text-[16px] leading-[1.7] text-[#444]">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 03 · 참여 혜택 */}
        <Section
          n="03"
          title={
            <>
              테크포임팩트 캠퍼스{" "}
              <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
                참여 혜택
              </span>
            </>
          }
        >
          <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl bg-soft px-5 py-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ASSET_BASE}${b.icon}`}
                  alt=""
                  width={52}
                  height={52}
                  className="size-[52px]"
                  loading="lazy"
                  decoding="async"
                  aria-hidden
                />
                <h4 className="mt-5 text-[20px] font-bold text-ink">
                  {b.title}
                </h4>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#555]">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 04 · 사회혁신가 참여 여정 */}
        <Section
          n="04"
          title={
            <>
              사회혁신가{" "}
              <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
                참여 여정
              </span>
            </>
          }
        >
          <p className="mb-10 max-w-[820px] text-[16px] leading-[1.8] text-[#444]">
            한 학기 동안{" "}
            <b className="font-semibold text-ink">월 1~2회 내외</b>의 온·오프라인
            활동에 참여하며,{" "}
            <br className="max-md:hidden" />
            학생들의 ‘돕는 기술’ 프로젝트가 현장과 연결될 수 있도록 경험을
            공유하고 피드백을 제공합니다.
          </p>
          {/* 월별 타임라인 */}
          <ol className="max-w-[820px]">
            {JOURNEY.map((j, i) => (
              <li key={j.title} className="flex gap-5">
                {/* 월 라벨 */}
                <div className="w-[82px] flex-none whitespace-nowrap pt-0.5 text-right font-kakao text-[15px] font-bold text-ink max-[520px]:w-[68px] max-[520px]:text-[13px]">
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
                  {/* 모바일: 두 문장을 이어서 한 문단으로 */}
                  <p className="mt-2 text-[15px] leading-[1.7] text-[#555] md:hidden">
                    {j.desc[0]} {j.desc[1]}
                  </p>
                  {/* 데스크톱: 문장별 단락(여백 없이 줄바꿈만) */}
                  <div className="mt-2 hidden flex-col text-[15px] leading-[1.7] text-[#555] md:flex">
                    {j.desc.map((s, k) => (
                      <p key={k}>{s}</p>
                    ))}
                  </div>
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
              fill="#e470dc"
              aria-hidden
            >
              <path d="M10 5C6.7 5 4 7.7 4 11v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H7c0-1.7 1.3-3 3-3a1 1 0 1 0 0-3z" />
              <path d="M20 5c-3.3 0-6 2.7-6 6v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3c0-1.7 1.3-3 3-3a1 1 0 1 0 0-3z" />
            </svg>
            <p className="mt-4 font-kakao text-[19px] font-bold leading-[1.8] text-[#333] max-md:text-[17px]">
              첫 술에 배부를 리 없지만,
              <br className="md:hidden" /> 분명 아주 맛있을 거예요.
              <br />
              다음 밥상을 누구와 어떻게 차릴지,
              <br className="md:hidden" /> 아이디어도 생길 거고요.
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
            참여 신청하기
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

        {/* 05 · 사회혁신가 FAQ */}
        <Section
          n="05"
          title={
            <>
              사회혁신가{" "}
              <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
                FAQ
              </span>
            </>
          }
        >
          <FaqTabs items={FAQS} />
        </Section>

        {/* 06 · 돕는 기술 프로젝트 사례 */}
        {featured.length > 0 && (
          <Section
            n="06"
            title={
              <>
                <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
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
                1학기까지{" "}<br className="max-md:hidden" />전국 <b className="font-semibold text-ink">9개</b>{" "}
                대학,{" "}
                <b className="font-semibold text-ink">487명</b>의 학생들이{" "}
                <b className="font-semibold text-ink">34개</b> 사회혁신 조직과
                함께 <b className="font-semibold text-ink">95개</b>의 ‘돕는 기술’
                프로젝트를 만들었습니다.
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

        {/* 07 · 함께하는 파트너 */}
        <Section
          n="07"
          title={
            <>
              함께하는{" "}
              <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
                파트너
              </span>
            </>
          }
        >
          <div className="rounded-[24px] border border-hair px-8 py-12 text-center max-md:px-6">
            <p className="mb-8 text-[16px] leading-[1.8] text-[#444]">
              테크포임팩트 캠퍼스는{" "}
              <br className="md:hidden" />
              교육부 「대학 인공지능(AI) 기본교육과정{" "}<br className="md:hidden" />개발 지원사업」과 함께합니다
            </p>
            {/* 주최·후원 로고 */}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 max-md:gap-y-9">
              {HOST_LOGOS.map((h) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={h.name}
                  src={`${ASSET_BASE}${h.logo}`}
                  alt={h.name}
                  className={`${h.cls} w-auto max-w-[260px] object-contain`}
                />
              ))}
              <KakaoImpactLogo height={25} className="text-ink" />
            </div>

            {/* 2026년 2학기 참여 대학 로고 월 */}
            <div className="mt-12 border-t border-hair pt-10">
              <p className="mb-8 text-[16px] leading-[1.8] text-[#444]">
                2026년 전국 18개 대학이{" "}
                <br className="md:hidden" />
                「테크포임팩트 캠퍼스」와 함께합니다
              </p>
              {/* 4대 과기원(첫 행) + 나머지 5개씩. flex+justify-center 라 마지막 줄이 가운데로 모임 */}
              <div className="mx-auto flex max-w-[860px] flex-col gap-y-9">
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-9 max-md:flex-col max-md:items-center">
                  {PARTNER_SCHOOLS.slice(0, 4).map((s) => (
                    <div
                      key={s.name}
                      className="flex h-12 w-[126px] items-center justify-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${ASSET_BASE}${s.logo}`}
                        alt={s.name}
                        className={`${s.imgCls ?? "max-h-11 max-w-[132px]"} object-contain`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-9">
                  {PARTNER_SCHOOLS.slice(4).map((s) => (
                    <div
                      key={s.name}
                      className="flex h-12 w-[150px] items-center justify-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${ASSET_BASE}${s.logo}`}
                        alt={s.name}
                        className={`${s.imgCls ?? "max-h-11 max-w-[132px]"} object-contain`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 08 · 온라인 설명회 신청하기 */}
        <Section
          n="08"
          title={
            <>
              <span className="bg-[linear-gradient(transparent_62%,#e470dc_62%)] bg-no-repeat">
                사전 설명회
              </span>{" "}
              신청하기
            </>
          }
        >
          <div className="max-w-[760px]">
            <p className="text-[16px] leading-[1.8] text-[#444]">
              프로그램이 궁금하시다면{" "}
              <b className="font-bold text-ink">7월 14일(화) 19:00 온라인 설명회</b>
              에서 자세히 소개해 드립니다.{" "}
              <br className="max-md:hidden" />
              추가로 궁금한 사항은 언제든 편하게 문의해 주세요.
            </p>
            <a
              href={INFO_SESSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1C1C1C] px-6 py-3 text-[15px] font-semibold text-white transition hover:opacity-90"
            >
              사전 설명회 신청하기
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
            <p className="mt-8 text-[15px] font-semibold text-muted">
              카카오임팩트 에듀임팩트팀
            </p>
            <a
              href="mailto:haven.park@kakaoimpact.org"
              className="mt-1 inline-block text-[17px] font-bold text-ink underline decoration-hair underline-offset-4 hover:decoration-ink"
            >
              haven.park@kakaoimpact.org
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

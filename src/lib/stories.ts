import { parseCsv } from "./sheet";
import {
  normalizeSemester,
  semesterOptionLabel,
  sortSemesters,
} from "./semesters";

// 스토리 — 캠퍼스 크리에이터 블로그/숏폼 (시트 stories 탭, gid=668566729).
// 빌드 시 CSV 를 받아 파싱한다. 학기(기수)별로 페이지를 나눠 보여준다.
export type Story = {
  semester: string; // 학기 (시트 "학기" 컬럼, "2026-1" 형식)
  month: string; // 시기 (예: "4월")
  kind: string; // 구분 ("블로그" | "숏폼" | "롱폼" | "카드뉴스" …)
  name: string; // 이름
  school: string; // 소속
  org: string; // 사회혁신조직
  title: string; // 제목
  link: string; // 외부 링크
};

// 구분 칩 정렬 순서. 시트에 새 구분이 생기면 뒤에 자동으로 붙는다.
const KIND_ORDER = ["블로그", "숏폼", "롱폼", "카드뉴스"];

// 시트에 이 이름의 열이 있고 값이 채워진 행은 사이트에 올리지 않는다.
// (비공개 계정·삭제된 글처럼 링크가 열리지 않는 콘텐츠 — 시트에서 회색 처리한 행)
const EXCLUDE_HEADERS = ["비공개", "제외", "게시제외", "게시 제외"];

// 시트에 "비공개" 열이 아직 없는 동안의 임시 제외 목록 — 링크에 이 ID 가 포함된 행은 올리지 않는다.
// (2026-11-12 점검: 인스타그램 비공개 계정 kakao_zi·papaya_works 게시물 8건)
// 시트에 "비공개" 열을 추가해 해당 행에 표시하면 이 목록은 지워도 된다.
const EXCLUDED_LINK_IDS = [
  "DX6yo8SvGYF",
  "DY-HCJgP0gb",
  "DQefFhCj6uD",
  "DQefPqhD88L",
  "DRbf-sRDxQk",
  "DRbgJYVj7L5",
  "DS4Fj51D7NT",
  "DS4FlSMjxya",
];

// 학기 컬럼이 비어 있던 초기 데이터는 26-1 로 간주한다.
const LEGACY_SEMESTER = "2026-1";

const CSV_URL =
  process.env.STORIES_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/1Amhg64VmJujZLI-H3uO_9b9-yhB758gJlcsBJ2UJquw/export?format=csv&gid=668566729";
const BUILD_TOKEN = String(Date.now());

export async function getStories(): Promise<Story[]> {
  try {
    const res = await fetch(`${CSV_URL}&_=${BUILD_TOKEN}`, {
      cache: "force-cache",
    });
    if (!res.ok) return [];
    const table = parseCsv(await res.text());
    // 헤더 행 자동 탐지(앞에 빈 행/열이 있어도 안전)
    const hRow = table.findIndex(
      (r) => r.includes("제목") && r.includes("링크"),
    );
    if (hRow < 0) return [];
    const header = table[hRow].map((h) => h.trim());
    const col = (name: string) => header.indexOf(name);
    const c = {
      semester: col("학기"),
      month: col("시기"),
      kind: col("구분"),
      name: col("이름"),
      school: col("소속"),
      org: col("사회혁신조직"),
      title: col("제목"),
      link: col("링크"),
      exclude: header.findIndex((h) => EXCLUDE_HEADERS.includes(h)),
    };
    const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
    return table
      .slice(hRow + 1)
      .filter((r) => !get(r, c.exclude)) // 비공개 표시된 행 제외
      .map((r) => ({
        semester: normalizeSemester(get(r, c.semester)) || LEGACY_SEMESTER,
        month: get(r, c.month),
        kind: get(r, c.kind),
        name: get(r, c.name),
        school: get(r, c.school),
        org: get(r, c.org),
        title: get(r, c.title),
        link: get(r, c.link),
      }))
      .filter((s) => s.title && s.link)
      .filter((s) => !EXCLUDED_LINK_IDS.some((id) => s.link.includes(id)));
  } catch {
    return [];
  }
}

// 스토리가 있는 학기 목록 (최신순). 드롭다운·정적 경로 생성에 쓴다.
export async function getStorySemesters(): Promise<string[]> {
  const stories = await getStories();
  return sortSemesters([...new Set(stories.map((s) => s.semester))]);
}

export async function getStoriesBySemester(semester: string): Promise<Story[]> {
  const stories = await getStories();
  return stories.filter((s) => s.semester === semester);
}

// 스토리 목록 경로. 최신 학기는 /stories, 지난 학기는 /stories/semesters/<학기>.
export function storySemesterHref(semester: string, latest: string): string {
  return semester === latest ? "/stories" : `/stories/semesters/${semester}`;
}

// 캠퍼스 크리에이터 기수. 25-1학기가 1기, 이후 학기마다 1씩 늘어난다.
// (25-1 → 1기, 25-2 → 2기, 26-1 → 3기, 26-2 → 4기 …)
export function creatorCohort(semester: string): number | null {
  const m = semester.trim().match(/^(\d{4})-([12])$/);
  if (!m) return null;
  const n = (Number(m[1]) - 2025) * 2 + Number(m[2]);
  return n >= 1 ? n : null;
}

// 히어로 타이틀: "캠퍼스 크리에이터 3기"
export function cohortTitle(semester: string): string {
  const n = creatorCohort(semester);
  return n ? `캠퍼스 크리에이터 ${n}기` : "캠퍼스 크리에이터";
}

// 드롭다운 항목: "2026-1학기 · 3기"
export function storyOptionLabel(semester: string): string {
  const n = creatorCohort(semester);
  return n
    ? `${semesterOptionLabel(semester)} · ${n}기`
    : semesterOptionLabel(semester);
}

// 데이터에 등장하는 구분 목록 — 정해진 순서(KIND_ORDER) 우선, 그 외는 등장 순.
export function storyKinds(stories: Story[]): string[] {
  const seen = [...new Set(stories.map((s) => s.kind).filter(Boolean))];
  const rank = (k: string) => {
    const i = KIND_ORDER.indexOf(k);
    return i < 0 ? KIND_ORDER.length + seen.indexOf(k) : i;
  };
  return seen.sort((a, b) => rank(a) - rank(b));
}

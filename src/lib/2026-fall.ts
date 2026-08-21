import { parseCsv } from "./sheet";
import { CATEGORY_COLOR } from "./categories";

// 2학기 프로젝트 주제(= 사회혁신가) 데이터.
//  · 갤러리와 같은 통합 시트의 "사회혁신가" 탭(gid=828875153)을 CSV 로 빌드 시 1회 fetch → SSG.
//  · 환경변수 SHEET_INNOVATORS_CSV_URL 로 덮어쓸 수 있다.
const SHEET_ID = "1Amhg64VmJujZLI-H3uO_9b9-yhB758gJlcsBJ2UJquw";
const SHEET_GID = "828875153";
const CSV_URL =
  process.env.SHEET_INNOVATORS_CSV_URL ??
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
const HTML_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=html&gid=${SHEET_GID}`;
// 시트를 "웹에 게시"하면 인증 없이 HTML 접근 가능 (export?format=html 은 인증 필요)
const PUBHTML_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pubhtml?gid=${SHEET_GID}&single=true`;

// 빌드마다 새 토큰 → 빌드 간 영구 캐시(.next/cache)를 URL 로 버스트해 최신 시트 반영.
const BUILD_TOKEN = String(Date.now());
function bust(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}_=${BUILD_TOKEN}`;
}

// 시트 헤더명 (원본과 정확히 일치해야 함)
const COL = {
  no: "순번",
  orgType: "조직 유형",
  org: "조직명",
  name: "사회혁신가",
  tags: "해시태그",
  questions: "질문 키트",
  intro: "조직 소개",
  schools: "학교 매칭",
  socialLinks: "공식 SNS",
} as const;

export interface Innovator {
  id: string;
  orgType: string; // 조직 유형 (공공기관·비영리사단법인 등)
  org: string; // 조직명 (기관명)
  name: string; // 사회혁신가 (이름 + 직함)
  tags: string[]; // 해시태그 (# 제거)
  questions: string[]; // 질문 키트 (번호 제거·문항별 분리)
  intro: string; // 조직 소개 (원문 줄바꿈 유지)
  schools: string[]; // 매칭된 학교
  socialLinks: string; // 공식 SNS (원문: "- 플랫폼: URL" 형식)
  cardImageUrl: string; // 카드용 이미지 URL (Google Drive → 직접 URL로 변환됨)
  q1: string; // 사회혁신가 이야기 Q1
  q2: string; // 사회혁신가 이야기 Q2
  q3: string; // 사회혁신가 이야기 Q3
  q4: string; // 사회혁신가 이야기 Q4
  studyMaterials: string; // 추천 학습 자료 (원문 plain text)
  studyMaterialsHtml: string; // 추천 학습 자료 — 시트 하이퍼링크 보존 HTML
}

type Row = Record<string, string | undefined>;

export async function getInnovators(): Promise<Innovator[]> {
  try {
    const [csvRows, htmlMap] = await Promise.all([
      fetchCsv(CSV_URL),
      fetchStudyMaterialsHtml(),
    ]);
    return csvRows
      .filter((r) => (r[COL.org] ?? "").trim() && (r[COL.name] ?? "").trim())
      .map((r, i) => ({
        ...normalize(r, i),
        studyMaterialsHtml: htmlMap.get((r[COL.org] ?? "").trim()) ?? "",
      }));
  } catch (e) {
    console.warn(`[innovators] 데이터 로드 실패 — 빈 배열 반환. ${String(e)}`);
    return [];
  }
}

export async function getInnovatorById(id: string): Promise<Innovator | null> {
  const all = await getInnovators();
  return all.find((v) => v.id === id) ?? null;
}

async function fetchCsv(url: string): Promise<Row[]> {
  const res = await fetch(bust(url), { cache: "force-cache" });
  if (!res.ok) throw new Error(`CSV fetch ${res.status}`);
  const table = parseCsv(await res.text());
  if (table.length < 2) return [];
  const header = table[0].map((h) => h.trim());
  return table.slice(1).map((cells) => {
    const row: Row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

// ── HTML export → 추천 학습 자료 하이퍼링크 추출 ──────────────────────

async function fetchStudyMaterialsHtml(): Promise<Map<string, string>> {
  // export?format=html 은 공개 시트라도 인증 필요 → pubhtml(웹에 게시 시) 로 폴백
  for (const url of [HTML_URL, PUBHTML_URL]) {
    try {
      const res = await fetch(bust(url), { cache: "force-cache" });
      if (!res.ok) continue;
      const result = parseSheetForStudyMaterials(await res.text());
      if (result.size > 0) return result;
    } catch {
      continue;
    }
  }
  return new Map();
}

function parseSheetForStudyMaterials(html: string): Map<string, string> {
  const result = new Map<string, string>();
  const rows: string[][] = [];

  const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let trM: RegExpExecArray | null;
  while ((trM = trRe.exec(html))) {
    const cells: string[] = [];
    const tdRe = /<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let tdM: RegExpExecArray | null;
    while ((tdM = tdRe.exec(trM[1]))) cells.push(tdM[1]);
    if (cells.length) rows.push(cells);
  }

  if (rows.length < 2) return result;

  const headerText = rows[0].map((c) =>
    c.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
  );
  const orgCol = headerText.findIndex((h) => h === "조직명");
  const matCol = headerText.findIndex((h) => h.includes("추천 학습 자료"));
  if (orgCol === -1 || matCol === -1) return result;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const orgName = (cells[orgCol] ?? "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    const matHtml = extractCellHtml(cells[matCol] ?? "");
    if (orgName && matHtml) result.set(orgName, matHtml);
  }

  return result;
}

// 셀 내용에서 <a> 하이퍼링크만 보존하고 나머지 태그 제거
function extractCellHtml(cellContent: string): string {
  const links: string[] = [];
  let s = cellContent;

  // <a href="...">inner</a> 보존
  s = s.replace(
    /<a\b[^>]*?\bhref=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_: string, href: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return "";
      const safeHref = href.replace(/^javascript:/i, "").replace(/&amp;/g, "&");
      const idx = links.length;
      links.push(
        `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`,
      );
      return `\x00L${idx}\x00`;
    },
  );

  // <br> 보존
  s = s.replace(/<br\s*\/?>/gi, "\x00B\x00");
  // 나머지 태그 제거
  s = s.replace(/<[^>]+>/g, "");

  // 플레이스홀더 복원
  links.forEach((link, i) => {
    s = s.replace(`\x00L${i}\x00`, link);
  });
  s = s.replace(/\x00B\x00/g, "<br>");

  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Google Drive 공유 URL → 직접 이미지 URL 변환
// https://drive.google.com/file/d/{ID}/view → https://drive.google.com/uc?export=view&id={ID}
export function driveToDirectUrl(url: string): string {
  if (!url) return "";
  const m = url.match(/\/file\/d\/([^/?#]+)/);
  if (!m) return url;
  return `https://drive.google.com/uc?export=view&id=${m[1]}`;
}

// "로고" 를 포함하는 컬럼 검색 (헤더: "로고/ 이미지")
function byLogoCol(r: Row): string {
  const key = Object.keys(r).find((k) => k.includes("로고"));
  return key ? driveToDirectUrl((r[key] ?? "").trim()) : "";
}

// "공식"과 "SNS" 를 모두 포함하는 컬럼 검색 (헤더명 변형 대응)
function bySnsCol(r: Row): string {
  const key = Object.keys(r).find(
    (k) => k.includes("공식") && k.includes("SNS"),
  );
  return key ? (r[key] ?? "").trim() : "";
}

// Q1~Q4 열 헤더는 여러 줄을 포함하므로 prefix 로 검색
function byPrefix(r: Row, prefix: string): string {
  const key = Object.keys(r).find((k) => k.trimStart().startsWith(prefix));
  return key ? (r[key] ?? "").trim() : "";
}

function normalize(r: Row, i: number): Innovator {
  return {
    id: (r[COL.no] ?? "").trim() || String(i + 1),
    orgType: (r[COL.orgType] ?? "").trim(),
    org: (r[COL.org] ?? "").trim(),
    name: (r[COL.name] ?? "").trim(),
    tags: parseTags(r[COL.tags] ?? ""),
    questions: parseQuestions(r[COL.questions] ?? ""),
    intro: (r[COL.intro] ?? "").trim(),
    schools: parseSchools(r[COL.schools] ?? ""),
    socialLinks: bySnsCol(r),
    cardImageUrl: byLogoCol(r),
    q1: byPrefix(r, "Q1."),
    q2: byPrefix(r, "Q2."),
    q3: byPrefix(r, "Q3."),
    q4: byPrefix(r, "Q4."),
    studyMaterials: (r["추천 학습 자료"] ?? "").trim(),
    studyMaterialsHtml: "", // getInnovators()에서 HTML fetch 후 덮어씀
  };
}

// "#기후 #환경" → ["기후", "환경"]
function parseTags(raw: string): string[] {
  return raw
    .split(/[\s#]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

// 줄바꿈으로 구분된 학교 목록 → 배열
function parseSchools(raw: string): string[] {
  return raw
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// "1. …\n2. …" → ["…", "…"] (문항이 여러 줄에 걸쳐도 "숫자." 앞에서만 분리)
function parseQuestions(raw: string): string[] {
  const text = raw.trim();
  if (!text) return [];
  return text
    .split(/\n(?=\s*\d+\.\s)/)
    .map((q) => q.replace(/^\s*\d+\.\s*/, "").trim())
    .filter(Boolean);
}

// 대표 태그 → 테마색 (없으면 null → 중립 회색 점).
// 1학기 4대 카테고리 색을 절제된 액센트로 재사용. 접근성/장애는 사회적 포용으로 묶는다.
const TAG_THEME: { test: RegExp; color: string }[] = [
  { test: /기후|환경|자원순환|도시생태|에너지/, color: CATEGORY_COLOR["기후"] },
  {
    test: /지역소멸|미디어|공간재생|민관협력|지역/,
    color: CATEGORY_COLOR["지역소멸"],
  },
  { test: /마음건강|돌봄|식물|고립|은둔/, color: CATEGORY_COLOR["마음건강"] },
  {
    test: /포용|난민|인권|이주민|청년|민주주의|공론장|문화다양성|접근성|장애|시니어/,
    color: CATEGORY_COLOR["사회적 포용"],
  },
];

export function themeColor(tags: string[]): string | null {
  const joined = tags.join(" ");
  for (const t of TAG_THEME) if (t.test.test(joined)) return t.color;
  return null;
}

// 학교 탭 표시 순서 (4대 과기원 먼저, 이후 가나다). 데이터에 있는 학교만 노출.
const SCHOOL_ORDER = [
  "KAIST",
  "GIST",
  "UNIST",
  "가천대",
  "경운대",
  "고려대 세종",
  "동국대",
  "부산외대",
  "서울대",
  "서울시립대",
  "서울여대",
  "한라대",
];

export function orderedSchools(innovators: Innovator[]): string[] {
  const present = new Set(innovators.flatMap((v) => v.schools));
  const known = SCHOOL_ORDER.filter((s) => present.has(s));
  const extras = [...present].filter((s) => !SCHOOL_ORDER.includes(s)).sort();
  return [...known, ...extras];
}

import { parseCsv } from "./sheet";
import { CATEGORY_COLOR } from "./categories";

// 2학기 프로젝트 주제(= 사회혁신가) 데이터.
//  · 별도 구글 시트(gid=1607864104)를 CSV 로 빌드 시 1회 fetch → SSG.
//  · 환경변수 SHEET_INNOVATORS_CSV_URL 로 덮어쓸 수 있다.
const SHEET_ID = "13T-rtHCFIKb5VHrFL5AMgqNB5KmIHSyEc0KB-C8nrac";
const SHEET_GID = "1607864104";
const CSV_URL =
  process.env.SHEET_INNOVATORS_CSV_URL ??
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

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
}

type Row = Record<string, string | undefined>;

export async function getInnovators(): Promise<Innovator[]> {
  try {
    const rows = await fetchCsv(CSV_URL);
    return rows
      .filter((r) => (r[COL.org] ?? "").trim() && (r[COL.name] ?? "").trim())
      .map(normalize);
  } catch (e) {
    console.warn(`[innovators] 데이터 로드 실패 — 빈 배열 반환. ${String(e)}`);
    return [];
  }
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

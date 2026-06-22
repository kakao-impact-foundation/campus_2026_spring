import { Project, ProjectSchema } from "./types";
import { categoryOf } from "./categories";
import { toDrivePreview } from "./drive";

// 빌드 시 1회 호출하여 프로젝트 데이터를 가져온다.
//  · 기본: 공개 구글 시트를 CSV 로 직접 fetch (아래 SHEET_ID/GID).
//  · 2차(동적): SHEET_JSON_URL(Apps Script, `검수상태=공개` 필터링) 설정 시 그쪽을 우선 사용.
// 환경변수로 덮어쓸 수 있다: SHEET_CSV_URL, SHEET_JSON_URL.
const SHEET_ID = "1Amhg64VmJujZLI-H3uO_9b9-yhB758gJlcsBJ2UJquw"; // PII 제거된 새 시트
const SHEET_GID = "0"; // 프로젝트 탭
const CSV_URL =
  process.env.SHEET_CSV_URL ??
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
const JSON_URL = process.env.SHEET_JSON_URL;

// 빌드마다 새 토큰 → fetch 캐시(.next/cache)를 무시하고 매 빌드 최신 시트를 가져온다.
// (force-cache 는 정적 export 호환에 필요하지만 빌드 간 영구 캐시되므로 URL 로 캐시를 버스트)
const BUILD_TOKEN = String(Date.now());
function bust(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}_=${BUILD_TOKEN}`;
}

// 구글 시트 헤더명 (원본과 정확히 일치해야 함)
const COL = {
  school: "학교명",
  org: "함께한 사회혁신조직",
  team: "팀 이름",
  leader: "팀장 이름",
  members: "팀원 이름 (팀장 제외)",
  name: "프로젝트명",
  oneLiner: "프로젝트 한 줄 소개",
  outputType: "프로젝트 결과물 유형 (복수 선택 가능)",
  outputTech: "결과물 유형 및 핵심 기술",
  award: "수상 프로젝트",
  stage: "현재 진행 단계",
  techField: "프로젝트 핵심 기술 분야 (복수 선택 가능)",
  techStack: "사용 기술 스택 (복수 선택 가능)",
  advisors: "지도교수",
  mentors: "카카오멘토",
  innovator: "함께한 사회혁신가",
  deck: "발표 자료 업로드 (형식 : PDF)",
  video: "서비스 소개 및 시연 영상 업로드 (형식 : mp4)",
  repo: "소스코드 링크 제출 (형식: GitHub Repository URL)",
  service: "서비스 배포 링크 제출 (형식: URL)",
  problem: "우리 팀은 이런 문제에 주목했어요.",
  solution: "우리 팀이 만든 ‘돕는 기술’을 소개해주세요.",
  challenge: "프로젝트를 진행하며 가장 도전적이었던 순간은 무엇이었나요?",
  progress: "현재 프로젝트는 어디까지 왔나요?",
  reflection: "한 학기를 돌아보며 남기고 싶은 이야기가 있나요?",
} as const;

type Row = Record<string, string | undefined>;

export async function getProjects(): Promise<Project[]> {
  try {
    const rows = JSON_URL ? await fetchJson(JSON_URL) : await fetchCsv(CSV_URL);
    return rows
      .filter((r) => (r[COL.name] ?? "").trim()) // 프로젝트명 없는 빈 행 제외
      .map(normalize);
  } catch (e) {
    console.warn(
      `[sheet] 데이터 로드 실패 — 빈 배열 반환 (샘플로 폴백). ${String(e)}`,
    );
    return [];
  }
}

// 2차: Apps Script 가 시트 헤더를 key 로 하는 JSON 배열을 반환한다고 가정
async function fetchJson(url: string): Promise<Row[]> {
  // force-cache: 빌드 시 1회 fetch 후 정적으로 구워짐 (정적 export 호환)
  const res = await fetch(bust(url), { cache: "force-cache" });
  if (!res.ok) throw new Error(`JSON fetch ${res.status}`);
  return (await res.json()) as Row[];
}

// 1차: 공개 시트 CSV 를 받아 헤더 기준 객체 배열로 변환
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

// 따옴표·줄바꿈·이스케이프("")를 처리하는 최소 CSV 파서
export function parseCsv(text: string): string[][] {
  const src = text.replace(/\r\n?/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// 학교명 정규화: "단국대학교" → "단국대", "이화여자대학교" → "이화여대"
const SCHOOL_ALIAS: Record<string, string> = {
  이화여자대학교: "이화여대",
  이화여자대: "이화여대",
};
function normSchool(raw: string): string {
  const t = raw.trim();
  if (SCHOOL_ALIAS[t]) return SCHOOL_ALIAS[t];
  return t.replace(/대학교$/, "대").replace(/학교$/, "");
}

function normalize(r: Row, i: number): Project {
  const org = (r[COL.org] ?? "").trim();
  return ProjectSchema.parse({
    id: String(i + 1),
    school: normSchool(r[COL.school] ?? ""),
    org,
    team: (r[COL.team] ?? "").trim(),
    name: (r[COL.name] ?? "").trim(),
    oneLiner: (r[COL.oneLiner] ?? "").trim(),
    category: categoryOf(org),
    award: (r[COL.award] ?? "").trim(),
    outputType: r[COL.outputType] ?? "",
    outputTech: r[COL.outputTech] ?? "",
    stage: r[COL.stage] ?? "",
    techField: r[COL.techField] ?? "",
    techStack: r[COL.techStack] ?? "",
    leader: r[COL.leader] ?? "",
    members: r[COL.members] ?? "",
    advisors: r[COL.advisors] ?? "",
    mentors: r[COL.mentors] ?? "",
    innovator: r[COL.innovator] ?? "",
    videoUrl: toDrivePreview(r[COL.video]),
    deckUrl: toDrivePreview(r[COL.deck]),
    // TODO: 시트에 유튜브 원본 링크 컬럼 추가되면 매핑 (youtubeUrl)
    serviceUrl: (r[COL.service] || "").trim() || null,
    repoUrl: (r[COL.repo] || "").trim() || null,
    story: {
      problem: r[COL.problem] ?? "",
      solution: r[COL.solution] ?? "",
      challenge: r[COL.challenge] ?? "",
      progress: r[COL.progress] ?? "",
      reflection: r[COL.reflection] ?? "",
    },
  });
}

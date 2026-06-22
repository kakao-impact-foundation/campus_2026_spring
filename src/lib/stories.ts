import { parseCsv } from "./sheet";

// 스토리 — 캠퍼스 크리에이터 블로그/숏폼 (시트 gid=830442112).
// 빌드 시 CSV 를 받아 파싱한다.
export type Story = {
  month: string; // 시기 (예: "4월")
  kind: string; // 구분 ("블로그" | "숏폼")
  name: string; // 이름
  school: string; // 소속
  org: string; // 사회혁신조직
  title: string; // 제목
  link: string; // 외부 링크
};

export const STORY_KINDS = ["전체", "블로그", "숏폼"] as const;

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
      month: col("시기"),
      kind: col("구분"),
      name: col("이름"),
      school: col("소속"),
      org: col("사회혁신조직"),
      title: col("제목"),
      link: col("링크"),
    };
    const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
    return table
      .slice(hRow + 1)
      .map((r) => ({
        month: get(r, c.month),
        kind: get(r, c.kind),
        name: get(r, c.name),
        school: get(r, c.school),
        org: get(r, c.org),
        title: get(r, c.title),
        link: get(r, c.link),
      }))
      .filter((s) => s.title && s.link);
  } catch {
    return [];
  }
}

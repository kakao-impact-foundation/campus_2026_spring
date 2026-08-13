// 학기(시트 "학기" 컬럼) 표기·경로의 단일 진실 소스.
// 값 형식은 시트를 그대로 따른다: "2026-1"(1학기) · "2025-2"(2학기).
// 새 학기가 시트에 추가되면 여기 손댈 필요 없이 페이지·드롭다운이 자동 생성된다.
// (예외 2가지만 코드 상수 — CURRENT_SEMESTER, LEGACY_NUMERIC_SEMESTER)

// 홈(/)이 보여주는 학기. 새 학기가 시작되면 이 값만 바꾸면
// 이전 학기는 자동으로 /semesters/<학기>/ 로 내려간다.
export const CURRENT_SEMESTER = "2026-1";

// 26-1 상세는 이미 /projects/1 … /projects/40 으로 공유돼 있어 숫자 ID 를 유지한다.
// 나머지 학기는 "2025-2-1" 처럼 학기 접두사를 붙여 ID 충돌을 막는다. (src/lib/sheet.ts)
export const LEGACY_NUMERIC_SEMESTER = "2026-1";

// 시트 단축 표기("26-1")를 표준("2026-1")으로. 이미 표준이거나 모르는 형식이면 그대로.
// (갤러리 탭은 "26-1"·"25-2" 로 적혀 있어 프로젝트 탭 표기와 맞춰준다)
export function normalizeSemester(raw: string): string {
  const m = raw.trim().match(/^(\d{2})-([12])$/);
  return m ? `20${m[1]}-${m[2]}` : raw.trim();
}

// "2026-1" → { year: 2026, term: 1 } (형식이 어긋나면 null)
function parse(semester: string): { year: number; term: number } | null {
  const m = semester.trim().match(/^(\d{4})-([12])$/);
  if (!m) return null;
  return { year: Number(m[1]), term: Number(m[2]) };
}

// 히어로 타이틀·상세 칩 표기: "2026-1" → "26-1학기"
export function semesterLabel(semester: string): string {
  const p = parse(semester);
  return p ? `${String(p.year).slice(2)}-${p.term}학기` : semester;
}

// 드롭다운 항목 표기: "2026-1" → "2026-1학기"
export function semesterOptionLabel(semester: string): string {
  const p = parse(semester);
  return p ? `${p.year}-${p.term}학기` : semester;
}

// 히어로 eyebrow: "2026-1" → "Tech for Impact · 2026 Spring"
export function semesterEyebrow(semester: string): string {
  const p = parse(semester);
  if (!p) return "Tech for Impact";
  return `Tech for Impact · ${p.year} ${p.term === 1 ? "Spring" : "Fall"}`;
}

// 학기 목록 페이지 경로. 현재 학기는 홈(/).
// trailingSlash 는 next/link 가 붙여준다(다른 링크와 동일 규칙).
export function semesterHref(semester: string): string {
  return semester === CURRENT_SEMESTER ? "/" : `/semesters/${semester}`;
}

// 최신 학기 우선 정렬 (2026-1 → 2025-2 → 2025-1 → …)
export function sortSemesters(semesters: string[]): string[] {
  return [...semesters].sort((a, b) => {
    const pa = parse(a);
    const pb = parse(b);
    if (!pa || !pb) return b.localeCompare(a);
    return pb.year - pa.year || pb.term - pa.term;
  });
}

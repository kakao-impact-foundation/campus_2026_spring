// 성과발표회 갤러리 — 시트(gid=97676482)에서 대학별 폴더/날짜를 빌드 시 읽어온다.
// 사진은 폴더에서 파일 ID 를 가져와 썸네일로 렌더.
import { parseCsv } from "./sheet";
import { normalizeSemester, sortSemesters } from "./semesters";

export type Gallery = {
  id: string; // 라우트 슬러그
  semester: string; // 학기 (표준 표기 "2026-1")
  school: string; // 표시용 학교명
  date: string; // 성과발표회 날짜 (YYYY-MM-DD)
  folderId: string | null; // 구글드라이브 폴더 ID
};

// 26-1 상세는 이미 /gallery/dankook 처럼 학교 슬러그 URL 로 공유돼 있어 그대로 유지한다.
// 나머지 학기는 "2025-2-kaist" 처럼 학기 접두사를 붙여 학교가 겹쳐도 충돌하지 않게 한다.
const LEGACY_SLUG_SEMESTER = "2026-1";

const GALLERY_CSV_URL =
  process.env.GALLERY_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/1Amhg64VmJujZLI-H3uO_9b9-yhB758gJlcsBJ2UJquw/export?format=csv&gid=731665187";

// 학교명 → 라우트 슬러그 (URL 안정용). 미등록 학교는 순번 기반 슬러그로 폴백.
const SCHOOL_SLUG: Record<string, string> = {
  단국대: "dankook",
  한양대: "hanyang",
  서강대: "sogang",
  연세대: "yonsei",
  이화여대: "ewha",
  이화여자대: "ewha", // 시트 표기가 "이화여자대학교" 여도 URL 은 ewha 유지
  KAIST: "kaist",
  카이스트: "kaist",
  서울대: "snu",
  가천대: "gachon",
  개강워크숍: "workshop",
  개강워크샵: "workshop",
};

// 시트 갤러리 탭을 읽어 Gallery[] 로 변환 (빌드 시 1회)
export async function getGalleries(): Promise<Gallery[]> {
  try {
    const res = await fetch(`${GALLERY_CSV_URL}&_=${BUILD_TOKEN}`, {
      cache: "force-cache",
    });
    if (!res.ok) return [];
    const table = parseCsv(await res.text());
    const hRow = table.findIndex(
      (r) => r.includes("학교") && r.some((c) => c.includes("드라이브")),
    );
    if (hRow < 0) return [];
    const header = table[hRow].map((h) => h.trim());
    const ci = {
      semester: header.indexOf("학기"),
      school: header.indexOf("학교"),
      date: header.indexOf("날짜"),
      link: header.findIndex((h) => h.includes("드라이브")),
    };
    const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
    return table
      .slice(hRow + 1)
      .map((r, i) => {
        // 표시는 시트 값 그대로(예: "단국대학교"). 슬러그 매칭만 단축형으로 정규화.
        const school = get(r, ci.school);
        const slugKey = school.replace(/대학교$/, "대").replace(/학교$/, "");
        const link = get(r, ci.link);
        const m = link.match(/\/folders\/([\w-]+)/);
        // 학기 컬럼이 없던 초기 시트도 26-1 로 간주해 기존 URL 을 지킨다.
        const semester = normalizeSemester(get(r, ci.semester)) || LEGACY_SLUG_SEMESTER;
        const slug = SCHOOL_SLUG[slugKey] ?? `g${i + 1}`;
        return {
          id: semester === LEGACY_SLUG_SEMESTER ? slug : `${semester}-${slug}`,
          semester,
          school,
          date: get(r, ci.date),
          folderId: m ? m[1] : null,
        };
      })
      .filter((g) => g.school);
  } catch {
    return [];
  }
}

export async function getGalleryById(id: string): Promise<Gallery | null> {
  return (await getGalleries()).find((g) => g.id === id) ?? null;
}

// 갤러리 데이터가 있는 학기 목록 (최신순) — 드롭다운·정적 경로 생성에 쓴다.
export async function getGallerySemesters(): Promise<string[]> {
  const all = await getGalleries();
  return sortSemesters([...new Set(all.map((g) => g.semester))]);
}

// 한 학기의 갤러리만 (시트 행 순서 유지)
export async function getGalleriesBySemester(
  semester: string,
): Promise<Gallery[]> {
  return (await getGalleries()).filter((g) => g.semester === semester);
}

// 학기별 갤러리 목록 경로. 최신 학기는 /gallery, 지난 학기는 /gallery/semesters/<학기>.
export function gallerySemesterHref(semester: string, latest: string): string {
  return semester === latest ? "/gallery" : `/gallery/semesters/${semester}`;
}

// 상세·메타 제목: 학교 행은 "○○대학교 성과발표회", 워크숍 같은 행사 행은 이름 그대로.
export function galleryTitle(g: Gallery): string {
  return /워크숍|워크샵/.test(g.school) ? g.school : `${g.school} 성과발표회`;
}

// 공유용 폴더 링크 (복사 버튼)
export function folderShareUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
}

// 날짜 표시용: "2026-06-05" → "2026.06.05"
export function formatDate(d: string): string {
  return d.replaceAll("-", ".");
}

// 개별 파일 썸네일 — lh3 이미지 CDN 사용(브라우저 핫링크에 안정적, 쿠키/리퍼러 영향 적음).
export function driveThumb(fileId: string, w = 1600): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${w}`;
}
export function driveView(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// 빌드마다 캐시 버스트 (정적 export 는 force-cache 필요 → URL 로 무효화)
const BUILD_TOKEN = String(Date.now());
const API_KEY = process.env.GOOGLE_API_KEY;

// 폴더의 모든 이미지 파일 ID (빌드 시 1회).
//  · GOOGLE_API_KEY 설정 시: Drive API + 페이지네이션으로 전량 수집 (권장).
//  · 미설정 시: 공개 폴더 HTML 스크랩으로 폴백 (약 50장 한계).
export async function getFolderImageIds(folderId: string): Promise<string[]> {
  if (API_KEY) {
    try {
      return await listViaDriveApi(folderId);
    } catch {
      return [];
    }
  }
  return scrapeFolderIds(folderId);
}

// 카드 표지 사진 — 폴더에서 이름에 "대표사진"이 들어간 파일을 우선, 없으면 첫 번째 사진.
// (운영자가 드라이브에서 파일명만 "대표사진"으로 바꾸면 표지가 지정된다)
export async function getFolderCoverId(
  folderId: string,
): Promise<string | null> {
  const rep = API_KEY
    ? await findCoverViaDriveApi(folderId).catch(() => null)
    : await scrapeCoverId(folderId);
  if (rep) return rep;
  return (await getFolderImageIds(folderId))[0] ?? null;
}

// Drive API 로 이름에 "대표사진"이 들어간 이미지 1개 조회
async function findCoverViaDriveApi(folderId: string): Promise<string | null> {
  const u = new URL("https://www.googleapis.com/drive/v3/files");
  u.searchParams.set(
    "q",
    `'${folderId}' in parents and name contains '대표사진' and mimeType contains 'image/' and trashed = false`,
  );
  u.searchParams.set("key", API_KEY as string);
  u.searchParams.set("fields", "files(id)");
  u.searchParams.set("pageSize", "1");
  u.searchParams.set("supportsAllDrives", "true");
  u.searchParams.set("includeItemsFromAllDrives", "true");
  u.searchParams.set("_", BUILD_TOKEN);
  const res = await fetch(u.toString(), { cache: "force-cache" });
  if (!res.ok) throw new Error(`Drive API ${res.status}`);
  const data = (await res.json()) as { files?: { id: string }[] };
  return data.files?.[0]?.id ?? null;
}

// 폴백: 공개 폴더 HTML 의 임베드 데이터에서 (파일 ID, 파일명) 쌍을 찾아
// "대표사진" 파일을 고른다. 형식: \x22<id>\x22,\x5b\x22<부모>\x22\x5d,\x22<이름>\x22,\x22image
async function scrapeCoverId(folderId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://drive.google.com/drive/folders/${folderId}?_=${BUILD_TOKEN}`,
      { cache: "force-cache", headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(
      /\\x22([\w-]{25,})\\x22,\\x5b\\x22[\w-]{25,}\\x22\\x5d,\\x22[^\\"]*대표사진[^\\"]*\\x22,\\x22image/,
    );
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

// Drive API v3 — 공개 폴더는 API 키만으로 조회 가능. nextPageToken 으로 전량 페이지네이션.
async function listViaDriveApi(folderId: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken = "";
  do {
    const u = new URL("https://www.googleapis.com/drive/v3/files");
    u.searchParams.set(
      "q",
      `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    );
    u.searchParams.set("key", API_KEY as string);
    u.searchParams.set("fields", "nextPageToken,files(id)");
    u.searchParams.set("orderBy", "name_natural");
    u.searchParams.set("pageSize", "1000");
    // 공유 드라이브 폴더도 항목이 조회되도록
    u.searchParams.set("supportsAllDrives", "true");
    u.searchParams.set("includeItemsFromAllDrives", "true");
    u.searchParams.set("_", BUILD_TOKEN);
    if (pageToken) u.searchParams.set("pageToken", pageToken);

    const res = await fetch(u.toString(), { cache: "force-cache" });
    if (!res.ok) throw new Error(`Drive API ${res.status}`);
    const data = (await res.json()) as {
      files?: { id: string }[];
      nextPageToken?: string;
    };
    for (const f of data.files ?? []) ids.push(f.id);
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return ids;
}

// 폴백: 공개 폴더 HTML 의 data-id 추출 (마크업 변경 시 깨질 수 있는 초안용, 약 50장 한계).
async function scrapeFolderIds(folderId: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://drive.google.com/drive/folders/${folderId}?_=${BUILD_TOKEN}`,
      { cache: "force-cache", headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (!res.ok) return [];
    const html = await res.text();
    const ids = new Set<string>();
    for (const m of html.matchAll(/data-id="([\w-]{25,})"/g)) {
      if (m[1] !== folderId) ids.add(m[1]);
    }
    return [...ids];
  } catch {
    return [];
  }
}

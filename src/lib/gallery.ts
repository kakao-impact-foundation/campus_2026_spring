// 성과발표회 갤러리 — 시트(gid=97676482)에서 대학별 폴더/날짜를 빌드 시 읽어온다.
// 사진은 폴더에서 파일 ID 를 가져와 썸네일로 렌더.
import { parseCsv } from "./sheet";

export type Gallery = {
  id: string; // 라우트 슬러그
  school: string; // 표시용 학교명
  date: string; // 성과발표회 날짜 (YYYY-MM-DD)
  folderId: string | null; // 구글드라이브 폴더 ID
};

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
        return {
          id: SCHOOL_SLUG[slugKey] ?? `g${i + 1}`,
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

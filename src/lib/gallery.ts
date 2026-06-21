// 성과발표회 갤러리 — 대학별 구글드라이브 폴더 (시트 gid=97676482 기준).
// 사진은 빌드 시점에 공개 폴더 HTML 에서 파일 ID 를 추출해 썸네일로 렌더한다.

export type Gallery = {
  id: string; // 라우트 슬러그
  school: string; // 표시용 학교명
  date: string; // 성과발표회 날짜 (YYYY-MM-DD)
  folderId: string | null; // 구글드라이브 폴더 ID
};

export const GALLERIES: Gallery[] = [
  { id: "dankook", school: "단국대", date: "2026-06-05", folderId: "14XF05EnBEVyqJVluvrU6q-oTsqJlTiC8" },
  { id: "hanyang", school: "한양대", date: "2026-06-08", folderId: "1W5o6LIi5QwZh-DflDAsdwNUQN1w60F6i" },
  { id: "sogang", school: "서강대", date: "2026-06-10", folderId: "1BfeDi3OdBLw3AacJZfGiJmpoG-C8GGtF" },
  { id: "ewha", school: "이화여대", date: "2026-06-10", folderId: "1e0TXAI5UyB1PY0jUhmCnDk34h2rGsz35" },
  { id: "yonsei", school: "연세대", date: "2026-06-12", folderId: null },
];

export function galleryById(id: string): Gallery | null {
  return GALLERIES.find((g) => g.id === id) ?? null;
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

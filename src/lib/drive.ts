// 구글 드라이브 공유 링크 → 페이지 내 임베드용 /preview URL 변환
//   https://drive.google.com/open?id=FILE_ID        → .../file/d/FILE_ID/preview
//   https://drive.google.com/file/d/FILE_ID/view     → .../file/d/FILE_ID/preview
// ⚠️ 임베드가 보이려면 해당 파일이 "링크 보유자 · 뷰어"로 공개돼 있어야 함.

export function toDrivePreview(url?: string | null): string | null {
  if (!url) return null;
  const m =
    url.match(/[?&]id=([\w-]+)/) || url.match(/\/file\/d\/([\w-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

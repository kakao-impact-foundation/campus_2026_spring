// 시트의 공유 링크 → 페이지 내 임베드용 URL 변환
//
// 구글 드라이브 (발표 자료·영상 대부분):
//   https://drive.google.com/open?id=FILE_ID          → .../file/d/FILE_ID/preview
//   https://drive.google.com/file/d/FILE_ID/view      → .../file/d/FILE_ID/preview
//   ⚠️ 임베드가 보이려면 해당 파일이 "링크 보유자 · 뷰어"로 공개돼 있어야 함.
//
// 유튜브 (일부 팀이 시연 영상을 유튜브로 제출):
//   https://www.youtube.com/watch?v=VIDEO_ID          → https://www.youtube.com/embed/VIDEO_ID
//   https://youtu.be/VIDEO_ID                          → https://www.youtube.com/embed/VIDEO_ID
//   https://www.youtube.com/shorts/VIDEO_ID            → https://www.youtube.com/embed/VIDEO_ID
//   (watch URL 그대로 iframe 에 넣으면 X-Frame-Options 로 거부됨)

export function toDrivePreview(url?: string | null): string | null {
  if (!url) return null;

  const yt =
    url.match(/youtube\.com\/watch\?(?:.*&)?v=([\w-]{6,})/) ||
    url.match(/youtu\.be\/([\w-]{6,})/) ||
    url.match(/youtube\.com\/(?:shorts|embed)\/([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const m = url.match(/[?&]id=([\w-]+)/) || url.match(/\/file\/d\/([\w-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

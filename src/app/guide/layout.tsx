import GuideSidebar from "@/components/guide/GuideSidebar";

// 가이드 섹션 공통 레이아웃 — 좌측 목차 + 본문(+ 문서 페이지의 우측 목차).
//
// [2차 · 로그인] 참가자만 볼 수 있게 할 자리는 여기다.
// Supabase Auth 세션을 확인해 미인증이면 로그인 화면으로 보내는 게이트를
// 이 컴포넌트 최상단에 두면 /guide/** 전체가 한 번에 보호된다.
// (정적 export 에서는 동작하지 않으므로 2차 Vercel 배포 이후에 적용)
export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-[1280px] items-start gap-10 px-8 max-xl:gap-8 max-lg:block">
      <GuideSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

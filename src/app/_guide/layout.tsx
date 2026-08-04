import GuideSidebar from "@/components/guide/GuideSidebar";

// ⚠️ 비공개 상태 — 폴더명이 "_guide" 인 동안 Next 는 이 하위를 라우트로 만들지 않는다.
//    (App Router 의 private folder 규칙: "_" 로 시작하는 폴더는 라우팅 제외)
//    빌드 산출물·클라이언트 번들에 초안 본문이 전혀 포함되지 않는다.
//
//    다시 노출하려면: mv src/app/_guide src/app/guide  → /guide 로 복구.
//    로컬에서 작업할 때도 같은 방법으로 잠깐 되돌렸다가 원복하면 된다.
//
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

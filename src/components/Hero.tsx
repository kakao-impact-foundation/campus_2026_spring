// 리스트 상단 히어로. 형광펜(카카오 옐로우)은 여기 한 곳의 브랜드 모먼트.
// 통계 숫자(대학·사회혁신가·돕는 기술)는 데이터 기준으로 주입된다.
export default function Hero({
  schools,
  orgs,
  projects,
}: {
  schools: number;
  orgs: number;
  projects: number;
}) {
  return (
    <div className="pt-14 pb-10">
      <div className="mx-auto max-w-[1280px] px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Tech for Impact · 2026 Spring
        </span>
        <h2 className="mt-3.5 font-kakao text-[54px] font-extrabold leading-[1.08] tracking-[-0.03em] max-md:text-4xl">
          26-1학기 돕는 기술 프로젝트
        </h2>
        <p className="mt-5 text-[18px] text-[#555]">
          {/* <b className="font-bold text-ink">26년도 1학기</b>에 참여한{" "} */}
          <b className="font-bold text-ink">{schools}</b>개 대학이{" "}
          <b className="font-bold text-ink">{orgs}</b>팀의 사회혁신가와 함께 만든{" "}
          <b className="font-bold text-ink">{projects}</b>개의 돕는 기술을
          소개합니다
        </p>
      </div>
    </div>
  );
}

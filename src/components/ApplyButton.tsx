// 지원하기 버튼 — closed=true 로 넘기면 "모집 마감" 비활성 상태로 표시.
//  · 모집 마감은 날짜 자동 판정이 아니라 호출부에서 수동으로 제어(RECRUIT_CLOSED).
export default function ApplyButton({
  href,
  label = "지원하기",
  closed = false,
  className = "",
}: {
  href: string;
  label?: string;
  closed?: boolean;
  className?: string;
}) {
  // border border-transparent: 아웃라인 버튼(1px 테두리)과 높이를 정확히 맞추기 위함
  const base =
    "inline-flex items-center gap-2 rounded-full border border-transparent px-7 py-3.5 font-kakao text-[17px] font-semibold transition";

  if (closed) {
    return (
      <span className={`${base} cursor-default bg-soft text-muted ${className}`}>
        모집 마감
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-[#1C1C1C] text-white hover:opacity-90 ${className}`}
    >
      {label}
      <svg
        width="14"
        height="14"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4.5 13.5L13.5 4.5M13.5 4.5H6M13.5 4.5V12" />
      </svg>
    </a>
  );
}

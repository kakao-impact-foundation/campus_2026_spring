// 수상 태그 — 카카오 옐로우 pill (보더 없음). 카드/상세 공용.
export default function AwardBadge({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-accent px-2.5 py-2 text-[11.5px] leading-none font-extrabold text-ink ${className}`}
    >
      {label}
    </span>
  );
}

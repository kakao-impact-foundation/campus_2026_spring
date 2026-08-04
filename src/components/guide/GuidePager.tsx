import Link from "next/link";
import { GuideDoc } from "@/lib/guide";

// 문서 하단 이전/다음 이동.
export default function GuidePager({
  prev,
  next,
}: {
  prev?: GuideDoc;
  next?: GuideDoc;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="border-hair mt-16 grid grid-cols-2 gap-3 border-t pt-8 max-sm:grid-cols-1">
      {prev ? <PagerLink doc={prev} dir="prev" /> : <span />}
      {next && <PagerLink doc={next} dir="next" />}
    </nav>
  );
}

function PagerLink({ doc, dir }: { doc: GuideDoc; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/guide/${doc.slug}`}
      className={`group border-hair hover:bg-soft flex flex-col gap-1 rounded-[14px] border p-[15px_18px] transition hover:border-[#d6d6d6] ${
        isNext ? "items-end text-right" : "items-start"
      }`}
    >
      <span className="text-muted text-[12.5px] font-semibold">
        {isNext ? "다음" : "이전"}
      </span>
      <span className="text-ink text-[15px] leading-[1.4] font-bold">
        {doc.title}
      </span>
    </Link>
  );
}

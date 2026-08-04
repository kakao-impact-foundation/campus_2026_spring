import { Block, headingId } from "@/lib/guide";

// 콜아웃 톤 — 브랜드 색을 절제해서 쓴다.
//  info=중립 회색 / tip=포인트 핑크 / warn=카카오 옐로우(주의 환기)
const TONE: Record<string, { bar: string; bg: string }> = {
  info: { bar: "#c9c9c9", bg: "#f7f7f5" },
  tip: { bar: "var(--color-point)", bg: "#fdf4fc" },
  warn: { bar: "var(--color-accent)", bg: "#fffdf0" },
};

// 가이드 본문 블록 렌더러.
// 지금은 타입 있는 블록 배열 → 나중에 MDX 로 바꿔도 이 컴포넌트만 교체하면 된다.
export default function GuideBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="break-keep">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} index={i} />
      ))}
    </div>
  );
}

function BlockView({ block: b, index }: { block: Block; index: number }) {
  switch (b.type) {
    case "h2":
      return (
        <h2
          id={headingId(index)}
          className="font-kakao text-ink mt-12 mb-3.5 scroll-mt-28 text-[24px] leading-[1.3] font-extrabold tracking-[-0.02em] first:mt-0 max-md:text-[21px]"
        >
          {b.text}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={headingId(index)}
          className="text-ink mt-9 mb-2.5 scroll-mt-28 text-[17px] leading-[1.4] font-bold first:mt-0"
        >
          {b.text}
        </h3>
      );

    case "p":
      return (
        <p className="my-4 text-[16px] leading-[1.8] text-[#3d3d3d]">
          {b.text}
        </p>
      );

    case "ul":
      return (
        <ul className="my-4 flex flex-col gap-2">
          {b.items.map((it) => (
            <li
              key={it}
              className="relative pl-[18px] text-[16px] leading-[1.75] text-[#3d3d3d] before:absolute before:top-[11px] before:left-[2px] before:size-[5px] before:rounded-full before:bg-[#c4c4c4]"
            >
              {it}
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="my-6 flex flex-col gap-3">
          {b.items.map((it, n) => (
            <li
              key={it.title}
              className="bg-soft flex gap-3.5 rounded-[14px] p-[16px_18px]"
            >
              <span className="font-kakao mt-[1px] flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#1C1C1C] text-[12px] font-bold text-white">
                {n + 1}
              </span>
              <div>
                <div className="text-ink text-[15.5px] font-bold">
                  {it.title}
                </div>
                <div className="mt-1 text-[15px] leading-[1.7] text-[#555]">
                  {it.body}
                </div>
              </div>
            </li>
          ))}
        </ol>
      );

    case "callout": {
      const tone = TONE[b.tone] ?? TONE.info;
      return (
        <div
          className="my-6 rounded-[6px_14px_14px_6px] border-l-[4px] p-[16px_18px]"
          style={{ borderColor: tone.bar, background: tone.bg }}
        >
          {b.title && (
            <div className="text-ink mb-1 text-[14.5px] font-bold">
              {b.title}
            </div>
          )}
          <div className="text-[15px] leading-[1.75] text-[#454545]">
            {b.text}
          </div>
        </div>
      );
    }

    case "table":
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b-[1.5px] border-[#ddd]">
                {b.head.map((h) => (
                  <th
                    key={h}
                    className="font-kakao text-muted py-2.5 pr-4 text-[13px] font-bold tracking-[0.02em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-hair border-b">
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className={`py-3 pr-4 align-top leading-[1.65] ${
                        c === 0 ? "text-ink font-semibold" : "text-[#4a4a4a]"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "divider":
      return <hr className="border-hair my-10 border-0 border-t" />;
  }
}

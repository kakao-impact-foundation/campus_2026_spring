import { Project } from "@/lib/types";
import {
  CATEGORIES,
  CATEGORY_COLOR,
  CATEGORY_ORGS,
  Category,
} from "@/lib/categories";

// 사이드바 필터 선택 상태. 카테고리(주제) 또는 조직 단위.
export type Selection =
  | { kind: "all" }
  | { kind: "cat"; val: Category }
  | { kind: "org"; val: string };

type Props = {
  projects: Project[];
  selection: Selection;
  onSelect: (s: Selection) => void;
  onReset: () => void;
};

export default function FilterSidebar({
  projects,
  selection,
  onSelect,
  onReset,
}: Props) {
  // 카운트는 학교 필터와 무관하게 전체 기준 (시안 동작과 동일)
  const orgCount: Record<string, number> = {};
  for (const p of projects) orgCount[p.org] = (orgCount[p.org] ?? 0) + 1;
  const catCount = (c: Category) =>
    CATEGORY_ORGS[c].reduce((s, o) => s + (orgCount[o] ?? 0), 0);

  return (
    <aside>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        주제 카테고리
      </p>

      <button
        onClick={() => onSelect({ kind: "all" })}
        aria-pressed={selection.kind === "all"}
        className="mb-2 flex w-full justify-between rounded-[9px] px-2.5 py-[9px] text-left text-[14.5px] font-bold aria-pressed:bg-soft2"
      >
        <span>전체</span>
        <span className="text-xs font-semibold text-muted">
          {projects.length}
        </span>
      </button>

      <ul className="mb-[22px] list-none">
        {CATEGORIES.map((cat) => {
          const color = CATEGORY_COLOR[cat];
          const catActive = selection.kind === "cat" && selection.val === cat;
          return (
            <li key={cat} className="mb-1.5">
              <button
                onClick={() => onSelect({ kind: "cat", val: cat })}
                aria-pressed={catActive}
                style={catActive ? { background: color } : undefined}
                className="flex w-full items-center justify-between gap-2 rounded-[9px] px-2.5 py-[9px] text-left text-[14.5px] font-bold hover:bg-soft"
              >
                <span className="inline-flex items-center gap-[9px]">
                  <span
                    className="size-[9px] shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  {cat}
                </span>
                <span className="text-xs font-semibold text-muted">
                  {catCount(cat)}
                </span>
              </button>

              <ul className="mt-0.5 mb-2 list-none">
                {CATEGORY_ORGS[cat].map((org) => {
                  const orgActive =
                    selection.kind === "org" && selection.val === org;
                  return (
                    <li key={org}>
                      <button
                        onClick={() => onSelect({ kind: "org", val: org })}
                        aria-pressed={orgActive}
                        className="flex w-full items-center justify-between gap-2 rounded-lg py-1.5 pr-2.5 pl-[30px] text-left text-[13px] text-[#666] hover:bg-soft aria-pressed:font-bold aria-pressed:text-ink"
                      >
                        <span className="inline-flex items-center">
                          {orgActive && (
                            <span
                              className="mr-[7px] inline-block size-1.5 rounded-full"
                              style={{ background: color }}
                            />
                          )}
                          {org}
                        </span>
                        <span className="text-[11.5px] text-muted">
                          {orgCount[org] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <button
        onClick={onReset}
        className="px-2.5 py-1 text-[12.5px] text-muted hover:text-ink"
      >
        필터 초기화
      </button>
    </aside>
  );
}

// 학교 필터 칩. 선택 시 검정(#1C1C1C) — 카테고리 테마색과 역할 분리.
type Props = {
  schools: string[]; // "전체" 포함
  selected: string;
  onSelect: (s: string) => void;
};

export default function SchoolBar({ schools, selected, onSelect }: Props) {
  return (
    <div className="mb-[22px] flex flex-wrap gap-2">
      {schools.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          aria-pressed={selected === s}
          className="rounded-full border-[1.5px] border-soft bg-ground px-[17px] py-2 text-[13.5px] font-semibold text-[#1C1C1C] hover:border-soft2 hover:bg-soft aria-pressed:border-[#1C1C1C] aria-pressed:bg-[#1C1C1C] aria-pressed:text-white"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

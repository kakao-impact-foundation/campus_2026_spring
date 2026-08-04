"use client";

import { useMemo, useState } from "react";
import { Innovator } from "@/lib/2026-fall";
import SchoolBar from "../SchoolBar";
import InnovatorCard from "./Card";
import InnovatorModal from "./Modal";

const ALL = "전체";

// 사회혁신가 모아보기. 상단 학교 필터(기본 전체) → 카드 클릭 → 상세 팝업.
export default function InnovatorsList({
  innovators,
  schools,
}: {
  innovators: Innovator[];
  schools: string[]; // "전체" 제외한 학교 목록 (orderedSchools)
}) {
  const [school, setSchool] = useState(ALL);
  const [selected, setSelected] = useState<Innovator | null>(null);

  const shown = useMemo(
    () =>
      school === ALL
        ? innovators
        : innovators.filter((v) => v.schools.includes(school)),
    [innovators, school],
  );

  return (
    <>
      {schools.length > 0 && (
        <SchoolBar
          schools={[ALL, ...schools]}
          selected={school}
          onSelect={setSchool}
        />
      )}

      {/* 개수 표시는 필터와 무관하게 같은 문구를 쓴다 (학교명은 칩에서 이미 보임) */}
      <div className="text-muted mb-[26px] text-sm">
        총 <b className="text-ink font-bold">{shown.length}</b>팀의 사회혁신가
      </div>

      {shown.length ? (
        <div className="grid grid-cols-3 gap-4 max-[780px]:grid-cols-2 max-[540px]:grid-cols-1">
          {shown.map((v) => (
            <InnovatorCard key={v.id} innovator={v} onSelect={setSelected} />
          ))}
        </div>
      ) : (
        <div className="text-muted py-[70px] text-center">
          {school === ALL
            ? "아직 공개된 사회혁신가가 없어요."
            : "해당 학교의 매칭 주제가 없어요."}
        </div>
      )}

      {selected && (
        <InnovatorModal
          innovator={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

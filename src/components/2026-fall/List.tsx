"use client";

import { useMemo, useState } from "react";
import { Innovator } from "@/lib/2026-fall";
import SchoolBar from "../SchoolBar";
import InnovatorCard from "./Card";

const ALL = "전체";

export default function InnovatorsList({
  innovators,
  schools,
}: {
  innovators: Innovator[];
  schools: string[];
}) {
  const [school, setSchool] = useState(ALL);

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

      <div className="text-muted mb-[26px] text-sm">
        총 <b className="text-ink font-bold">{shown.length}</b>팀의 사회혁신가
      </div>

      {shown.length ? (
        <div className="grid grid-cols-3 gap-4 max-[780px]:grid-cols-2 max-[540px]:grid-cols-1">
          {shown.map((v) => (
            <InnovatorCard key={v.id} innovator={v} />
          ))}
        </div>
      ) : (
        <div className="text-muted py-[70px] text-center">
          {school === ALL
            ? "아직 공개된 사회혁신가가 없어요."
            : "해당 학교의 매칭 주제가 없어요."}
        </div>
      )}
    </>
  );
}

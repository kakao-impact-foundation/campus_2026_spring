"use client";

import { useState } from "react";
import { driveThumb, driveView } from "@/lib/gallery";

// 사진 그리드 — '더 보기'로 점진 로딩하여 한 번에 수백 장 요청(레이트리밋·깨짐)을 방지.
// 4열 × 10줄 = 40장씩.
const PAGE = 40;

export default function PhotoGrid({ ids }: { ids: string[] }) {
  const [shown, setShown] = useState(PAGE);
  const visible = ids.slice(0, shown);
  const rest = ids.length - shown;

  return (
    <>
      <div className="grid grid-cols-4 gap-3 max-[1040px]:grid-cols-3 max-[780px]:grid-cols-2 max-[440px]:grid-cols-1">
        {visible.map((fid) => (
          <a
            key={fid}
            href={driveView(fid)}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={driveThumb(fid, 400)}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-[1.03]"
            />
          </a>
        ))}
      </div>

      {rest > 0 && (
        <div className="mt-9 text-center">
          <button
            onClick={() => setShown((s) => s + PAGE)}
            className="rounded-full border border-[#ddd] bg-white px-6 py-3 text-[14px] font-bold text-ink transition-colors hover:bg-soft"
          >
            사진 더 보기 ({rest}장 남음)
          </button>
        </div>
      )}
    </>
  );
}

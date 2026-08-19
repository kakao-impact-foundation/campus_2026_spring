import Link from "next/link";
import { Innovator, themeColor } from "@/lib/2026-fall";

const Q_LABELS = {
  q1: "처음 사회 문제를 마주했던 순간의 기억과, 그 인식을 활동으로 바꿔놓은 결정적인 장면은 무엇인가요?",
  q2: "문제해결 과정에서 만난 사람들은 어떤 사람들인가요?",
  q3: "사회문제 해결 과정에서 마주하는 어려운 점은 무엇인가요?",
  q4: "사회혁신가님이 만들고 싶은 변화가 충분히 쌓인 사회는 어떤 모습일까요?",
};

// Platform link detection — handles both https:// URLs and bare URLs (twitter.com/…, pf.kakao.com/…)
const LINK_LINE_RE =
  /^[-•＊*]?\s*(홈페이지|웹사이트|인스타그램|유튜브|YouTube|블로그|Blog|페이스북|링크드인|트위터|카카오톡채널|카카오톡|카카오채널|카카오|X)\s*[:：]\s*(https?:\/\/\S+|[a-zA-Z0-9][\w.-]+\.\w{2,}[^\s]*)/i;

function extractLinkLines(text: string) {
  const lines = text.split("\n");
  const links: { label: string; url: string }[] = [];
  const rest: string[] = [];
  for (const ln of lines) {
    const m = ln.match(LINK_LINE_RE);
    if (m) {
      const raw = m[2].replace(/[),.'"]+$/, "");
      const url = raw.startsWith("http") ? raw : `https://${raw}`;
      links.push({ label: m[1], url });
    } else {
      rest.push(ln);
    }
  }
  return { cleaned: rest.join("\n").trim(), links };
}

export default function InnovatorDetailView({
  innovator: v,
}: {
  innovator: Innovator;
}) {
  const color = themeColor(v.tags) ?? "#d4d4d4";
  const { cleaned: introText, links: introLinks } = extractLinkLines(v.intro);

  const hasSec01 = !!(introText || v.questions.length);
  const hasSec02 = !!(v.q1 || v.q2 || v.q3 || v.q4);
  const hasSec03 = !!v.studyMaterials;
  const sections: string[] = [];
  if (hasSec01) sections.push("s01");
  if (hasSec02) sections.push("s02");
  if (hasSec03) sections.push("s03");
  const secNo = (key: string) =>
    `SECTION ${String(sections.indexOf(key) + 1).padStart(2, "0")}`;

  return (
    <div className="px-8 pt-[30px] pb-[110px]">
      <div className="mx-auto max-w-[800px]">
        {/* 목록으로 */}
        <Link
          href="/2026-fall"
          className="inline-block text-[13.5px] font-semibold text-muted hover:text-ink"
        >
          ← 목록으로
        </Link>

        {/* 카테고리 도트 + 태그 */}
        <div className="mt-6 mb-3.5 flex flex-wrap items-center gap-[7px] text-sm font-bold text-ink">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: color }}
          />
          {v.tags[0] ?? v.orgType}
        </div>

        {/* 기관명 */}
        <h1 className="font-kakao mb-3.5 text-[46px] font-extrabold leading-[1.12] tracking-[-0.03em] max-md:text-[32px] break-keep">
          {v.org}
        </h1>

        {/* ── 기본 정보 ── */}
        <dl className="mt-8 divide-y divide-black/[0.05] rounded-2xl bg-soft px-7">
          <InfoRow label="사회혁신가">{v.name}</InfoRow>
          {v.tags.length > 0 && (
            <InfoRow label="키워드">
              {v.tags.map((t) => `#${t}`).join("  ")}
            </InfoRow>
          )}
          {v.orgType && <InfoRow label="조직 유형">{v.orgType}</InfoRow>}
          {v.schools.length > 0 && (
            <InfoRow label="매칭 학교">{v.schools.join(" · ")}</InfoRow>
          )}
          {introLinks.length > 0 && (
            <InfoRow label="공식 SNS">
              <PlatformLinks links={introLinks} />
            </InfoRow>
          )}
        </dl>

        {/* ── SECTION 01. 사회혁신가 소개 ── */}
        {hasSec01 && (
          <section className="mt-14">
            <SectionTitle>{secNo("s01")}. 사회혁신가 소개</SectionTitle>
            <dl className="divide-y divide-black/[0.06] rounded-2xl border border-[#e6e6e6] px-7">
              {introText && (
                <DetailRow label="조직 소개">
                  <RichText text={introText} />
                </DetailRow>
              )}
              {v.questions.length > 0 && (
                <DetailRow
                  label={
                    <>
                      요즘 고민하는
                      <br />
                      질문들, 기술과
                      <br />
                      만난다면?
                    </>
                  }
                >
                  <ol className="space-y-4">
                    {v.questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-ink mt-0.5"
                          style={{ background: color }}
                        >
                          {i + 1}
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ol>
                </DetailRow>
              )}
            </dl>
          </section>
        )}

        {/* ── SECTION 02. 사회혁신가 이야기 ── */}
        {hasSec02 && (
          <section className="mt-16">
            <SectionTitle>{secNo("s02")}. 사회혁신가 이야기</SectionTitle>
            <div>
              {(
                [
                  { key: "q1" as const, no: "01" },
                  { key: "q2" as const, no: "02" },
                  { key: "q3" as const, no: "03" },
                  { key: "q4" as const, no: "04" },
                ] as const
              )
                .filter(({ key }) => v[key])
                .map(({ key, no }, idx, arr) => (
                  <div
                    key={key}
                    className={`py-[30px] ${idx < arr.length - 1 ? "border-b border-black/15" : ""}`}
                  >
                    <h3 className="mb-4 flex items-center gap-3 text-[22px] font-extrabold tracking-[-0.02em]">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-ink"
                        style={{ background: color }}
                      >
                        {no}
                      </span>
                      {Q_LABELS[key]}
                    </h3>
                    <p className="whitespace-pre-line text-[15.5px] leading-[1.85] text-[#333]">
                      {v[key]}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── SECTION 03. 추천 학습 자료 ── */}
        {hasSec03 && (
          <section className="mt-16">
            <SectionTitle>{secNo("s03")}. 추천 학습 자료</SectionTitle>
            <div className="mb-4 rounded-2xl bg-[#191919] px-7 py-6">
              <p className="text-[14px] leading-[1.85] text-white/75">
                사회혁신가가 직접 선정한 참고하면 좋은 자료 모음입니다. 이
                자료를 활용해 일상에서 마주하는 사회 문제를 깊이 들여다보고,
                솔루션이 필요한 현장을 조사해보세요. 이를 통해{" "}
                <span className="font-bold text-white">
                  ① 사회 문제 및 현장 조사 → ② 문제 정의 → ③ 돕는 기술 솔루션
                  초기 기획
                </span>
                의 과정을 차근차근 진행할 수 있습니다.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6e6e6] px-7 py-[18px]">
              <div className="text-[15px] leading-[1.8]">
                <RichText text={v.studyMaterials} />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ── 공통 서브 컴포넌트 ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-7 text-[16px] font-bold tracking-[0.01em] text-ink">
      {children}
    </h2>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 py-[18px] max-md:flex-col max-md:gap-1">
      <dt className="w-[110px] flex-none pt-px text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">
        {label}
      </dt>
      <dd className="min-w-0 text-[15px] leading-[1.5]">{children}</dd>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 py-[18px] max-md:flex-col max-md:gap-1">
      <dt className="w-[110px] flex-none pt-px text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">
        {label}
      </dt>
      <dd className="min-w-0 text-[15px] leading-[1.6]">{children}</dd>
    </div>
  );
}

/* ── 플랫폼 아이콘 SVG ── */

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.72 2 11.27c0 2.87 1.81 5.39 4.54 6.9-.13.48-.83 3.1-.86 3.28 0 0-.02.18.1.24.12.06.25.01.25.01.33-.05 3.82-2.52 4.48-2.97.49.07 1 .1 1.49.1 5.52 0 10-3.72 10-8.73S17.52 3 12 3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function PlatformIcon({ label }: { label: string }) {
  const lc = label.toLowerCase();
  if (lc.includes("인스타") || lc.includes("instagram")) return <InstagramIcon />;
  if (lc.includes("유튜브") || lc.includes("youtube")) return <YouTubeIcon />;
  if (lc.includes("블로그") || lc.includes("blog")) return <BlogIcon />;
  if (lc.includes("카카오")) return <KakaoIcon />;
  if (lc === "x" || lc.includes("트위터") || lc.includes("twitter")) return <XIcon />;
  return <GlobeIcon />;
}

function PlatformLinks({ links }: { links: { label: string; url: string }[] }) {
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ label, url }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e0e0e0] bg-white px-3 py-[6px] text-[12.5px] font-semibold text-[#444] transition-colors hover:bg-[#f5f5f5]"
        >
          <PlatformIcon label={label} />
          {label}
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      ))}
    </div>
  );
}

/* ── 줄바꿈 유지 + URL 자동 링크 ── */
const LINK_RE = /(https?:\/\/[^\s\n]+|www\.[^\s\n]+)/g;

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {linkifyLine(line)}
        </span>
      ))}
    </>
  );
}

function linkifyLine(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const raw = m[0].replace(/[),.'"]+$/, "");
    const trailing = m[0].slice(raw.length);
    const href = raw.startsWith("http") ? raw : `https://${raw}`;
    out.push(
      <a
        key={`${m.index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline underline-offset-2 decoration-[#ccc] hover:decoration-ink transition-[text-decoration-color]"
      >
        {raw}
      </a>,
    );
    if (trailing) out.push(trailing);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

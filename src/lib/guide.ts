// 참가자 가이드(매뉴얼) 데이터 — 목차·본문의 단일 소스.
//
// ⚠️ 초안: 아래 본문은 구조를 잡기 위한 예시 텍스트다. 실제 운영 내용으로 교체할 것.
//
// [분리 계획] 이 섹션(src/lib/guide.ts · src/app/guide/** · src/components/guide/**)은
// 사이트 나머지와 의존성을 공유하지 않는다. 참조하는 건 디자인 토큰(globals.css)뿐이라
// 나중에 별도 프로젝트로 옮길 때 이 세 경로만 들어내면 된다.
//
// [로그인 계획] 2차에서 참가자 인증(Supabase Auth)을 붙일 자리는
// src/app/guide/layout.tsx 상단에 주석으로 표시해 두었다.

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "steps"; items: { title: string; body: string }[] }
  | {
      type: "callout";
      tone: "info" | "tip" | "warn";
      title?: string;
      text: string;
    }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "divider" };

export interface GuideDoc {
  slug: string;
  title: string;
  summary: string; // 목차 카드·문서 상단 리드 문장
  blocks: Block[];
}

export interface GuideSection {
  title: string; // 좌측 사이드바 그룹 라벨
  docs: GuideDoc[];
}

export const GUIDE: GuideSection[] = [
  {
    title: "시작하기",
    docs: [
      {
        slug: "overview",
        title: "캠퍼스 한눈에 보기",
        summary:
          "테크포임팩트 캠퍼스가 무엇이고 한 학기 동안 무엇을 만들게 되는지 정리했습니다.",
        blocks: [
          {
            type: "p",
            text: "테크포임팩트 캠퍼스는 대학생 팀이 사회혁신조직과 한 팀이 되어, 현장의 문제를 기술로 푸는 한 학기 프로그램입니다. 팀은 실제 사용자가 있는 문제를 받고, 학기 말에 동작하는 결과물과 그 과정을 함께 남깁니다.",
          },
          { type: "h2", text: "무엇을 만드나요" },
          {
            type: "ul",
            items: [
              "실제 사용자가 쓸 수 있는 서비스 또는 프로토타입",
              "문제 정의부터 검증까지의 과정 기록(스토리)",
              "이후 조직이 이어받아 운영할 수 있는 소스코드와 문서",
            ],
          },
          { type: "h2", text: "누가 함께하나요" },
          {
            type: "table",
            head: ["역할", "하는 일"],
            rows: [
              ["학생 팀", "문제 정의·설계·개발·검증. 결과물의 주인."],
              ["사회혁신가", "현장의 맥락과 사용자 접점 제공, 방향 피드백."],
              ["멘토", "기술·제품 관점의 정기 피드백."],
              ["운영진", "일정·예산·행사 운영, 커뮤니케이션 창구."],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "먼저 읽으면 좋은 문서",
            text: "처음이라면 「참가 전 체크리스트」 → 「학기 일정과 마일스톤」 순서로 보시면 전체 흐름이 잡힙니다.",
          },
        ],
      },
      {
        slug: "checklist",
        title: "참가 전 체크리스트",
        summary: "첫 주에 반드시 끝내야 하는 준비 항목입니다.",
        blocks: [
          {
            type: "p",
            text: "아래 항목은 프로젝트 킥오프 전에 모두 완료되어 있어야 합니다. 하나라도 비어 있으면 매칭 이후 진행이 막힐 수 있습니다.",
          },
          { type: "h2", text: "개인 준비" },
          {
            type: "ul",
            items: [
              "참가 신청서 제출 및 확정 안내 수신",
              "커뮤니케이션 채널 가입(공지 채널 · 팀 채널)",
              "계정 준비: 깃 저장소 호스팅, 협업 문서 도구",
              "개인정보 공개 범위 확인 — 공개되는 것은 이름과 소속뿐입니다",
            ],
          },
          { type: "h2", text: "팀 준비" },
          {
            type: "steps",
            items: [
              {
                title: "팀 구성 확정",
                body: "팀장 1명을 포함해 구성원과 역할을 정하고 운영진에 공유합니다.",
              },
              {
                title: "팀 저장소 생성",
                body: "공용 저장소를 만들고 구성원 전원에게 권한을 부여합니다.",
              },
              {
                title: "연락 체계 확인",
                body: "팀 채널에 사회혁신가·멘토·운영진이 모두 들어와 있는지 확인합니다.",
              },
            ],
          },
          {
            type: "callout",
            tone: "warn",
            title: "기한",
            text: "체크리스트 미완료 시 매칭 결과 안내가 지연될 수 있습니다. 기한은 공지 채널에서 확인하세요.",
          },
        ],
      },
    ],
  },
  {
    title: "프로그램 운영",
    docs: [
      {
        slug: "timeline",
        title: "학기 일정과 마일스톤",
        summary: "킥오프부터 데모데이까지, 각 구간에서 무엇을 끝내야 하는지.",
        blocks: [
          {
            type: "p",
            text: "한 학기는 크게 네 구간으로 나뉩니다. 각 구간 끝에는 확인 지점이 있고, 여기서 산출물을 공유합니다.",
          },
          {
            type: "table",
            head: ["구간", "핵심 활동", "구간 말 산출물"],
            rows: [
              ["킥오프", "매칭 확정 · 현장 이해 · 문제 재정의", "문제 정의서"],
              [
                "설계",
                "사용자 인터뷰 · 범위 확정 · 기술 선택",
                "기획안 · 화면 설계",
              ],
              [
                "개발",
                "구현 · 중간 점검 · 사용자 테스트",
                "동작하는 프로토타입",
              ],
              [
                "마무리",
                "안정화 · 인수인계 문서 · 발표 준비",
                "최종 결과물 · 발표 자료",
              ],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "구체적인 날짜는 학기마다 다릅니다. 확정 일정은 공지 채널의 고정 글을 기준으로 하세요.",
          },
          { type: "h2", text: "정기 일정" },
          {
            type: "ul",
            items: [
              "주간 팀 회의 — 팀 자율 운영, 회의록 남기기",
              "격주 멘토링 — 멘토와 팀 전체 참여",
              "월 1회 중간 공유 — 다른 팀과 진행 상황 공유",
            ],
          },
        ],
      },
      {
        slug: "matching",
        title: "사회혁신가 매칭",
        summary: "주제 선택부터 첫 미팅까지의 절차입니다.",
        blocks: [
          {
            type: "p",
            text: "매칭은 학교별로 제안된 주제 중에서 팀의 희망을 받아 조정하는 방식입니다. 주제 목록은 사회혁신가 페이지에서 볼 수 있습니다.",
          },
          {
            type: "steps",
            items: [
              {
                title: "주제 살펴보기",
                body: "조직 소개와 질문 키트를 읽고, 팀이 실제로 답을 만들 수 있는 문제인지 판단합니다.",
              },
              {
                title: "희망 주제 제출",
                body: "1~3순위를 이유와 함께 제출합니다. 이유가 구체적일수록 조정에 반영하기 쉽습니다.",
              },
              {
                title: "매칭 확정",
                body: "운영진이 조정 결과를 안내하고 팀 채널에 사회혁신가를 초대합니다.",
              },
              {
                title: "첫 미팅",
                body: "질문 키트를 미리 읽고 질문을 준비해서 들어갑니다. 이 자리에서 문제의 범위를 좁힙니다.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "첫 미팅에서 꼭 확인할 것",
            text: "누가 실제 사용자인지, 지금은 그 일을 어떻게 처리하고 있는지, 무엇이 바뀌면 성공인지 — 이 세 가지는 반드시 답을 받아 오세요.",
          },
        ],
      },
      {
        slug: "mentoring",
        title: "멘토링 운영",
        summary: "멘토링을 준비하고 활용하는 방법.",
        blocks: [
          {
            type: "p",
            text: "멘토링은 검사가 아니라 팀이 막힌 지점을 푸는 자리입니다. 준비된 만큼 얻어 갑니다.",
          },
          { type: "h2", text: "준비" },
          {
            type: "ul",
            items: [
              "지난 회차 이후 무엇이 바뀌었는지 3줄 요약",
              "지금 막혀 있는 것 1~2개 — 배경과 이미 시도한 것 포함",
              "결정이 필요한 선택지와 각각의 장단점",
            ],
          },
          { type: "h2", text: "이후" },
          {
            type: "ul",
            items: [
              "논의 결과와 결정 사항을 회의록에 남기기",
              "다음 회차까지 할 일을 담당자와 함께 적기",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "프로젝트 진행",
    docs: [
      {
        slug: "problem",
        title: "문제 정의와 리서치",
        summary: "받은 주제를 팀의 문제로 바꾸는 단계.",
        blocks: [
          {
            type: "p",
            text: "사회혁신가가 건네는 것은 주제이지 명세가 아닙니다. 팀이 할 첫 일은 그 주제를 풀 수 있는 크기의 문제로 좁히는 것입니다.",
          },
          { type: "h2", text: "좁히는 순서" },
          {
            type: "steps",
            items: [
              {
                title: "현장 이해",
                body: "조직이 지금 어떻게 일하는지 관찰하고, 가능하면 실제 업무를 한 번 따라 해 봅니다.",
              },
              {
                title: "사용자 인터뷰",
                body: "최소 3명. 해결책을 묻지 말고 겪은 일을 물어보세요.",
              },
              {
                title: "문제 한 문장",
                body: "「누가 · 어떤 상황에서 · 무엇 때문에 곤란한가」를 한 문장으로 씁니다.",
              },
              {
                title: "성공 기준",
                body: "학기 말에 무엇이 관측되면 성공인지 숫자나 상태로 적습니다.",
              },
            ],
          },
          {
            type: "callout",
            tone: "warn",
            title: "자주 하는 실수",
            text: "기술을 먼저 정하고 문제를 거기에 맞추는 것. 무엇을 만들지는 문제 한 문장이 나온 다음에 정하세요.",
          },
        ],
      },
      {
        slug: "collaboration",
        title: "개발과 협업 규칙",
        summary: "팀이 최소한으로 합의하고 갈 것들.",
        blocks: [
          {
            type: "p",
            text: "도구는 팀이 정하되, 아래 세 가지는 첫 주에 합의하고 문서로 남겨 두는 것을 권합니다.",
          },
          { type: "h2", text: "저장소" },
          {
            type: "ul",
            items: [
              "기본 브랜치는 항상 동작하는 상태 유지",
              "작업은 브랜치에서, 병합 전 최소 1명 리뷰",
              "비밀값은 저장소에 올리지 않기 — 환경 변수로 분리",
            ],
          },
          { type: "h2", text: "문서" },
          {
            type: "ul",
            items: [
              "README에 실행 방법 — 새 팀원이 그것만 보고 띄울 수 있게",
              "결정 사항은 결정한 날 기록 (무엇을·왜)",
              "회의록은 같은 자리에 모아 두기",
            ],
          },
          { type: "h2", text: "개인정보" },
          {
            type: "callout",
            tone: "warn",
            text: "인터뷰 기록·사용자 데이터에는 실명과 연락처가 들어가기 쉽습니다. 수집 전에 동의를 받고, 저장할 때는 식별 정보를 분리하세요. 공개 산출물에 들어가는 개인정보는 이름과 소속까지입니다.",
          },
        ],
      },
      {
        slug: "deliverables",
        title: "산출물 제출 가이드",
        summary: "학기 말에 무엇을, 어떤 형태로 내는지.",
        blocks: [
          {
            type: "table",
            head: ["산출물", "형태", "비고"],
            rows: [
              ["소스코드", "공개 저장소 링크", "README·라이선스 포함"],
              ["시연 영상", "3분 이내", "화면 녹화 + 음성 설명"],
              ["발표 자료", "PDF", "공개 아카이브에 게시"],
              ["프로젝트 소개", "제출 폼", "쇼케이스 사이트에 실리는 내용"],
              [
                "인수인계 문서",
                "문서 링크",
                "조직이 이어받아 운영할 수 있도록",
              ],
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "공개 범위",
            text: "제출한 내용은 검수 후 쇼케이스 사이트에 공개됩니다. 공개를 원하지 않는 항목이 있다면 제출 시 표시해 주세요.",
          },
          { type: "h2", text: "시연 영상 팁" },
          {
            type: "ul",
            items: [
              "문제 상황 → 해결 흐름 → 결과 순서로 구성",
              "실제 화면으로, 슬라이드 낭독은 피하기",
              "소리 없이 봐도 이해되도록 자막 넣기",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "지원과 정책",
    docs: [
      {
        slug: "support",
        title: "지원 내용과 정산",
        summary: "활동비 사용 범위와 정산 절차.",
        blocks: [
          {
            type: "p",
            text: "팀 활동에 필요한 비용은 정해진 범위 안에서 지원됩니다. 집행 전에 범위를 먼저 확인하세요.",
          },
          { type: "h2", text: "사용 가능 범위" },
          {
            type: "ul",
            items: [
              "개발·운영에 필요한 서비스 이용료",
              "사용자 리서치 진행에 드는 비용",
              "팀 활동에 필요한 자료 구입",
            ],
          },
          { type: "h2", text: "정산" },
          {
            type: "steps",
            items: [
              {
                title: "사전 확인",
                body: "범위가 애매하면 집행 전에 운영진에 문의합니다.",
              },
              {
                title: "증빙 보관",
                body: "영수증과 거래 내역을 항목별로 모아 둡니다.",
              },
              {
                title: "정산 제출",
                body: "정해진 기한 안에 양식에 맞춰 제출합니다.",
              },
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "증빙이 없는 지출은 정산되지 않습니다. 결제 즉시 증빙을 남기는 습관을 권합니다.",
          },
        ],
      },
      {
        slug: "faq",
        title: "자주 묻는 질문",
        summary: "문의가 많았던 항목을 모았습니다.",
        blocks: [
          { type: "h3", text: "팀원이 중간에 빠지면 어떻게 하나요?" },
          {
            type: "p",
            text: "확인되는 즉시 운영진에 알려 주세요. 남은 구성원과 범위를 다시 조정합니다. 팀 해체가 아니라 범위 조정이 원칙입니다.",
          },
          { type: "h3", text: "주제를 도중에 바꿀 수 있나요?" },
          {
            type: "p",
            text: "주제 자체를 바꾸긴 어렵지만, 리서치 결과에 따라 문제를 다시 정의하는 것은 권장합니다. 사회혁신가와 합의한 뒤 변경 사항을 공유해 주세요.",
          },
          { type: "h3", text: "결과물의 권리는 누구에게 있나요?" },
          {
            type: "p",
            text: "학생 팀이 만든 결과물의 권리는 팀에 있습니다. 다만 조직이 이어서 운영할 수 있도록 공개 라이선스로 배포하는 것을 원칙으로 합니다.",
          },
          { type: "h3", text: "학기 이후에도 프로젝트를 이어갈 수 있나요?" },
          {
            type: "p",
            text: "가능합니다. 이어가기를 원하는 팀은 운영진에 알려 주세요. 조직과의 연결을 계속 도와드립니다.",
          },
          { type: "divider" },
          {
            type: "callout",
            tone: "info",
            title: "여기에 없는 질문",
            text: "공지 채널의 문의 스레드에 남겨 주세요. 반복되는 질문은 이 문서에 추가합니다.",
          },
        ],
      },
    ],
  },
];

// ── 조회 헬퍼 ──

export function allDocs(): GuideDoc[] {
  return GUIDE.flatMap((s) => s.docs);
}

export function findDoc(slug: string): GuideDoc | undefined {
  return allDocs().find((d) => d.slug === slug);
}

/** 문서가 속한 섹션 제목 */
export function sectionOf(slug: string): string | undefined {
  return GUIDE.find((s) => s.docs.some((d) => d.slug === slug))?.title;
}

/** 하단 이전/다음 문서 */
export function neighbors(slug: string): {
  prev?: GuideDoc;
  next?: GuideDoc;
} {
  const docs = allDocs();
  const i = docs.findIndex((d) => d.slug === slug);
  if (i < 0) return {};
  return { prev: docs[i - 1], next: docs[i + 1] };
}

/** 우측 "이 페이지에서" 목록. 한글 제목은 앵커로 쓰기 번거로워 순번 id 를 부여한다. */
export function headings(
  doc: GuideDoc,
): { id: string; text: string; level: 2 | 3 }[] {
  return doc.blocks
    .map((b, i) =>
      b.type === "h2" || b.type === "h3"
        ? {
            id: headingId(i),
            text: b.text,
            level: b.type === "h2" ? (2 as const) : (3 as const),
          }
        : null,
    )
    .filter((h): h is { id: string; text: string; level: 2 | 3 } => h !== null);
}

export function headingId(index: number): string {
  return `s${index}`;
}

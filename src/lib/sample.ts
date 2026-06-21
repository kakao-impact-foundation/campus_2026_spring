import { Project, ProjectSchema } from "./types";
import { categoryOf } from "./categories";

// ── UI 개발용 샘플 데이터 ──
// 시안(docs/site-mockup.html)에 들어있던 프로젝트 데이터를 Project 형태로 옮긴 것.
// 실제 구글 시트(SHEET_JSON_URL)가 연결되면 getAllProjects()가 이 값을 쓰지 않는다.
// 스토리·팀·스펙은 화면 확인용 더미값(모든 프로젝트 공통)이다.

type Raw = {
  school: string;
  org: string;
  team: string;
  name: string;
  oneLiner: string;
  techField: string;
};

const RAW: Raw[] = [
  { school: "단국대", org: "경기연구원", team: "경기산책연구원", name: "오늘의 길", oneLiner: "정신 및 신체 건강 증진을 위한 산책로 추천 서비스", techField: "웹·모바일 개발" },
  { school: "한양대", org: "서울환경연합", team: "환경많이된다", name: "용기낼깡", oneLiner: "다회용기 사용을 인증하고 야구네컷 인증샷을 만들 수 있는 야구장 친환경 플랫폼", techField: "웹·모바일 개발 · 데이터 분석" },
  { school: "서강대", org: "스튜디오 우당탕탕", team: "뚝딱뚝딱", name: "온동네", oneLiner: "로컬 사장님의 SNS 콘텐츠 생성을 돕고, 로컬 선순환 구조와 방문객 유입을 이끄는 웹 서비스", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "연세대", org: "다로리인", team: "다이루리", name: "다로링크", oneLiner: "휴먼 인프라를 디지털화한 지역 기반 플랫폼", techField: "웹·모바일 개발 · 데이터 분석" },
  { school: "이화여대", org: "이주민통번역센터 링크", team: "뽀용뽀용", name: "Cura", oneLiner: "이주민 환자가 자신의 의료 정보를 모국어로 확인하고 스스로 관리할 수 있도록 돕는 의료정보 전달 플랫폼", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "단국대", org: "협동조합 청풍", team: "단풍", name: "잠시, 정류장", oneLiner: "강화도를 이끌어가는 관계인구 통합 플랫폼. 관계 서비스", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "이화여대", org: "옥천신문", team: "물뿌리화", name: "옥천옥(옥천OK)", oneLiner: "신규 귀농·귀촌인들을 위한 맞춤형 정책 진단부터 실제 정착 지원까지 한번에! 옥천군 정책 큐레이션 서비스", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "서강대", org: "안무서운회사", team: "포스트히키코모리", name: "포스트히키코모리 프로젝트: 피자이스케이프", oneLiner: "피자박스 퍼포먼스와 QR 게임을 통해 외로움과 고립은둔을 공공장소의 사회적 담론으로 이끌어내는 예술-게임 프로젝트.", techField: "게임개발" },
  { school: "이화여대", org: "토닥토닥 협동조합", team: "도담도담", name: "고민 한 조각", oneLiner: "고민 한 조각은 중·고등학생이 익명의 또래와 편지를 주고받으며 고민을 나누는 정서 소통 플랫폼입니다.", techField: "웹·모바일 개발" },
  { school: "연세대", org: "공익법단체 두루", team: "두루미", name: "두루미", oneLiner: "아동청소년이 자신의 법률 상황을 쉽게 이해하고 대응할 수 있도록 돕는 맞춤형 법률 안내 플랫폼", techField: "생성형 AI (LLM)" },
  { school: "서강대", org: "마인드풀커넥트", team: "3팀 몽글몽글", name: "하루틈", oneLiner: "2030 여성들의 반추사고 방지를 통한 정신건강 솔루션, 일상의 마음돌봄 다이어리 및 어플리케이션", techField: "웹·모바일 개발 · 심리-마음건강" },
  { school: "서강대", org: "넷스파", team: "FORSEA", name: "넷로그(NETLOG)", oneLiner: "재생 원료의 데이터 기반 추적 및 관리를 실현하는 폐어망 업사이클링 디지털 전환 플랫폼", techField: "웹·모바일 개발" },
  { school: "한양대", org: "토닥토닥 협동조합", team: "한결", name: "큐링(Qling)", oneLiner: "사람들의 고민을 AI를 통해 적절한 답변자에게 전송해, 고민과 경험을 이어주는 서비스.", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "연세대", org: "서울환경연합", team: "덜쓰는 사람들", name: "onloop", oneLiner: "교환학생 생활품 순환 플랫폼", techField: "웹·모바일 개발" },
  { school: "단국대", org: "스튜디오 우당탕탕", team: "탕탕특공대", name: "프로젝트 우당탕탕", oneLiner: "유휴공간을 기반으로 DIT(Do It Together) 프로젝트를 기획하고, 사람과 공간, 이야기를 연결하는 플랫폼 서비스", techField: "웹·모바일 개발 · 하드웨어·IoT" },
  { school: "연세대", org: "토닥토닥 협동조합", team: "토닥토닥해조", name: "Heulim (흘림)", oneLiner: "일상에서 불쑥 찾아오는 불편한 감정을 안전하게 흘려보내는, 2030 세대를 위한 감정 돌봄 서비스", techField: "웹·모바일 개발 · Flutter 기반 인터렉티브/그래픽스 앱" },
  { school: "단국대", org: "마인드풀커넥트", team: "마인드풀커넥트 소울[Soul] 팀", name: "마인드라우터 (MindRouter)", oneLiner: "랭귀싱 상태에 놓인 2030 청년을 위해, 안전한 비동기 별자리 소통과 맞춤형 다정한 개입(Soft Nudge)을 제공하는 모바일 앱", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "연세대", org: "서울환경연합", team: "B개발구역", name: "Groo 그루", oneLiner: "AI 사용자의 더 나은 질문 습관 형성을 돕는 서비스", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "단국대", org: "경기연구원", team: "기후보호대", name: "우리 학교 기후 환경 매니저", oneLiner: "학생들이 스스로 학교의 에너지 데이터를 읽고, 기후환경 문제를 발견하며, 개선 제안과 나눔까지 이어가는 참여형 기후환경 플랫폼", techField: "웹·모바일 개발" },
  { school: "이화여대", org: "다로리인", team: "다로리포터", name: "고령 농업인 모니터링 및 AI콜을 통한 응급 구조 솔루션 : HERO", oneLiner: "스마트밴드를 통한 이상 신호 감지, GPS 추적, AI콜로 혼자 일하는 고령 농업인의 구조 골든타임을 지키는 모니터링 및 구조 서비스", techField: "웹·모바일 개발 · 음성 AI" },
  { school: "서강대", org: "경기연구원", team: "기후동행키드", name: "껌구리의 도시 상경기", oneLiner: "2030세대의 기후 무력감을 공감과 재미로 허무는 AI 기후 앰버서더 껌구리를 활용한 소셜 캠페인", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "서강대", org: "마인드풀커넥트", team: "WeROK", name: "RootMate", oneLiner: "내가 키우는 식물이 나의 마음도 돌봐주는 앱. 식물을 돌보며 나를 돌봅니다.", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "한양대", org: "공익법단체 두루", team: "아이온", name: "아이로", oneLiner: "위기에 놓인 아동·청소년의 법률 정보 탐색과 초기 대응을 돕는 아동·청소년 맞춤 법률 가이드 서비스", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "이화여대", org: "토닥토닥 협동조합", team: "멘탈404", name: "MORBIT", oneLiner: "사람들의 마음건강을 선제적으로 돕는 나만의 위로 서비스", techField: "웹·모바일 개발" },
  { school: "연세대", org: "이주민통번역센터 링크", team: "나란히", name: "픽통", oneLiner: "언어장벽을 넘어 이주민이 중심이 되고 통역사와 함께하는 의료 통역 환경을 만드는 디지털 시각화 통증 문진 서비스", techField: "웹·모바일 개발" },
  { school: "서강대", org: "안무서운회사", team: "302 archive (8팀)", name: "문을 여는 방법", oneLiner: "은둔·고립청년을 '하루빨리 나와야 하는 사람'이 아니라 '기다림과 이해가 필요한 사람'으로 바라보게 만드는 인식개선 전시물", techField: "전시 · 예술" },
  { school: "한양대", org: "다로리인", team: "큰글씨", name: "두레(DURE)", oneLiner: "지역 교육 프로그램을 운영하는 기관과 강사를 위한 행정 관리 웹 서비스", techField: "웹·모바일 개발" },
  { school: "단국대", org: "안무서운회사", team: "안무서운단대", name: "도란도란", oneLiner: "은둔 청년에게 재택 말동무 활동을 제공하고, 정기적인 대화가 필요한 노인과 연결해주는 세대 간 소통 기반 일자리 플랫폼", techField: "웹·모바일 개발 · 데이터 분석" },
  { school: "연세대", org: "다로리인", team: "포로리", name: "DOUM", oneLiner: "귀촌 청년과 마을 어르신을 잇는 생활 도움 매칭 플랫폼", techField: "웹·모바일 개발 · 음성 AI" },
  { school: "서강대", org: "협동조합 청풍", team: "바람을 짓다", name: "지방 이주를 망설이는 청년에게, 떠나기 전 그 지역을 먼저 살아보게 하는 시뮬레이션 서비스", oneLiner: "유형 진단으로 나에게 맞는 지역을 찾고, 시뮬레이션으로 직접 살아본 뒤 이주를 결정하는 청년 지방 이주 매칭 서비스", techField: "웹·모바일 개발" },
  { school: "단국대", org: "넷스파", team: "ESPA(에스파)", name: "net-chain", oneLiner: "AI 기반 폐어망 적치장 모니터링 및 수거 최적화 플랫폼", techField: "웹·모바일 개발 · 컴퓨터 비전(CV)" },
  { school: "이화여대", org: "서울환경연합", team: "기후구조대", name: "옷옷", oneLiner: "방치된 옷을 다시 입고, 포인트로 순환시키는 캠퍼스 기반 의류 순환 플랫폼", techField: "웹·모바일 개발" },
  { school: "이화여대", org: "토닥토닥 협동조합", team: "오구오구", name: "Ogoo", oneLiner: "소비 뒤에 숨은 감정을 인식하지 못하는 청년들을 위한 서비스", techField: "웹·모바일 개발" },
  { school: "한양대", org: "이주민통번역센터 링크", team: "나란히", name: "나란히", oneLiner: "이주민 학부모를 위해 번역을 넘어 행동까지 돕는 다국어 학교생활 도우미 PWA", techField: "생성형 AI (LLM) · 웹·모바일 개발" },
  { school: "연세대", org: "옥천신문", team: "연송이", name: "다람쥐 택시 프로젝트", oneLiner: "교통 소외지역 주민들을 돕는 다람쥐택시 예약 관리 서비스", techField: "웹·모바일 개발" },
];

// 화면 확인용 공통 더미 스토리
const SAMPLE_STORY = {
  problem:
    "우리 팀은 일상 속 작은 불편함에서 출발했습니다. 거대하고 완벽한 해결책 대신, 실제 사용자가 매일 마주하는 구체적인 문제에 주목했고 현장의 목소리를 듣는 데서 프로젝트를 시작했습니다.",
  solution:
    "사용자 맞춤형 추천과 실시간 데이터 분석을 결합해, 꼭 필요한 정보를 적절한 순간에 전달하도록 설계했습니다. 기술이 사람을 대신하는 것이 아니라 사람을 돕는 방향을 가장 중요한 기준으로 삼았습니다.",
  challenge:
    "초기에는 데이터 확보와 주제 선정에 현실적인 한계가 있어 방향을 여러 번 다시 잡아야 했습니다. 팀원들과 부딪히고 다듬는 과정에서 오히려 문제를 더 선명하게 바라볼 수 있었습니다.",
  progress:
    "핵심 기능의 프로토타입을 완성하고 기본적인 사용자 테스트를 마쳤습니다. 수집한 피드백을 바탕으로 사용 흐름을 다듬고 있으며, 정식 배포를 위한 안정화 작업을 진행 중입니다.",
  reflection:
    "꼭 거창한 문제를 단번에 해결하지 않더라도, 일상의 작은 불편함에 주목하고 끝까지 다듬어가는 일에 의미가 있다는 것을 배웠습니다. 한 학기 동안 함께한 팀원들에게 감사를 전합니다.",
};

export const SAMPLE_PROJECTS: Project[] = RAW.map((r, i) =>
  ProjectSchema.parse({
    id: String(i + 1),
    school: r.school,
    org: r.org,
    team: r.team,
    name: r.name,
    oneLiner: r.oneLiner,
    category: categoryOf(r.org),
    outputType: "웹·모바일 서비스",
    stage: "프로토타입 완성 (주요 기능 개발을 완료했으며 시연 또는 테스트가 가능해요.)",
    techField: r.techField,
    techStack: "React, Next.js, TypeScript",
    leader: "홍길동",
    members: "김아무 · 이아무",
    advisors: "정효정 교수 · 이호준 교수",
    mentors: "양준식(joon.yang)",
    videoUrl: null,
    deckUrl: null,
    youtubeUrl: null,
    serviceUrl: null,
    repoUrl: null,
    story: SAMPLE_STORY,
  }),
);

// 카테고리 ↔ 사회혁신조직 매핑 + 테마색 (단일 진실 소스)
// 카드 태그 · 사이드바 · 상세 페이지 액센트가 모두 여기서 색/분류를 가져온다.
// 신규 조직이 추가되면 CATEGORY_ORGS 에만 등록하면 된다.

export const CATEGORIES = [
  "기후",
  "사회적 포용",
  "마음건강",
  "지역소멸",
] as const;
export type Category = (typeof CATEGORIES)[number];

// 카카오임팩트 주니어스쿨 포럼 식순 타이틀 색에서 추출
export const CATEGORY_COLOR: Record<Category, string> = {
  기후: "#8ee6c2",
  "사회적 포용": "#c0c0ff",
  마음건강: "#ffb8ff",
  지역소멸: "#ffe682",
};

export const CATEGORY_ORGS: Record<Category, string[]> = {
  기후: ["경기연구원", "서울환경연합", "넷스파"],
  "사회적 포용": ["이주민통번역센터 링크", "공익법단체 두루", "안무서운회사"],
  마음건강: ["마인드풀커넥트", "토닥토닥 협동조합"],
  지역소멸: ["다로리인", "협동조합 청풍", "옥천신문", "스튜디오 우당탕탕"],
};

// 조직 → 카테고리 역방향 lookup
export const ORG_TO_CATEGORY: Record<string, Category> = Object.fromEntries(
  CATEGORIES.flatMap((c) => CATEGORY_ORGS[c].map((org) => [org, c])),
) as Record<string, Category>;

export function categoryOf(org: string): Category | undefined {
  return ORG_TO_CATEGORY[org];
}

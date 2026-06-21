@AGENTS.md

# 테크포임팩트 캠퍼스 — 프로젝트 쇼케이스 사이트

대학생 팀이 사회혁신조직과 함께 기술로 사회 문제를 푼 캠퍼스 프로젝트를 외부에 공개하는 아카이브/쇼케이스 사이트.

- **기획서(원본, 옵시디언 볼트):** `/Users/joon.yang/Documents/Obsidian Vault/raw/work/campus/테크포임팩트 캠퍼스 사이트 기획.md`
- **디자인 시안(목업):** `docs/site-mockup.html` — 브라우저로 열면 리스트·상세·필터·셔플이 실제 데이터로 동작. **UI 구현의 기준 레퍼런스.**

## 단계
- **1차 (현재):** 정적 사이트, 페이지 2종 — ① 프로젝트 리스트 ② 프로젝트 상세. **GitHub Pages**에 정적 export 배포.
- **2차:** 로그인·프로젝트별 댓글 등 동적 기능 → **Vercel** 배포 + **Supabase**(Auth/DB). 같은 repo 사용. 프로젝트 데이터는 2차에서도 빌드 시 정적, 댓글·로그인만 동적.

## 스택
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · zod · Prettier.
- 데이터: 구글 폼 → 구글 시트 → (Apps Script가 `검수상태=공개` 행만 JSON 반환) → 빌드 시 fetch → SSG.
- 필터·셔플은 **클라이언트 사이드**(전체 로드 후 브라우저에서). 정렬 기본값 = 셔플.
- 업데이트: 1차는 GitHub Actions 수동 실행, 2차는 deploy hook.

## 구조
```
src/app/        layout.tsx · page.tsx(리스트) · projects/[id]/page.tsx(상세) · globals.css(디자인 토큰)
src/components/ Header · Footer · Hero · ProjectGrid('use client') · FilterSidebar · SchoolBar · ProjectCard · Embed
src/lib/        categories.ts(카테고리↔조직 매핑+색, 단일 소스) · types.ts(Project+zod) · drive.ts(/preview 변환) · sheet.ts(시트 fetch+정규화)
```

## 핵심 규칙
- **언어: 한국어** (UI 텍스트·주석).
- **디자인 토큰은 `src/app/globals.css` 의 @theme** 가 단일 소스. 색은 `bg-soft` `text-ink` `text-muted` 등 토큰 클래스로.
- **카테고리(주제) = 4종**: 기후 / 사회적포용 / 마음건강 / 지역소멸. 12개 조직이 여기 매핑됨 → `src/lib/categories.ts` 가 단일 소스.
- **색 위계(역할 분리)**: 카테고리=4색 테마(점·상세 액센트) / 학교 필터 선택=검정 `#1C1C1C` / 브랜드=카카오 옐로우 `#FAE100`(절제). 이모지 미사용.
- **카드**: 텍스트 전용 · 옅은 회색 면 · 라운드 · **높이 고정**. 상단 `학교·팀` / 제목(1줄 말줄임) / 소개(2줄) / 하단 카테고리 태그(테마색 점)·조직.
- **상세 순서**: 헤더(카테고리·학교·조직·팀) → 제목(형광펜 없음) → 한 줄 소개 → 팀 정보 → 시연 영상(단독 16:9) → 외부 링크(서비스·소스코드) → 한눈에 보기 → 스토리 5(01~05) → 발표 자료(하단). 상세 액센트 = 그 프로젝트의 카테고리 테마색.
- **개인정보**: 팀장·팀원 실명만 공개, 연락처·이메일 비공개.
- 푸터: 다크 `#272727`, 회색 텍스트, 4단 + 하단 바 (카카오임팩트 주니어스쿨 포럼 톤).

## 환경
- `.env.local` 에 `SHEET_JSON_URL`(Apps Script 엔드포인트). 미설정 시 `getProjects()`는 빈 배열 반환.
- 정적 export 빌드: `BUILD_TARGET=static npm run build` (GitHub Pages, `next.config.ts`의 basePath 사용).
- 개발: `npm run dev` → http://localhost:3000

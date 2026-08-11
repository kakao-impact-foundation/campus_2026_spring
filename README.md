# 테크포임팩트 캠퍼스

대학생 팀이 사회혁신조직과 함께 기술로 사회 문제를 풀어낸 캠퍼스 프로젝트를 공개하는 아카이브 · 쇼케이스 사이트.

🔗 https://kakao-impact-foundation.github.io/campus_2026_spring/

## 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4

## 페이지

- **프로젝트** (`/`, `/projects/[id]`) — 현재 학기 리스트·프로젝트 상세
- **지난 학기** (`/semesters/[학기]`) — 예: `/semesters/2025-2`
- **스토리** (`/stories`) — 캠퍼스 크리에이터 블로그/숏폼
- **갤러리** (`/gallery`, `/gallery/[id]`) — 대학별 성과발표회 사진

### 학기 구분

시트 `학기` 컬럼(`2026-1` 형식) 하나로 목록 페이지·드롭다운·상세가 자동 생성된다.

- 새 학기 데이터를 시트에 추가 → `src/lib/semesters.ts` 의 `CURRENT_SEMESTER` 만 올리면
  이전 학기는 `/semesters/<학기>` 로 내려가고 홈은 새 학기가 된다.
- 상세 URL: 26-1 은 기존 공유 링크 유지를 위해 `/projects/37`, 그 외 학기는 `/projects/2025-2-3`.
- 주제 카테고리 필터는 그 학기 **모든** 사회혁신조직이 `src/lib/categories.ts` 의
  `CATEGORY_ORGS` 에 매핑됐을 때만 켜지고, 그렇지 않으면 조직 목록만 보여준다.
- 시트에 비어 있는 항목은 상세에서 제목까지 숨긴다(빈 섹션은 섹션 번호도 다시 매김).

## 데이터

구글 폼 → 구글 시트/드라이브 → **빌드 시 fetch → 정적 생성(SSG)**.

- 프로젝트 · 스토리 · 갤러리 목록: 구글 시트 CSV
- 갤러리 사진: 구글 Drive API (`GOOGLE_API_KEY` 필요, 미설정 시 폴백)

## 개발

```bash
npm install
npm run dev   # http://localhost:3000
```

## 빌드 (정적 export)

```bash
BUILD_TARGET=static npm run build   # → out/
```

## 배포

`main` 에 push 하면 GitHub Actions가 빌드 후 GitHub Pages에 자동 배포한다.

- 코드 수정 후 push → 자동 재배포 (시트/드라이브 최신 데이터도 함께 반영)
- 시트/드라이브만 수정한 경우 → Actions 탭에서 **Run workflow** 수동 실행
- `GOOGLE_API_KEY` 는 **Settings → Secrets and variables → Actions** 에 등록

## 환경변수 (`.env.local`, git 미포함)

| 변수 | 용도 |
| --- | --- |
| `GOOGLE_API_KEY` | 갤러리 Drive API (사진 전량 로드) |
| `SHEET_CSV_URL` | (선택) 프로젝트 시트 소스 override |
| `SHEET_JSON_URL` | (선택, 2차) Apps Script 엔드포인트 |

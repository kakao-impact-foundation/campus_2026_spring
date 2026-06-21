import { z } from "zod";
import { CATEGORIES } from "./categories";

// 상세 페이지 스토리(주관식 5문항)
export const StorySchema = z.object({
  problem: z.string().default(""), // 우리가 주목한 문제
  solution: z.string().default(""), // 우리가 만든 '돕는 기술'
  challenge: z.string().default(""), // 가장 도전적이었던 순간
  progress: z.string().default(""), // 지금 어디까지 왔나
  reflection: z.string().default(""), // 한 학기를 돌아보며
});

export const ProjectSchema = z.object({
  id: z.string(),
  school: z.string(), // "단국대" 등 ("학교" 제거)
  org: z.string(), // 함께한 사회혁신조직
  team: z.string(),
  name: z.string(),
  oneLiner: z.string(),
  category: z.enum(CATEGORIES).optional(),
  award: z.string().default(""), // 수상 프로젝트 (상 이름, 없으면 "")

  // 한눈에 보기
  outputType: z.string().default(""), // 결과물 유형 (구 컬럼 — 미표시)
  outputTech: z.string().default(""), // 결과물 유형 및 핵심 기술 (통합 — 표시)
  stage: z.string().default(""), // 현재 진행 단계 ("프로토타입 완성 (설명)" 형태)
  techField: z.string().default(""), // 핵심 기술 분야 (구 컬럼 — 미표시)
  techStack: z.string().default(""), // 사용 기술 스택 (콤마로 복수 구분)

  // 팀
  leader: z.string().default(""),
  members: z.string().default(""),
  advisors: z.string().default(""), // 지도교수
  mentors: z.string().default(""), // 카카오멘토
  innovator: z.string().default(""), // 함께한 사회혁신가 (담당자 성함·직함)

  // 산출물·링크 (없으면 null → 해당 영역 숨김)
  videoUrl: z.string().nullable().default(null), // 드라이브 /preview
  deckUrl: z.string().nullable().default(null), // 드라이브 /preview (PDF)
  youtubeUrl: z.string().nullable().default(null), // 소개 영상 원본(유튜브) — 시트 추후
  serviceUrl: z.string().nullable().default(null),
  repoUrl: z.string().nullable().default(null),

  story: StorySchema,
});

export type Project = z.infer<typeof ProjectSchema>;

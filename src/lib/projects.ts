import { Project } from "./types";
import { getProjects } from "./sheet";
import { SAMPLE_PROJECTS } from "./sample";

// 페이지·generateStaticParams 가 공통으로 쓰는 데이터 진입점.
// 시트(SHEET_JSON_URL)가 연결돼 있으면 그 데이터를, 아니면 시안 샘플을 반환한다.
// → getProjects() 의 "미설정 시 빈 배열" 계약은 그대로 두고, UI 개발 중에도 화면이 채워지도록 한다.
export async function getAllProjects(): Promise<Project[]> {
  const real = await getProjects();
  return real.length ? real : SAMPLE_PROJECTS;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.id === id) ?? null;
}

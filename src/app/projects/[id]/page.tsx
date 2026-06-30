import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/ProjectDetailView";
import { getAllProjects, getProjectById } from "@/lib/projects";

// 정적 export: 빌드 시 모든 프로젝트 상세를 미리 생성하고, 그 외 경로는 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return {};
  return {
    title: `${project.name} — 테크포임팩트 캠퍼스`,
    description: project.oneLiner,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProjectById(id);
  if (!p) notFound();

  return <ProjectDetailView project={p} />;
}

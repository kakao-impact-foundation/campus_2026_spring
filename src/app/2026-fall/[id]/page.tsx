import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInnovators, getInnovatorById } from "@/lib/2026-fall";
import InnovatorDetailView from "@/components/2026-fall/InnovatorDetailView";

export const dynamicParams = false;

export async function generateStaticParams() {
  const innovators = await getInnovators();
  return innovators.map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const v = await getInnovatorById(id);
  if (!v) return {};
  return {
    title: `${v.org} — 테크포임팩트 캠퍼스`,
    description: v.intro.split("\n")[0].slice(0, 160),
  };
}

export default async function InnovatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const v = await getInnovatorById(id);
  if (!v) notFound();
  return <InnovatorDetailView innovator={v} />;
}

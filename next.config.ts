import type { NextConfig } from "next";

// 1차: GitHub Pages 정적 배포 → `BUILD_TARGET=static next build`
//   - user.github.io/<repo> 로 서빙되면 basePath 필요. 커스텀 도메인이면 REPO 를 "" 로.
// 2차: Vercel 동적 배포 → BUILD_TARGET 없이 `next build` (export/basePath 비활성)
const isStaticExport = process.env.BUILD_TARGET === "static";
// GitHub Pages 는 /<repo>/ 하위 서빙 → basePath 필요.
// 다른 호스트(루트 서빙, 예: Netlify/Surge 미리보기)용으로는 PAGES_REPO="" 로 basePath 끄기.
const REPO = process.env.PAGES_REPO ?? "campus_2026_spring";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      images: { unoptimized: true },
      trailingSlash: true,
      basePath: REPO ? `/${REPO}` : undefined,
      assetPrefix: REPO ? `/${REPO}/` : undefined,
    }
  : {};

export default nextConfig;

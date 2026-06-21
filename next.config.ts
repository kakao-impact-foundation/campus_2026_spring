import type { NextConfig } from "next";

// 1차: GitHub Pages 정적 배포 → `BUILD_TARGET=static next build`
//   - user.github.io/<repo> 로 서빙되면 basePath 필요. 커스텀 도메인이면 REPO 를 "" 로.
// 2차: Vercel 동적 배포 → BUILD_TARGET 없이 `next build` (export/basePath 비활성)
const isStaticExport = process.env.BUILD_TARGET === "static";
const REPO = "campus_2026_spring"; // GitHub repo 이름과 일치 (커스텀 도메인 사용 시 "" 로 변경)

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

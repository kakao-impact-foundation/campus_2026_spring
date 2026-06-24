import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 카카오 큰 글씨 (KakaoBigSans) — 메뉴·히어로 타이틀 등 브랜드 강조용
const kakaoBig = localFont({
  src: [
    { path: "./fonts/KakaoBigSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/KakaoBigSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/KakaoBigSans-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--kakao-big",
  display: "swap",
});

// 본문 폰트 (Pretendard Variable) — 셀프호스팅으로 윈도우/맥 동일 렌더 보장
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  weight: "45 920", // 가변 굵기 축 범위
  variable: "--pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  // 배포 도메인 + basePath (og:image 등 절대 URL 기준)
  metadataBase: new URL(
    "https://kakao-impact-foundation.github.io/campus_2026_spring/",
  ),
  title: "테크포임팩트 캠퍼스",
  description: "26-1학기 돕는 기술 보러가기",
  openGraph: {
    type: "website",
    siteName: "테크포임팩트 캠퍼스",
    title: "테크포임팩트 캠퍼스",
    description: "26-1학기 돕는 기술 보러가기",
    images: [{ url: "og.png", width: 1200, height: 630 }], // public/og.png (1200×630)
  },
  twitter: {
    card: "summary_large_image",
    title: "테크포임팩트 캠퍼스",
    description: "26-1학기 돕는 기술 보러가기",
    images: ["og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`h-full antialiased ${pretendard.variable} ${kakaoBig.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

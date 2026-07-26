import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "mymoney – Financial Management",
  description: "Multi-tenant financial tracking and management platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#cbd5e1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-slate-300 text-zinc-900`}>
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}

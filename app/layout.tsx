import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "NestScout AI",
  description: "AI-powered real estate listings and property discovery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-neutral-500">
              <span>© {new Date().getFullYear()} NestScout AI</span>
              <span>Built with Next.js, Prisma & Supabase</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

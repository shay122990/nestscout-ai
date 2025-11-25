import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="text-lg font-semibold tracking-tight">
                NestScout<span className="text-primary-600">AI</span>
              </div>
              <nav className="flex gap-4 text-sm text-neutral-600">
                <Link href="/" className="hover:text-neutral-900">
                  Home
                </Link>
                <a href="/listings" className="hover:text-neutral-900">
                  Listings
                </a>
                <a href="/dashboard" className="hover:text-neutral-900">
                  Dashboard
                </a>
              </nav>
            </div>
          </header>

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

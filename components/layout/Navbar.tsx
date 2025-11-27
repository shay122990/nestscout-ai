import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          NestScout<span className="text-blue-600">AI</span>
        </Link>

        <nav className="flex gap-4 text-sm text-neutral-600">
          <Link href="/" className="hover:text-neutral-900">
            Home
          </Link>
          <Link href="/listings" className="hover:text-neutral-900">
            Listings
          </Link>
          <Link href="/dashboard" className="hover:text-neutral-900">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

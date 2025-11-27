export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-neutral-500">
        <span>© {new Date().getFullYear()} NestScout AI</span>
        <span>Built with Next.js, Prisma & Supabase</span>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Kirish | lumoielts.uz",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <img src="/logo.png" alt="Lumo IELTS" className="w-10 h-10 rounded-xl shadow-xs" />
          <span className="font-extrabold text-xl tracking-tight text-[var(--foreground)]">
            lumo<span className="text-[var(--primary)]">ielts</span><span className="text-xs text-[var(--muted)] font-bold">.uz</span>
          </span>
        </Link>
        <div>
          <p className="eyebrow">IELTS Academic & General</p>
          <h1 className="text-2xl font-bold tracking-tight">O‘qishni davom ettiring</h1>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}

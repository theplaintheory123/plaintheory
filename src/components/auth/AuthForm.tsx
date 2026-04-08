import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthForm({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-10 flex items-center gap-2">
        <span className="font-mono text-xl font-light tracking-tight text-[#1A1817]">plaintheory</span>
        <span className="rounded-full bg-[#1A1817]/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#1A1817]/50">LifeOS</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-light text-[#1A1817] tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-[#1A1817]/50">{subtitle}</p>}
        </div>

        <div className="rounded-2xl border border-[#1A1817]/8 bg-white p-8 shadow-sm">
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-[#1A1817]/50">{footer}</div>}
      </div>
    </div>
  );
}

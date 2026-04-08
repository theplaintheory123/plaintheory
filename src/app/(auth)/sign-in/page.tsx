"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import PasswordInput from "@/components/auth/PasswordInput";
import { signIn } from "@/lib/auth/cognito";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await signIn(email, password);
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      router.push("/app");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to your LifeOS"
      footer={<>Don't have an account? <Link href="/sign-up" className="text-[#C2786B] hover:underline">Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1817]/70">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-[#1A1817]/12 bg-[#FAF8F5] px-4 py-3 text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30 focus:border-[#C2786B]/50 focus:ring-2 focus:ring-[#C2786B]/10 transition"
          />
        </div>

        <PasswordInput value={password} onChange={setPassword} label="Password" required />

        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-[#1A1817]/40 hover:text-[#C2786B] transition">
            Forgot password?
          </Link>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#1A1817] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1A1817]/80 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthForm>
  );
}

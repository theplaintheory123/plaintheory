"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import PasswordInput from "@/components/auth/PasswordInput";
import { signUp } from "@/lib/auth/cognito";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push(`/confirm?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Create your LifeOS"
      subtitle="Free forever. Your data, your control."
      footer={<>Already have an account? <Link href="/sign-in" className="text-[#C2786B] hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1817]/70">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-xl border border-[#1A1817]/12 bg-[#FAF8F5] px-4 py-3 text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30 focus:border-[#C2786B]/50 focus:ring-2 focus:ring-[#C2786B]/10 transition"
          />
        </div>
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
        <p className="text-xs text-[#1A1817]/40">Min 8 characters with uppercase, number, and symbol.</p>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#1A1817] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1A1817]/80 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthForm>
  );
}

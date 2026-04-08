"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { forgotPassword } from "@/lib/auth/cognito";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Reset your password"
      subtitle="We'll send a reset code to your email"
      footer={<Link href="/sign-in" className="text-[#C2786B] hover:underline">Back to sign in</Link>}
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
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#1A1817] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1A1817]/80 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send reset code"}
        </button>
      </form>
    </AuthForm>
  );
}

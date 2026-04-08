"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { confirmEmail } from "@/lib/auth/cognito";

function ConfirmForm() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromQuery = params.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmEmail(emailFromQuery, code);
      router.push("/sign-in?confirmed=1");
    } catch (err: any) {
      setError(err.message || "Confirmation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-[#1A1817]/60">
        We sent a 6-digit code to <strong>{emailFromQuery}</strong>.
      </p>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1817]/70">Confirmation Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
          maxLength={6}
          className="w-full rounded-xl border border-[#1A1817]/12 bg-[#FAF8F5] px-4 py-3 text-center text-xl tracking-widest text-[#1A1817] outline-none focus:border-[#C2786B]/50 focus:ring-2 focus:ring-[#C2786B]/10 transition"
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#1A1817] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1A1817]/80 disabled:opacity-50"
      >
        {loading ? "Confirming…" : "Confirm email"}
      </button>
    </form>
  );
}

export default function ConfirmPage() {
  return (
    <AuthForm
      title="Check your email"
      subtitle="Enter the confirmation code we sent you"
      footer={<Link href="/sign-in" className="text-[#C2786B] hover:underline">Back to sign in</Link>}
    >
      <Suspense>
        <ConfirmForm />
      </Suspense>
    </AuthForm>
  );
}

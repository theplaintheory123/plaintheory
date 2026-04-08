"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import PasswordInput from "@/components/auth/PasswordInput";
import { confirmNewPassword } from "@/lib/auth/cognito";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromQuery = params.get("email") || "";
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmNewPassword(emailFromQuery, code, password);
      router.push("/sign-in?reset=1");
    } catch (err: any) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1817]/70">Reset Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
          className="w-full rounded-xl border border-[#1A1817]/12 bg-[#FAF8F5] px-4 py-3 text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30 focus:border-[#C2786B]/50 focus:ring-2 focus:ring-[#C2786B]/10 transition"
        />
      </div>
      <PasswordInput value={password} onChange={setPassword} label="New Password" required />
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#1A1817] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1A1817]/80 disabled:opacity-50"
      >
        {loading ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Set new password"
      subtitle="Enter the code from your email and a new password"
      footer={<Link href="/sign-in" className="text-[#C2786B] hover:underline">Back to sign in</Link>}
    >
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthForm>
  );
}

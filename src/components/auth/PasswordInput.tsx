"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function PasswordInput({ value, onChange, placeholder = "Password", label, required }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-[#1A1817]/70">{label}</label>}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-[#1A1817]/12 bg-[#FAF8F5] px-4 py-3 pr-10 text-sm text-[#1A1817] outline-none placeholder:text-[#1A1817]/30 focus:border-[#C2786B]/50 focus:ring-2 focus:ring-[#C2786B]/10 transition"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1817]/30 hover:text-[#1A1817]/60 transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

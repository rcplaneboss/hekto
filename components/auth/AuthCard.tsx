"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Mail, Chrome, Sparkles, ArrowRight } from "lucide-react";

export default function AuthCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("resend", { email, callbackUrl: "/dashboard" });
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] dark:bg-slate-950 px-4 transition-all animate-in fade-in duration-500 w-full">
      <div className=" md:w-96  space-y-8 rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800">
        
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-[#FB2E86] mb-2">
            <Sparkles size={28} />
          </div>
          <h2 className="text-4xl font-black text-[#151875] dark:text-white tracking-tight font-josefin">
            Welcome <span className="text-[#FB2E86]">Back</span>
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Securely sign in to your curated dashboard
          </p>
        </div>

        <div className="space-y-4">
          {/* Google OAuth Button: Aligned with Product Secondary Buttons */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 px-4 py-4 text-sm font-bold text-[#151875] dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-700 shadow-inner active:scale-[0.98]"
          >
            <Chrome className="h-5 w-5 text-blue-500" />
            Continue with Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            <span className="mx-4 flex-shrink text-[10px] font-black uppercase tracking-widest text-slate-400 font-josefin">
              or use magic link
            </span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-800 py-4 pl-12 pr-4 text-sm font-medium dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#FB2E86] outline-none transition-all shadow-inner"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 rounded-3xl bg-[#FB2E86] py-5 text-sm font-black text-white transition-all hover:bg-pink-600 hover:shadow-xl hover:shadow-pink-500/30 active:scale-[0.98] disabled:bg-slate-300 dark:disabled:bg-slate-700 uppercase tracking-widest"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Send Login Link
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
            No password needed. <br />
            Check your inbox for a secure authentication link.
          </p>
        </div>
      </div>
    </div>
  );
}
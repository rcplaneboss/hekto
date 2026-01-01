
import { MailOpen, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] dark:bg-slate-900 px-4 transition-all animate-in fade-in duration-500 font-josefin">
      <div className="max-md:w-full max-w-md space-y-8 rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 text-center">
        
        {/* ICON HEADER */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-6 bg-pink-50 dark:bg-pink-900/20 rounded-[2rem] text-[#FB2E86] mb-2 shadow-inner">
            <MailOpen size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-black text-[#151875] dark:text-white tracking-tight">
            Check Your <span className="text-[#FB2E86]">Inbox</span>
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto">
            A secure magic link has been sent to your email address.
          </p>
        </div>

        {/* QUICK ACCESS BUTTONS: Styled like the Google Button in AuthCard */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Quick Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://mail.google.com" 
              target="_blank" 
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 py-4 text-xs font-bold text-[#151875] dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-700 shadow-inner active:scale-[0.98]"
            >
              Gmail <ExternalLink size={14} className="text-blue-500" />
            </a>
            <a 
              href="https://outlook.live.com" 
              target="_blank" 
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 py-4 text-xs font-bold text-[#151875] dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-700 shadow-inner active:scale-[0.98]"
            >
              Outlook <ExternalLink size={14} className="text-blue-400" />
            </a>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-6">
          <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">
            Didn't receive it? <br /> 
            Check your <span className="text-slate-600 dark:text-slate-300">spam folder</span> or try again.
          </p>
          
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FB2E86] hover:text-pink-600 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
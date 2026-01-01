import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button 
        type="submit"
        className="group flex items-center gap-3 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#151875] dark:text-slate-300 bg-transparent hover:bg-pink-50 dark:hover:bg-pink-900/10 rounded-2xl transition-all active:scale-[0.98]"
      >
        <LogOut size={16} className="text-slate-400 group-hover:text-[#FB2E86] transition-colors" />
        Sign Out
      </button>
    </form>
  );
}
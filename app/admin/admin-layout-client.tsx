"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  Search,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: string; // icon name to map on client
}

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Users,
  Gift: require("lucide-react").Gift,
  Flame: require("lucide-react").Flame,
  Image: require("lucide-react").Image,
  Star: require("lucide-react").Star,
  BookOpen: require("lucide-react").BookOpen,
  BarChart2: require("lucide-react").BarChart2,
  Settings,
}

export default function AdminLayoutClient({ children, navItems }: { children: React.ReactNode; navItems: NavItem[] }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] dark:bg-slate-950 transition-colors">
      
      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#151875] text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 flex flex-col shadow-2xl
      `}>
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold font-josefin tracking-tight text-white">
            Hekto<span className="text-[#FB2E86]">.</span>
          </h2>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = ICON_MAP[item.icon] || LayoutDashboard
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-[#FB2E86] text-white shadow-lg shadow-pink-500/30" 
                    : "text-indigo-100 hover:bg-white/10 hover:translate-x-1"}
                `}
              >
                <Icon size={22} className={`${isActive ? "text-white" : "text-indigo-300 group-hover:text-white"}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Quick Card */}
        <div className="p-4 mt-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FB2E86] flex items-center justify-center font-bold">A</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Admin User</p>
              <p className="text-[10px] text-indigo-300">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header / Top Bar */}
        <header className="h-20 border-b dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-transparent focus-within:border-[#FB2E86] transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none px-3 text-sm w-64 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-5">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FB2E86] rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
            <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="avatar" 
                className="w-8 h-8 rounded-full bg-indigo-100"
              />
              <span className="hidden sm:block text-sm font-bold text-slate-700 dark:text-slate-200">Hasanul</span>
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

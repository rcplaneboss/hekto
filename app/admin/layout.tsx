import AdminLayoutClient from "./admin-layout-client"
import { requireAdmin } from "@/lib/auth-utils"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "ShoppingBag" },
  { label: "Categories", href: "/admin/categories", icon: "Layers" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/admin/users", icon: "Users" },
  { label: "Promo", href: "/admin/promo", icon: "Gift" },
  { label: "Trending", href: "/admin/trending", icon: "Flame" },
  { label: "Banner", href: "/admin/banner", icon: "Image" },
  { label: "Reviews", href: "/admin/reviews", icon: "Star" },
  { label: "Blog", href: "/admin/blog", icon: "BookOpen" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart2" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check authorization on server - redirects if not admin
  await requireAdmin()

  return (
    <AdminLayoutClient navItems={NAV_ITEMS}>
      {children}
    </AdminLayoutClient>
  );
}
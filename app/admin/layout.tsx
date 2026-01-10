import AdminLayoutClient from "./admin-layout-client"
import { requireAdmin } from "@/lib/auth-utils"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  {
    label: "Catalog",
    icon: "ShoppingBag",
    children: [
      { label: "Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    label: "Orders",
    icon: "ShoppingCart",
    children: [
      { label: "Orders", href: "/admin/orders" },
      { label: "Customers", href: "/admin/users" },
    ],
  },
  {
    label: "Marketing",
    icon: "Gift",
    children: [
      { label: "Promo", href: "/admin/promo" },
      { label: "Trending", href: "/admin/trending" },
      { label: "Banner", href: "/admin/banner" },
      { label: "Blog", href: "/admin/blog" },
    ],
  },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart2" },
  {
    label: "Settings",
    icon: "Settings",
    children: [
      { label: "Store Settings", href: "/admin/settings/store" },
      { label: "Navigation Links", href: "/admin/settings/nav" },
      { label: "Static Pages", href: "/admin/settings/pages" },
      { label: "Newsletter", href: "/admin/settings/newsletter" },
      { label: "Contact Submissions", href: "/admin/settings/contact" },
      { label: "Site Configuration", href: "/admin/settings/config" },
    ],
  },
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

import AuthCard from "@/components/auth/AuthCard";
import BrandLogos from "@/components/BrandLogos";
import PageHeader from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <PageHeader title="My Account" />
      <AuthCard />
    </main>
  );
}
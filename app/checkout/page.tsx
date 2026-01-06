import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm"; 
import PageHeader from "@/components/PageHeader";

export default async function CheckoutPage() {
  const session = await auth();

  
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <main className="bg-white dark:bg-slate-900 min-h-screen">
      <PageHeader title="Checkout" />
      <CheckoutForm user={session.user} />
    </main>
  );
}
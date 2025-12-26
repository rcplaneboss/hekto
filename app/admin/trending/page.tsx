import { prisma } from "@/lib/db";
import TrendingPromoForm from "@/components/admin/TrendingPromoForm";
import { Trash2 } from "lucide-react";
import { deleteTrendingPromo } from "@/app/actions/trendingActions";

export default async function AdminTrendingPage() {
  const promos = await prisma.trendingPromo.findMany();

  return (
    <div className="w-screen min-h-screen bg-gray-100 dark:bg-slate-950">
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <TrendingPromoForm />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promos.map(promo => (
          <div key={promo.id} className="p-4 border rounded-lg flex justify-between items-center" style={{ backgroundColor: promo.bgColor }}>
            <div>
              <p className="font-bold text-[#151875]">{promo.title}</p>
              <p className="text-xs opacity-70">{promo.linkUrl}</p>
            </div>
            <form action={deleteTrendingPromo.bind(null, promo.id)}>
              <button className="text-red-500 hover:bg-white/50 p-2 rounded"><Trash2 size={18}/></button>
            </form>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
import NavigationLinksManager from "../../components/NavigationLinksManager";
import { prisma } from "@/lib/db";

export default async function NavigationLinksPage() {
  // Fetch all link groups and their nav links, ordered
  const groups = await prisma.linkGroup.findMany({
    orderBy: { order: "asc" },
    include: {
      links: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-josefin font-bold mb-2 text-[#151875] dark:text-white">
        Navigation Links
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Manage site navigation and menu structure.
      </p>
      <NavigationLinksManager groups={groups} />
    </div>
  );
}

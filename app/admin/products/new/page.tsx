
import { prisma } from "@/lib/db";
import AddProductForm from "./AddProductForm";

export default async function Page() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return <AddProductForm categories={categories} />;
}
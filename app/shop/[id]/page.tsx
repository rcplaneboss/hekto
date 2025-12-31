// app/shop/[id]/page.tsx
import { prisma } from "@/lib/db";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure the DB is queried every time
export const dynamic = "force-dynamic";

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      images: true,    //
      category: true,  //
      reviews: true,   
    },
  });

  if (!product) return notFound();

  // Convert Prisma JSON and Dates to plain objects for the Client Component
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return <ProductDetailsClient product={serializedProduct} />;
}
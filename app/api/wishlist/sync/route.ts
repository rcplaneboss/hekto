import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { productIds } = await req.json();

  // 1. Ensure a wishlist exists for this user
  const wishlist = await prisma.wishlist.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  // 2. Add all local items to the DB
  // Prisma's createMany with skipDuplicates: true is perfect here
  await prisma.wishlistItem.createMany({
    data: productIds.map((pid: string) => ({
      wishlistId: wishlist.id,
      productId: pid,
    })),
    skipDuplicates: true, // This prevents errors if an item is already there
  });

  // 3. Return the full updated wishlist
  const fullWishlist = await prisma.wishlistItem.findMany({
    where: { wishlistId: wishlist.id },
    include: { product: true }
  });

  return NextResponse.json(fullWishlist.map(item => item.product));
}
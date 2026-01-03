import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// GET current wishlist count
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: { 
      items: {
        include: { product: true } // Get the product details too
      } 
    },
  });

  // Map it so it's a simple array of products for the frontend
  const products = wishlist?.items.map(item => item.product) || [];
  return NextResponse.json(products);
}

// POST to toggle wishlist item
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { productId } = await req.json();

  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId: session.user.id } });
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (existingItem) {
    await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
  } else {
    await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
  }

  return NextResponse.json({ success: true });
}
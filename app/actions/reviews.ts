"use server";

import { prisma } from "@/lib/db"; 
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; 

export async function addReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be logged in to review");

  const productId = formData.get("productId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      rating,
      comment,
    },
  });

  revalidatePath(`/shop/${productId}`);
}
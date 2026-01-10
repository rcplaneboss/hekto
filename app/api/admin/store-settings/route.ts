import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const data = await req.json();

  // Map form fields to DB fields
  const updateData = {
    logoText: data.storeName,
    topBarEmail: data.storeEmail,
    topBarPhone: data.storePhone,
    footerAddress: data.storeAddress,
    currency: data.currency,
    taxRate: data.taxRate,
    maintenanceMode: data.maintenanceMode,
  };

  try {
    await prisma.storeSetting.update({
      where: { id: "global" },
      data: updateData,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

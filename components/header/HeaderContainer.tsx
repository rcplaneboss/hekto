import { prisma } from "@/lib/db";
import HeaderClient from "./HeaderClient";

export default async function HeaderContainer() {
  // Fetch global settings
  const settings = await prisma.storeSetting.findUnique({
    where: { id: "global" },
  });

  // Fetch navigation links where section is HEADER_MAIN
  const navLinks = await prisma.navLink.findMany({
    where: {
      group: { section: "HEADER_MAIN" },
    },
    orderBy: { order: "asc" },
  });

  return (
    <HeaderClient 
      settings={settings} 
      navLinks={navLinks} 
    />
  );
}
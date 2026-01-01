import { prisma } from "@/lib/db";
import HeaderClient from "./HeaderClient";
import { auth } from "@/auth"; 

export default async function HeaderContainer() {
  const session = await auth();
  const user = session?.user;

  const settings = await prisma.storeSetting.findUnique({
    where: { id: "global" },
  });

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
      user={user}
    />
  );
}
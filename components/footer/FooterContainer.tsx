import { prisma } from "@/lib/db";
import FooterClient from "./FooterClient";

export default async function FooterContainer() {
    const settings = await prisma.storeSetting.findUnique({
        where: { id: "global" },
    });

    // Fetch all Footer groups and their associated links
    const footerGroups = await prisma.linkGroup.findMany({
        where: { section: "FOOTER" },
        include: { links: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
    });

    return <FooterClient settings={settings} footerGroups={footerGroups} />;
}
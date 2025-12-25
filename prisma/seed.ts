import { PrismaClient, Prisma } from '../lib/prisma/client';

import { PrismaPg } from '@prisma/adapter-pg'


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});



async function main() {
  // 1. Seed Global Store Settings (Top Bar & Brand Info)
  // await prisma.storeSetting.upsert({
  //   where: { id: 'global' },
  //   update: {},
  //   create: {
  //     id: 'global',
  //     topBarEmail: "mhhasanul@gmail.com",
  //     topBarPhone: "(12345)67890",
  //     logoText: "Hekto",
  //     footerAddress: "17 Princess Road, London, Greater London NW1 8JR, UK",
  //     copyright: "©Webecy - All Rights Reserved"
  //   },
  // })

  // // 2. Seed Header Navigation Links
  // const headerGroup = await prisma.linkGroup.create({
  //   data: {
  //     title: "Main Menu",
  //     section: "HEADER_MAIN",
  //     links: {
  //       create: [
  //         { label: "Home", url: "/", order: 1 },
  //         { label: "Pages", url: "/pages", order: 2 },
  //         { label: "Products", url: "/products", order: 3 },
  //         { label: "Blog", url: "/blog", order: 4 },
  //         { label: "Shop", url: "/shop", order: 5 },
  //         { label: "Contact", url: "/contact", order: 6 },
  //       ]
  //     }
  //   }
  // })

  // // 3. Seed Footer Column: Categories
  // await prisma.linkGroup.create({
  //   data: {
  //     title: "Categories",
  //     section: "FOOTER",
  //     order: 1,
  //     links: {
  //       create: [
  //         { label: "Laptops & Computers", url: "/cat/laptops" },
  //         { label: "Cameras & Photography", url: "/cat/cameras" },
  //         { label: "Smart Phones & Tablets", url: "/cat/phones" },
  //         { label: "Video Games & Consoles", url: "/cat/gaming" },
  //         { label: "Waterproof Headphones", url: "/cat/headphones" },
  //       ]
  //     }
  //   }
  // })

  // // 4. Seed Footer Column: Customer Care
  // await prisma.linkGroup.create({
  //   data: {
  //     title: "Customer Care",
  //     section: "FOOTER",
  //     order: 2,
  //     links: {
  //       create: [
  //         { label: "My Account", url: "/account" },
  //         { label: "Discount", url: "/offers" },
  //         { label: "Returns", url: "/returns" },
  //         { label: "Orders History", url: "/orders" },
  //         { label: "Order Tracking", url: "/track" },
  //       ]
  //     }
  //   }
  // })

  // // 5. Seed Footer Column: Pages
  // await prisma.linkGroup.create({
  //   data: {
  //     title: "Pages",
  //     section: "FOOTER",
  //     order: 3,
  //     links: {
  //       create: [
  //         { label: "Blog", url: "/blog" },
  //         { label: "Browse the Shop", url: "/shop" },
  //         { label: "Category", url: "/categories" },
  //         { label: "Pre-Built Pages", url: "/pages" },
  //         { label: "Visual Composer Elements", url: "/elements" },
  //         { label: "WooCommerce Pages", url: "/woo" },
  //       ]
  //     }
  //   }
  // })


  // Add this inside your main() function in prisma/seed.ts
await prisma.heroBanner.create({
  data: {
    subTitle: "Best Furniture For Your Castle...",
    mainTitle: "New Furniture Collection Trends in 2024",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    imageUrl: "/images/hero-chair.png", // Replace with your actual asset path
    offTagText: "50% off",
    order: 1
  }
})

  console.log("Hekto Database has been seeded! 🌱")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
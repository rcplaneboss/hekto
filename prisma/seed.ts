import { PrismaClient } from '../lib/prisma/client';

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
// await prisma.heroBanner.create({
//   data: {
//     subTitle: "Best Furniture For Your Castle...",
//     mainTitle: "New Furniture Collection Trends in 2024",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.",
//     buttonText: "Shop Now",
//     buttonLink: "/shop",
//     imageUrl: "/images/hero-chair.png", // Replace with your actual asset path
//     offTagText: "50% off",
//     order: 1
//   }
// })

console.log("Seeding services...");
  // await prisma.service.createMany({
  //   data: [
  //     {
  //       title: "24/7 Support",
  //       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.",
  //       iconUrl: "/images/free-delivery.png", // Adjust file names as needed
  //       order: 1,
  //     },
  //     {
  //       title: "Free Delivery",
  //       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.",
  //       iconUrl: "/images/cashback.png",
  //       order: 2,
  //     },
  //     {
  //       title: "Premium Quality",
  //       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.",
  //       iconUrl: "/images/premium-quality.png",
  //       order: 3,
  //     },
  //     {
  //       title: "Cash Back",
  //       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.",
  //       iconUrl: "/images/24-support.png",
  //       order: 4,
  //     },
  //   ],
  // });



//   const blogs = [
//     {
//       title: "Top essential Trends in 2021",
//       slug: "top-essential-trends-2021-1",
//       author: "SoberAli",
//       excerpt: "More off this less hello samlande lied much over tightly circa horse taped mightly",
//       content: "Full blog content goes here for the single page view...",
//       mainImage: "/images/blog-1.png", // Replace with your actual image path
//       publishedAt: new Date("2020-08-21"),
//     },
//     {
//       title: "Top essential trends in 2021",
//       slug: "top-essential-trends-2021-2",
//       author: "Surfauxion",
//       excerpt: "More off this less hello samlande lied much over tightly circa horse taped mightly",
//       content: "Full blog content goes here...",
//       mainImage: "/images/blog-2.png",
//       publishedAt: new Date("2020-08-21"),
//     },
//     {
//       title: "Top essential Trends in 2021",
//       slug: "top-essential-trends-2021-3",
//       author: "SoberAli",
//       excerpt: "More off this less hello samlande lied much over tightly circa horse taped mightly",
//       content: "Full blog content goes here...",
//       mainImage: "/images/blog-3.png",
//       publishedAt: new Date("2020-08-21"),
//     },
//   ];

//   for (const blog of blogs) {
//     await prisma.blogPost.create({
//       data: blog,
//     });
//   }

//   console.log("Hekto Database has been seeded! 🌱")
// }


// await prisma.pageContent.upsert({
//     where: { slug: 'about-us' },
//     update: {},
//     create: {
//       slug: 'about-us',
//       title: 'Know About Our Ecommerce Business, History',
//       content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices mattis aliquam, malesuada diam est. Malesuada sem tristique amet erat vitae eget dolor lobortis. Accumsan faucibus vitae lobortis quis bibendum quam.',
//     },
//   })

//   // 2. Seed Testimonials (Our Client Say)
//   const testimonials = [
//     {
//       name: 'Selina Gomez',
//       role: 'Ceo At Webecy Digital',
//       content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non duis ultrices quam vel dui sollicitudin aliquet id et. Maecenas a lorem est. Aliquam id vitae scelerisque risus aliquet faucibus.',
//       imageUrl: '/images/client2.png', // The main focused client
//       order: 1,
//     },
//     {
//       name: 'John Doe',
//       role: 'Marketing Head',
//       content: 'Great experience working with this platform. The quality and delivery are top-notch.',
//       imageUrl: '/images/client1.png',
//       order: 0,
//     },
//     {
//       name: 'Jane Smith',
//       role: 'Designer',
//       content: 'The attention to detail in their products is unmatched. Highly recommended!',
//       imageUrl: '/images/client3.png',
//       order: 2,
//     }
//   ]

//   for (const t of testimonials) {
//     await prisma.testimonial.create({ data: t })
//   }
// await prisma.pageContent.upsert({
//   where: { slug: "contact-us" },
//   update: {},
//   create: {
//     slug: "contact-us",
//     title: "Information About us",
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices mattis aliquam, malesuada diam est. Malesuada sem tristique amet erat vitae eget dolor lobortis.",
//   },
// });

// Add inside main()
await prisma.faq.createMany({
  data: [
    {
      question: "Eu dictumst cum at sed euismod condimentum?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.",
    },
    {
      question: "Magna bibendum est fermentum eros.",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.",
    },
    {
      question: "Odio muskana hak eris conseekin sceleton?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.",
    },
    {
      question: "Elit id blandit sabara boi velit gua mara?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.",
    },
  ],
});
  console.log('✅ About Page data seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
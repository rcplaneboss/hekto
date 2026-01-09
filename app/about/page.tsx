import PageHeader from "@/components/PageHeader";
import HektoOffer from "@/components/HektoOffer";
import BrandLogos from "@/components/BrandLogos";
import TestimonialSection from "@/components/TestimonialSection"; // New import
import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export default async function AboutPage() {
  const [pageData, testimonials, brands] = await Promise.all([
    prisma.pageContent.findUnique({ where: { slug: "about-us" } }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.brand.findMany({ where: { isActive: true } }),
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <PageHeader title="About Us" />

      {/* History Section */}
      <section className="max-w-7xl mx-auto py-20 px-6 md:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="relative w-full lg:w-1/2 h-[400px]">
            <div className="absolute -bottom-10 -left-10 w-full h-full bg-[#3F509E] rounded-md z-0" />
            <div className="relative w-full h-full rounded-md overflow-hidden z-10 shadow-xl border-4 border-white dark:border-slate-800">
              <Image src="/images/about-business.webp" alt="Business" fill className="object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-josefin text-[#151875] dark:text-white">
              {pageData?.title}
            </h2>
            <p className="text-[#8A8FB9] dark:text-slate-400 font-lato leading-relaxed text-lg">
              {pageData?.content}
            </p>
            <Link href="/contact" className="inline-block bg-[#FB2E86] text-white px-10 py-3 rounded-md font-josefin hover:scale-105 transition-transform">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="py-10">
        <HektoOffer headerText="Our Features" />
      </div>

      {/* INTERACTIVE Testimonials Section */}
      {testimonials.length > 0 && (
        <TestimonialSection testimonials={testimonials} />
      )}

      {/* Brands Section */}
      {brands && (
        <div className="py-20 border-t border-slate-100 dark:border-slate-800">
          <BrandLogos brands={brands} />
        </div>
      )}
    </main>
  );
}
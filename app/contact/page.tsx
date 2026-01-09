import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/db";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const [pageData, settings] = await Promise.all([
    prisma.pageContent.findUnique({ where: { slug: "contact-us" } }),
    prisma.storeSetting.findUnique({ where: { id: "global" } }),
  ]);

  const contactWays = [
    { 
      bg: "bg-[#FB2E86]", 
      title: settings?.topBarPhone || "Tel: 877-67-88-99", 
      sub: `E-Mail: ${settings?.topBarEmail || "shop@mail.com"}` 
    },
    { 
      bg: "bg-[#FB2E86]", 
      title: "Support Forum", 
      sub: "For over 24hr" 
    },
    { 
      bg: "bg-[#FBB265]", 
      title: settings?.footerAddress || "Address:", 
      sub: "" 
    },
    { 
      bg: "bg-[#1BE982]", 
      title: "Free standard shipping", 
      sub: "on all orders." 
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <PageHeader title="Contact Us" />

      <div className="px-24 max-md:px-4 sm:px-6 py-20 sm:py-28">
        
        {/* TOP SECTION: Information & Contact Way */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 mb-20 sm:mb-32">
          
          {/* COLUMN 1: Information About Us */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-josefin text-[#151875] dark:text-white mb-6">
              {pageData?.title || "Information About us"}
            </h2>
            <p className="text-[#8A8FB9] dark:text-[#a3a7cc] font-lato text-base leading-7 mb-8 max-w-lg">
              {pageData?.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices mattis aliquam, malesuada diam est. Malesuada sem tristique amet erat vitae eget dolor lobortis. Accumsan faucibus vitae lobortis quis bibendum quam."}
            </p>
            
            {/* Colored Dots */}
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[#5625DF]" />
              <span className="w-8 h-8 rounded-full bg-[#FF27B7]" />
              <span className="w-8 h-8 rounded-full bg-[#37DAF3]" />
            </div>
          </div>

          {/* COLUMN 2: Contact Way */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-josefin text-[#151875] dark:text-white mb-8">
              Contact Way
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
              {contactWays.map((way, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {/* Large colored circle */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 ${way.bg}`} />
                  
                  {/* Text Details */}
                  <div className="font-lato text-[#8A8FB9] dark:text-[#a3a7cc] mb-1">
                    <p className="font-semibold text-base">{way.title}</p>
                    <p className="text-sm">{way.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Get In Touch & Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 mt-10">
          
          {/* COLUMN 1: Form */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-josefin text-[#151875] dark:text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-[#8A8FB9] dark:text-[#a3a7cc] font-lato text-base leading-7 mb-10 max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices mattis aliquam, malesuada diam est.
            </p>
            
            <ContactForm />
          </div>

          {/* COLUMN 2: Vector Image */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[600px] aspect-square">
              <Image 
                src="/images/contact-vector.png" // Ensure this image exists in public/images
                alt="Contact Illustration" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
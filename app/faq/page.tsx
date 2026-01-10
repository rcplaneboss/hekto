import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/db";
import FaqForm from "@/components/faq/FaqForm";
import Image from "next/image";

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany();

  return (
    <main className="min-h-screen bg-white dark:bg-[#101010] transition-colors duration-300">
      <PageHeader title="FAQ" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-28">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* LEFT COLUMN: General Information (FAQ List) */}
          <div className="space-y-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-josefin text-[#151875] dark:text-white">
              Generel Information
            </h2>
            
            <div className="space-y-12">
              {faqs.map((faq) => (
                <div key={faq.id} className="space-y-4">
                  <h3 className="text-[#151875] dark:text-[#E0E0E0] font-josefin font-bold text-lg sm:text-xl">
                    {faq.question}
                  </h3>
                  <p className="text-[#A1ABCC] dark:text-[#a3a7cc] font-lato text-base leading-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Ask a Question Form */}
          <div className="w-full bg-[#F8F8FD] dark:bg-[#1a1c29] p-8 sm:p-12 rounded-sm">
            <h2 className="text-2xl font-bold font-josefin text-[#151875] dark:text-white mb-8">
              Ask a Question
            </h2>
            <FaqForm />
          </div>

        </div>


      </div>
    </main>
  );
}
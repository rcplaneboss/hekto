"use client";

interface SectionHeadingProps {
  title: string;
  className?: string;
}

export default function SectionHeading({ title, className = "" }: SectionHeadingProps) {
  return (
    <h2 className={`text-[#151875] dark:text-white text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 font-josefin ${className}`}>
      {title}
    </h2>
  );
}
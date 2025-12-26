
import SectionHeading from "./SectionHeading";
import FeaturedCarouselWrapper from "./FeaturedCarouselWrapper";

export default function FeaturedProducts({ products }: { products: any[] }) {
  if (!products.length) return null;

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-24 max-w-7xl">
        <SectionHeading title="Featured Products" />
        
        {/* Pass the products received from page.tsx to the carousel */}
        <FeaturedCarouselWrapper products={products} />
      </div>
    </section>
  );
}
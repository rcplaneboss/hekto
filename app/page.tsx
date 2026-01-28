import { prisma } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import LatestProducts from "@/components/LatestProducts";
import HektoOffer from "@/components/HektoOffer";
import UniqueFeatures from "@/components/UniqueFeature";
import TrendingProducts from "@/components/TrendingProducts";
import DiscountSection from "@/components/DiscountSection";
import TopCategories from "@/components/TopCategories";
import NewsletterSection from "@/components/NewsletterSection";
import BrandLogos from "@/components/BrandLogos";
import LatestBlog from "@/components/LatestBlog";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

export default async function Home() {
  const [allHomeProducts, activePromo, trendingPromos, topCategories, discountCategories, brands, latestBlogs] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { tags: { has: "featured" } },
          { tags: { has: "latest" } },
          { tags: { has: "bestseller" } },
          { tags: { has: "special" } },
          { tags: { has: "trending" } },
          { tags: { has: "mini-list" } },
          { tags: { has: "" } }
        ]
      }
    }),
    prisma.promoBanner.findFirst({
      where: { isActive: true },
      include: { product: true },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.trendingPromo.findMany({
      where: { isActive: true },
      take: 2,
      orderBy: { id: 'asc' }
    }),

    prisma.category.findMany({
      where: { showOnTop: true },
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      where: { discountItem: { isNot: null } },
      include: {
        discountItem: { include: { product: true } }
      },
      orderBy: { name: 'asc' }
    }),

    prisma.brand.findMany({ where: { isActive: true } }),

    await prisma.blogPost.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
      take: 3,
    })
  ]);



  const featured = allHomeProducts.filter(p => p.tags.includes("featured"));
  const latestSectionProducts = allHomeProducts.filter(p =>
    p.tags.includes("latest") || p.tags.includes("bestseller") || p.tags.includes("special")
  );
  const trendingGrid = allHomeProducts.filter(p => p.tags.includes("trending")).slice(0, 4);
  const miniList = allHomeProducts.filter(p => p.tags.includes("mini-list")).slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden overflow-x-hidden">
      <HeroSection />
      <div className="pt-12">
        <SectionHeading title="Our Products" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-24 max-md:px-0">
          {allHomeProducts.map((product) => (
            <ProductCard key={product.id} product={product} view='grid' />
          ))}
        </div>
      </div>

      {featured && <FeaturedProducts products={featured} />}
      {latestSectionProducts && <LatestProducts products={latestSectionProducts} />}
      <HektoOffer />
      {activePromo && <UniqueFeatures promo={activePromo} />}
      {(trendingGrid || miniList || trendingPromos) && <TrendingProducts
        products={trendingGrid}
        promos={trendingPromos}
        miniList={miniList}
      />}
      {discountCategories && <DiscountSection categories={discountCategories} />}



      {topCategories && <TopCategories
        key={topCategories.length}
        categories={topCategories}
      />}

      <NewsletterSection />
      {brands && <BrandLogos brands={brands} />}

      {latestBlogs && <LatestBlog blogs={latestBlogs} />}
    </main>
  );
}
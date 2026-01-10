import StaticPagesManager from "../../components/StaticPagesManager";

export default function StaticPagesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-josefin font-bold mb-2 text-[#151875] dark:text-white">
        Static Pages
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Create and manage static pages like About, FAQ, and Contact.
      </p>
      <StaticPagesManager />
    </div>
  );
}

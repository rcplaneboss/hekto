import SiteConfigurationForm from "../../components/SiteConfigurationForm";

export default function SiteConfigurationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-josefin font-bold mb-2 text-[#151875] dark:text-white">
        Site Configuration
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Configure advanced site settings and features.
      </p>
      <SiteConfigurationForm />
    </div>
  );
}

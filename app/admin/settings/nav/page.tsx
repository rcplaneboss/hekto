import NavigationLinksManager from "../../components/NavigationLinksManager";

export default function NavigationLinksPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-josefin font-bold mb-2 text-[#151875] dark:text-white">
        Navigation Links
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Manage site navigation and menu structure.
      </p>
      <NavigationLinksManager />
    </div>
  );
}

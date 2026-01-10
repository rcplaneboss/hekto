import NewsletterManager from "../../components/NewsletterManager";

export default function NewsletterPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-josefin font-bold mb-2 text-[#151875] dark:text-white">
        Newsletter
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        View and manage newsletter subscribers.
      </p>
      <NewsletterManager />
    </div>
  );
}

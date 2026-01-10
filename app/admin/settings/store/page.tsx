import StoreSettingsForm from "../../components/StoreSettingsForm";
import { prisma } from "@/lib/db";

export default async function StoreSettingsPage() {
  const settings = await prisma.storeSetting.findUnique({ where: { id: "global" } });

  async function saveStoreSettings(formData: any) {
    "use server";
    const updateData = {
      logoText: formData.storeName,
      topBarEmail: formData.storeEmail,
      topBarPhone: formData.storePhone,
      footerAddress: formData.storeAddress,
      currency: formData.currency,
      taxRate: parseFloat(formData.taxRate),
    };
    await prisma.storeSetting.update({
      where: { id: "global" },
      data: updateData,
    });
    return { success: true };
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-josefin font-bold mb-2 text-[#151875] dark:text-white">
        Store Settings
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Configure your store's basic information and settings.
      </p>
      <StoreSettingsForm initialData={settings} saveAction={saveStoreSettings} />
    </div>
  );
}

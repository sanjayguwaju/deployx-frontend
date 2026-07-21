import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function GhatanaDarta() {
  return (
    <>
      <PageMeta title="Ghatana Darta | DeployX" description="Vital events registration system" />
      <PageBreadcrumb pageTitle="Vital Events (Ghatana Darta)" />
      
      <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Event Registration</h3>
        <p className="mb-6 text-sm text-gray-500">Register Birth, Death, Marriage, and Migration certificates here.</p>
        
        <div className="p-5 border border-dashed rounded-xl border-brand-200 bg-brand-50/50 dark:border-brand-500/20 dark:bg-brand-500/5">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Vital Events Registration workflow will be built here in subsequent iterations.
          </p>
        </div>
      </div>
    </>
  );
}

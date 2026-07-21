import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CitizensTable from "../../components/citizens/CitizensTable";
import { useTranslation } from "react-i18next";

export default function Citizens() {
  const { t } = useTranslation();
  return (
    <>
      <PageMeta
        title={`${t("citizens.page_title")} | DeployX`}
        description="Manage municipality citizens for DeployX"
      />
      <PageBreadcrumb pageTitle={t("citizens.page_title")} />
      <div className="space-y-6">
        <CitizensTable />
      </div>
    </>
  );
}

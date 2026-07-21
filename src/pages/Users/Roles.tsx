import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RolesTable from "../../components/users/RolesTable";
import { useTranslation } from "react-i18next";

export default function Roles() {
  const { t } = useTranslation();
  return (
    <>
      <PageMeta
        title={`${t("roles.page_title")} | DeployX`}
        description="Manage system roles and permissions for DeployX"
      />
      <PageBreadcrumb pageTitle={t("roles.page_title")} />
      <div className="space-y-6">
        <RolesTable />
      </div>
    </>
  );
}

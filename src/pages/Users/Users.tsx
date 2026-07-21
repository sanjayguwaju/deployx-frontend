import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UsersTable from "../../components/users/UsersTable";
import { useTranslation } from "react-i18next";

export default function Users() {
  const { t } = useTranslation();
  return (
    <>
      <PageMeta
        title={`${t("users.page_title")} | DeployX`}
        description="Manage system users for DeployX"
      />
      <PageBreadcrumb pageTitle={t("users.page_title")} />
      <div className="space-y-6">
        <UsersTable />
      </div>
    </>
  );
}

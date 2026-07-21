import { Helmet } from "react-helmet-async";
import WardsTable from "../../components/system/WardsTable";

export default function WardsAdmin() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Ward Management | DeployX</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ward Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add, edit, and manage wards within your municipality.
        </p>
      </div>

      <WardsTable />
    </div>
  );
}

import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BirthRegistrationsTable from "../../components/registrations/BirthRegistrationsTable";
import DeathRegistrationsTable from "../../components/registrations/DeathRegistrationsTable";
import MarriageRegistrationsTable from "../../components/registrations/MarriageRegistrationsTable";
import MigrationRegistrationsTable from "../../components/registrations/MigrationRegistrationsTable";

type RegistrationType = "birth" | "death" | "marriage" | "migration";

export default function Registrations() {
  const [activeTab, setActiveTab] = useState<RegistrationType>("birth");

  const renderActiveTable = () => {
    switch (activeTab) {
      case "birth":
        return <BirthRegistrationsTable />;
      case "death":
        return <DeathRegistrationsTable />;
      case "marriage":
        return <MarriageRegistrationsTable />;
      case "migration":
        return <MigrationRegistrationsTable />;
      default:
        return <BirthRegistrationsTable />;
    }
  };

  return (
    <>
      <PageMeta
        title="Vital Event Registrations | DeployX"
        description="Manage vital event registrations (Birth, Death, Marriage, Migration)"
      />
      <PageBreadcrumb pageTitle="Vital Event Registrations" />
      
      <div className="space-y-6">
        <div className="flex border-b border-gray-200 dark:border-white/5">
          <button
            onClick={() => setActiveTab("birth")}
            className={`py-3 px-5 font-medium text-sm border-b-2 ${
              activeTab === "birth"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Birth
          </button>
          <button
            onClick={() => setActiveTab("death")}
            className={`py-3 px-5 font-medium text-sm border-b-2 ${
              activeTab === "death"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Death
          </button>
          <button
            onClick={() => setActiveTab("marriage")}
            className={`py-3 px-5 font-medium text-sm border-b-2 ${
              activeTab === "marriage"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Marriage
          </button>
          <button
            onClick={() => setActiveTab("migration")}
            className={`py-3 px-5 font-medium text-sm border-b-2 ${
              activeTab === "migration"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Migration
          </button>
        </div>

        {renderActiveTable()}
      </div>
    </>
  );
}

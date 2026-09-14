import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import NotificationsTable from "../../components/notifications/NotificationsTable";
import BroadcastModal from "../../components/notifications/BroadcastModal";
import { useState } from "react";

export default function Notifications() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageMeta
        title="Notifications & Dispatches | DeployX"
        description="View SMS, Email, and Push notifications dispatched to candidates, employers, and agents"
      />
      <div className="flex items-center justify-between mb-4">
        <PageBreadcrumb pageTitle="Notifications" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-600 transition-colors"
        >
          Send Broadcast
        </button>
      </div>
      <div className="space-y-6">
        <NotificationsTable />
      </div>

      <BroadcastModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

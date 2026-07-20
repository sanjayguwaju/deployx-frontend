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
        title="Notifications Log | PalikaOS"
        description="View SMS, Email, and Push notifications sent to citizens"
      />
      <div className="flex items-center justify-between">
        <PageBreadcrumb pageTitle="Notifications" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 mb-6"
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

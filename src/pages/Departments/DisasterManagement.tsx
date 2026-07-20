import { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../../api/axios";
import { Can } from "../../context/AbilityContext";
import ApprovalBadge from "../../components/common/ApprovalBadge";
import { FormModal } from "../../components/ui/modal/FormModal";
import Select from "../../components/form/Select";

// Fix leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Incident {
  _id: string;
  type: string;
  location?: { coordinates: [number, number] }; // [lng, lat]
  reportedDateBs: string;
  severity: "low" | "medium" | "high" | "critical";
  wardId?: { _id: string; wardNumber: number };
}

interface ReliefApplication {
  _id: string;
  applicantName: string;
  incidentId: { _id: string; type: string; severity: string };
  requestedAmountNpr: number;
  status: "pending" | "approved" | "rejected" | "disbursed";
  approvalId?: { status: "pending" | "approved" | "rejected" };
}

export default function DisasterManagement() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [applications, setApplications] = useState<ReliefApplication[]>([]);
  const [wards, setWards] = useState<{ _id: string; wardNumber: number }[]>([]);
  const [incLoading, setIncLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(false);

  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isReliefModalOpen, setIsReliefModalOpen] = useState(false);

  const fetchWards = useCallback(async () => {
    try {
      const res = await api.get("/wards");
      if (res.data.success) {
        setWards(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchIncidents = useCallback(async () => {
    setIncLoading(true);
    try {
      const res = await api.get("/disaster-incidents");
      if (res.data.success) {
        setIncidents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIncLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    setAppLoading(true);
    try {
      const res = await api.get("/relief-applications");
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAppLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWards();
    fetchIncidents();
    fetchApplications();
  }, [fetchIncidents, fetchApplications, fetchWards]);

  const handleIncidentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get("type"),
      reportedDateBs: formData.get("reportedDateBs"),
      severity: formData.get("severity"),
      wardId: formData.get("wardId") || undefined,
    };
    try {
      await api.post("/disaster-incidents", data);
      setIsIncidentModalOpen(false);
      fetchIncidents();
    } catch (err: any) {
      console.error("Failed to report incident", err);
      alert(err.response?.data?.message || "Failed to report incident.");
    }
  };

  const handleReliefSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      applicantName: formData.get("applicantName"),
      incidentId: formData.get("incidentId"),
      requestedAmountNpr: Number(formData.get("requestedAmountNpr")),
    };
    try {
      await api.post("/relief-applications", data);
      setIsReliefModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      console.error("Failed to file relief application", err);
      alert(err.response?.data?.message || "Failed to file relief application.");
    }
  };

  const incidentsColumnHelper = createColumnHelper<Incident>();
  const incidentsColumns = useMemo(() => [
    incidentsColumnHelper.accessor("reportedDateBs", {
      header: "Date (BS)",
    }),
    incidentsColumnHelper.accessor("type", {
      header: "Type",
      cell: (info) => (
        <span className="font-medium text-gray-900 dark:text-white capitalize">
          {info.getValue()}
        </span>
      ),
    }),
    incidentsColumnHelper.accessor("wardId", {
      header: "Ward",
      cell: (info) => info.getValue() ? `Ward ${info.getValue()?.wardNumber}` : "Unknown",
    }),
    incidentsColumnHelper.accessor("severity", {
      header: "Severity",
      cell: (info) => {
        const severity = info.getValue();
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            severity === "critical" ? "bg-red-100 text-red-700 border-red-200" :
            severity === "high" ? "bg-orange-100 text-orange-700 border-orange-200" :
            severity === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
            "bg-green-100 text-green-700 border-green-200"
          }`}>
            {severity.toUpperCase()}
          </span>
        );
      },
    }),
  ], []);

  const incidentsTable = useReactTable({
    data: incidents,
    columns: incidentsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const appColumnHelper = createColumnHelper<ReliefApplication>();
  const appColumns = useMemo(() => [
    appColumnHelper.accessor("applicantName", {
      header: "Applicant Name",
      cell: (info) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    appColumnHelper.accessor("incidentId", {
      header: "Incident Type",
      cell: (info) => {
        const incident = info.getValue();
        return (
          <span className="capitalize">
            {incident?.type} ({incident?.severity})
          </span>
        );
      },
    }),
    appColumnHelper.accessor("requestedAmountNpr", {
      header: "Requested (NPR)",
      cell: (info) => {
        const val = info.getValue();
        return (
          <span className="text-right font-mono block">
            {val ? val.toLocaleString() : "-"}
          </span>
        );
      },
    }),
    appColumnHelper.accessor("status", {
      header: "Workflow Status",
      cell: (info) => {
        const row = info.row.original;
        return <ApprovalBadge status={row.approvalId?.status || row.status} />;
      },
    }),
  ], []);

  const appsTable = useReactTable({
    data: applications,
    columns: appColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageMeta
        title="Disaster Management | Local Government Operating System"
        description="Disaster Management module for LGOS."
      />
      <PageBreadcrumb pageTitle="Disaster Management" />
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Incidents Table */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Disaster Incidents
            </h3>
            <Can I="create" a="DisasterIncident">
              <button 
                onClick={() => setIsIncidentModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + Report Incident
              </button>
            </Can>
          </div>
          
          <div className="overflow-x-auto h-[350px] overflow-y-auto relative">
            <DataTable table={incidentsTable} isLoading={incLoading} />
          </div>
        </div>

        {/* Live Map */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Incident Map
          </h3>
          <div className="flex-1 min-h-[350px] w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden z-0">
            {/* PalikaOS Approx Center [Lat, Lng] */}
            <MapContainer center={[29.2312, 81.7225]} zoom={11} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {incidents.map((inc) => (
                inc.location && (
                  <Marker key={inc._id} position={[inc.location.coordinates[1], inc.location.coordinates[0]]}>
                    <Popup>
                      <strong>{inc.type.toUpperCase()}</strong><br />
                      Date: {inc.reportedDateBs}<br />
                      Severity: {inc.severity}
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Relief Applications */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="flex justify-between items-center mb-5 lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Relief Applications
          </h3>
          <Can I="create" a="ReliefApplication">
            <button 
              onClick={() => setIsReliefModalOpen(true)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
            >
              + File Application
            </button>
          </Can>
        </div>
        
        <DataTable table={appsTable} isLoading={appLoading} />
      </div>

      <FormModal isOpen={isIncidentModalOpen} onClose={() => setIsIncidentModalOpen(false)} title="Report Disaster Incident">
        <form onSubmit={handleIncidentSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Incident Type *</label>
              <Select name="type" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="landslide">Landslide</option>
                <option value="flood">Flood</option>
                <option value="fire">Fire</option>
                <option value="earthquake">Earthquake</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity *</label>
              <Select name="severity" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date (BS) *</label>
              <input name="reportedDateBs" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. 2081/03/15" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward (Optional)</label>
              <Select name="wardId" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="">Municipality Wide</option>
                {wards.map(w => (
                  <option key={w._id} value={w._id}>Ward {w.wardNumber}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsIncidentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save Incident</button>
          </div>
        </form>
      </FormModal>

      <FormModal isOpen={isReliefModalOpen} onClose={() => setIsReliefModalOpen(false)} title="File Relief Application">
        <form onSubmit={handleReliefSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Applicant Name *</label>
            <input name="applicantName" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Shyam Thapa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Related Incident *</label>
              <Select name="incidentId" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="">Select an Incident</option>
                {incidents.map(inc => (
                  <option key={inc._id} value={inc._id}>
                    {inc.type.toUpperCase()} - {inc.reportedDateBs} ({inc.severity})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requested Amount (NPR) *</label>
              <input name="requestedAmountNpr" type="number" min="1" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. 15000" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Filing a relief application requires multi-tier approval before the funds are disbursed.</p>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsReliefModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Submit Application</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}

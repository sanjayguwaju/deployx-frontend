import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd";
import { 
  Search, 
  Plus, 
  Briefcase, 
  Globe, 
  History, 
  Trash2, 
  ChevronDown, 
  X, 
  UserCheck, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Phone
} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// The strict order of 10 recruitment pipeline stages
const STAGES = [
  { id: "applied", label: "Applied", color: "border-blue-500 text-blue-700 dark:text-blue-400", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  { id: "shortlisted", label: "Shortlisted", color: "border-indigo-500 text-indigo-700 dark:text-indigo-400", badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" },
  { id: "interview", label: "Interview", color: "border-amber-500 text-amber-700 dark:text-amber-400", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  { id: "selected", label: "Selected", color: "border-emerald-500 text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { id: "medical", label: "Medical", color: "border-cyan-500 text-cyan-700 dark:text-cyan-400", badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300" },
  { id: "visa", label: "Visa", color: "border-purple-500 text-purple-700 dark:text-purple-400", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
  { id: "ticket", label: "Ticket", color: "border-sky-500 text-sky-700 dark:text-sky-400", badge: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300" },
  { id: "deployment", label: "Deployment", color: "border-orange-500 text-orange-700 dark:text-orange-400", badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300" },
  { id: "completed", label: "Completed", color: "border-green-600 text-green-700 dark:text-green-400", badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  { id: "rejected", label: "Rejected", color: "border-rose-500 text-rose-700 dark:text-rose-400", badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300" }
];

const STAGE_MAP = new Map(STAGES.map((s) => [s.id, s.label]));

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  profession?: string;
  passportNumber?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
}

interface Demand {
  _id: string;
  trackingNumber?: string;
  profession: string;
  country: string;
  quantityRequired: number;
  status: string;
  employerId?: {
    _id: string;
    companyName: string;
    country?: string;
  };
}

interface PipelineRecord {
  _id: string;
  candidateId: Candidate;
  demandId: string | Demand;
  stage: string;
  score?: number;
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

interface StageHistoryItem {
  stage: string;
  enteredAt: string;
  enteredBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function PipelineBoard() {
  const { id: urlDemandId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [demands, setDemands] = useState<Demand[]>([]);
  const [selectedDemandId, setSelectedDemandId] = useState<string>(urlDemandId || "");
  const [boardData, setBoardData] = useState<Record<string, PipelineRecord[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal: Add candidate to pipeline
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [initialStage, setInitialStage] = useState("applied");
  const [notes, setNotes] = useState("");
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Modal: Stage history
  const [historyRecord, setHistoryRecord] = useState<PipelineRecord | null>(null);
  const [historyItems, setHistoryItems] = useState<StageHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Quick move menu open record
  const [activeMenuRecordId, setActiveMenuRecordId] = useState<string | null>(null);

  // Load demands
  useEffect(() => {
    fetchDemands();
  }, []);

  // Update selectedDemandId if url parameter changes
  useEffect(() => {
    if (urlDemandId) {
      setSelectedDemandId(urlDemandId);
    }
  }, [urlDemandId]);

  // Load pipeline whenever selectedDemandId changes
  useEffect(() => {
    if (selectedDemandId) {
      fetchBoardData(selectedDemandId);
    }
  }, [selectedDemandId]);

  const fetchDemands = async () => {
    try {
      const res = await api.get("/demands?pageSize=100");
      const list = res.data.data || [];
      setDemands(list);

      // Auto-select first demand if none selected from URL
      if (!urlDemandId && list.length > 0) {
        setSelectedDemandId(list[0]._id);
      }
    } catch (err) {
      console.error("Failed to load demands:", err);
    }
  };

  const fetchBoardData = async (demandId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/pipeline?demandId=${demandId}`);
      const rawData = res.data.data?.grouped || res.data.data || {};

      const normalized: Record<string, PipelineRecord[]> = {};
      STAGES.forEach((s) => {
        normalized[s.id] = rawData[s.id] || [];
      });

      setBoardData(normalized);
    } catch (err) {
      toast.error("Failed to load pipeline records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (selectedDemandId) {
      setRefreshing(true);
      fetchBoardData(selectedDemandId);
    }
  };

  const handleSelectDemand = (demandId: string) => {
    setSelectedDemandId(demandId);
    if (urlDemandId) {
      navigate(`/demands/${demandId}/pipeline`);
    }
  };

  // Drag and drop handler
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    // Optimistic UI update
    const newBoard = { ...boardData };
    const sourceList = [...(newBoard[sourceStage] || [])];
    const destList = [...(newBoard[destStage] || [])];

    const [movedItem] = sourceList.splice(source.index, 1);
    if (!movedItem) return;

    movedItem.stage = destStage;
    destList.splice(destination.index, 0, movedItem);

    newBoard[sourceStage] = sourceList;
    newBoard[destStage] = destList;
    setBoardData(newBoard);

    try {
      await api.patch(`/pipeline/${draggableId}/stage`, {
        stage: destStage
      });
      toast.success(`Candidate moved to ${STAGE_MAP.get(destStage) || destStage}`);
    } catch (err) {
      toast.error("Failed to update stage. Reverting...");
      if (selectedDemandId) fetchBoardData(selectedDemandId);
    }
  };

  // Quick move stage button
  const handleQuickMove = async (record: PipelineRecord, newStage: string) => {
    setActiveMenuRecordId(null);
    if (record.stage === newStage) return;

    // Optimistic update
    const sourceStage = record.stage;
    const newBoard = { ...boardData };
    newBoard[sourceStage] = (newBoard[sourceStage] || []).filter((r) => r._id !== record._id);
    const updatedRecord = { ...record, stage: newStage };
    newBoard[newStage] = [updatedRecord, ...(newBoard[newStage] || [])];
    setBoardData(newBoard);

    try {
      await api.patch(`/pipeline/${record._id}/stage`, { stage: newStage });
      toast.success(`Candidate moved to ${STAGE_MAP.get(newStage) || newStage}`);
    } catch (err) {
      toast.error("Failed to move candidate. Reverting...");
      if (selectedDemandId) fetchBoardData(selectedDemandId);
    }
  };

  // Remove candidate from pipeline
  const handleRemove = async (record: PipelineRecord) => {
    setActiveMenuRecordId(null);
    const candidateName = record.candidateId 
      ? `${record.candidateId.firstName} ${record.candidateId.lastName}` 
      : "candidate";

    if (!window.confirm(`Are you sure you want to remove ${candidateName} from this pipeline?`)) {
      return;
    }

    const stage = record.stage;
    const newBoard = { ...boardData };
    newBoard[stage] = (newBoard[stage] || []).filter((r) => r._id !== record._id);
    setBoardData(newBoard);

    try {
      await api.delete(`/pipeline/${record._id}`);
      toast.success("Candidate removed from pipeline");
    } catch (err) {
      toast.error("Failed to remove candidate");
      if (selectedDemandId) fetchBoardData(selectedDemandId);
    }
  };

  // Open stage history modal
  const handleOpenHistory = async (record: PipelineRecord) => {
    setActiveMenuRecordId(null);
    setHistoryRecord(record);
    setLoadingHistory(true);
    try {
      const res = await api.get(`/pipeline/${record._id}/history`);
      setHistoryItems(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load stage progression history");
      setHistoryItems([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Open Add Candidate modal
  const handleOpenAddModal = async () => {
    setIsAddModalOpen(true);
    setSelectedCandidateId("");
    setInitialStage("applied");
    setNotes("");

    try {
      const res = await api.get("/candidates?pageSize=100");
      setCandidatesList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch available candidates");
    }
  };

  // Submit candidate to pipeline
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) {
      toast.error("Please select a candidate");
      return;
    }
    if (!selectedDemandId) {
      toast.error("Please select a Job Demand");
      return;
    }

    setSubmittingAdd(true);
    try {
      const res = await api.post("/pipeline", {
        candidateId: selectedCandidateId,
        demandId: selectedDemandId,
        stage: initialStage,
        notes: notes ? [notes] : []
      });

      toast.success("Candidate enrolled in pipeline!");
      setIsAddModalOpen(false);

      // Add to board state
      const createdRecord = res.data.data;
      if (createdRecord) {
        setBoardData((prev) => ({
          ...prev,
          [initialStage]: [createdRecord, ...(prev[initialStage] || [])]
        }));
      } else {
        fetchBoardData(selectedDemandId);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add candidate to pipeline");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Selected demand object
  const currentDemand = useMemo(() => {
    return demands.find((d) => d._id === selectedDemandId);
  }, [demands, selectedDemandId]);

  // Overall statistics for active demand
  const stats = useMemo(() => {
    let totalEnrolled = 0;
    let totalSelected = 0;
    let totalDeployed = 0;

    Object.entries(boardData).forEach(([stage, records]) => {
      totalEnrolled += records.length;
      if (["selected", "medical", "visa", "ticket", "deployment", "completed"].includes(stage)) {
        totalSelected += records.length;
      }
      if (stage === "deployment" || stage === "completed") {
        totalDeployed += records.length;
      }
    });

    return { totalEnrolled, totalSelected, totalDeployed };
  }, [boardData]);

  // Filtered board data based on client-side search query
  const filteredBoardData = useMemo(() => {
    if (!searchQuery.trim()) return boardData;
    const q = searchQuery.toLowerCase();
    const result: Record<string, PipelineRecord[]> = {};

    STAGES.forEach((stage) => {
      result[stage.id] = (boardData[stage.id] || []).filter((rec) => {
        const name = `${rec.candidateId?.firstName || ""} ${rec.candidateId?.lastName || ""}`.toLowerCase();
        const passport = (rec.candidateId?.passportNumber || "").toLowerCase();
        const profession = (rec.candidateId?.profession || "").toLowerCase();
        return name.includes(q) || passport.includes(q) || profession.includes(q);
      });
    });

    return result;
  }, [boardData, searchQuery]);

  // Set of candidate IDs already enrolled in this demand
  const enrolledCandidateIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(boardData).forEach((records) => {
      records.forEach((r) => {
        if (r.candidateId?._id) ids.add(r.candidateId._id);
      });
    });
    return ids;
  }, [boardData]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
      <PageMeta
        title="Candidate Pipelines | DeployX"
        description="Overseas manpower recruitment pipeline and Kanban candidate tracking."
      />

      {/* Header Bar */}
      <div className="flex-shrink-0 bg-white dark:bg-boxdark border-b border-gray-200 dark:border-strokedark px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <PageBreadcrumb pageTitle="Recruitment Pipeline" />
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              <span>Overseas deployment tracking</span>
              <span>•</span>
              <span>10-stage automated state machine</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Demand Selector */}
            <div className="relative">
              <select
                value={selectedDemandId}
                onChange={(e) => handleSelectDemand(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-meta-4 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-xs rounded-lg pl-3 pr-8 py-1.5 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {demands.length === 0 ? (
                  <option value="">No Job Demands found</option>
                ) : (
                  demands.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.profession} &mdash; {d.country} {d.employerId?.companyName ? `(${d.employerId.companyName})` : ""}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing || !selectedDemandId}
              title="Refresh Pipeline"
              className="p-1.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-meta-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-strokedark transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {/* Add Candidate Button */}
            <button
              onClick={handleOpenAddModal}
              disabled={!selectedDemandId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Enroll Candidate
            </button>
          </div>
        </div>

        {/* Selected Demand Banner & Stats */}
        {currentDemand && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-strokedark/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                <Briefcase className="w-3.5 h-3.5 text-brand-500" />
                <span>{currentDemand.profession}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>{currentDemand.country}</span>
              </div>
              {currentDemand.employerId?.companyName && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Employer: <strong className="text-gray-700 dark:text-gray-200">{currentDemand.employerId.companyName}</strong>
                  </span>
                </>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-meta-4 px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">
                <span className="text-gray-500">Target Quota:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{currentDemand.quantityRequired}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md text-blue-700 dark:text-blue-300">
                <span>Enrolled:</span>
                <span className="font-semibold">{stats.totalEnrolled}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-md text-green-700 dark:text-green-300">
                <span>Selected:</span>
                <span className="font-semibold">{stats.totalSelected}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md text-purple-700 dark:text-purple-300">
                <span>Deployed:</span>
                <span className="font-semibold">{stats.totalDeployed}</span>
              </div>

              {/* Candidate Search within Pipeline */}
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 sm:w-48 pl-7 pr-2 py-1 text-xs bg-gray-50 dark:bg-meta-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Kanban Workspace */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 bg-gray-50/60 dark:bg-gray-900/50">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading pipeline board...</p>
            </div>
          </div>
        ) : demands.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md p-8 text-center bg-white dark:bg-boxdark rounded-xl border border-gray-200 dark:border-strokedark shadow-sm">
              <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">No Job Demands Available</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                To manage candidate progression, please create a Job Demand from an employer first.
              </p>
              <button
                onClick={() => navigate("/demands")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm"
              >
                Go to Job Demands
              </button>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-3 min-w-max pb-2">
              {STAGES.map((stage) => {
                const records = filteredBoardData[stage.id] || [];
                return (
                  <div
                    key={stage.id}
                    className="flex flex-col w-[260px] h-full bg-gray-100/80 dark:bg-boxdark rounded-lg border border-gray-200/80 dark:border-strokedark flex-shrink-0 shadow-sm"
                  >
                    {/* Stage Header */}
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-strokedark bg-white dark:bg-meta-4 rounded-t-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full border-2 ${stage.color.split(" ")[0]}`}></span>
                        <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-200">
                          {stage.label}
                        </h4>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stage.badge}`}>
                        {records.length}
                      </span>
                    </div>

                    {/* Droppable Stage Column */}
                    <Droppable droppableId={stage.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`flex-1 p-2 overflow-y-auto transition-colors ${
                            snapshot.isDraggingOver
                              ? "bg-brand-50/50 dark:bg-meta-4/60 ring-2 ring-brand-400 ring-inset"
                              : ""
                          }`}
                        >
                          {records.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-28 border border-dashed border-gray-300 dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500">
                              <span className="text-[11px]">Drop candidates here</span>
                            </div>
                          ) : (
                            records.map((record, index) => {
                              const candidate = record.candidateId || {
                                firstName: "Unknown",
                                lastName: "Candidate"
                              };
                              const isMenuOpen = activeMenuRecordId === record._id;

                              return (
                                <Draggable
                                  key={record._id}
                                  draggableId={record._id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`relative mb-2 p-2.5 bg-white dark:bg-boxdark-2 rounded-md border text-xs select-none transition-all shadow-sm ${
                                        snapshot.isDragging
                                          ? "shadow-lg ring-2 ring-brand-500 border-transparent opacity-95 scale-[1.02]"
                                          : "border-gray-200 dark:border-strokedark hover:border-brand-300 dark:hover:border-brand-500 hover:shadow"
                                      }`}
                                    >
                                      {/* Candidate Info */}
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          {candidate.photoUrl ? (
                                            <img
                                              src={candidate.photoUrl}
                                              alt=""
                                              className="w-7 h-7 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                            />
                                          ) : (
                                            <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-[11px] flex-shrink-0 border border-brand-200 dark:border-brand-700">
                                              {candidate.firstName?.charAt(0) || "C"}
                                            </div>
                                          )}
                                          <div>
                                            <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                              {candidate.firstName} {candidate.lastName}
                                            </p>
                                            {candidate.profession && (
                                              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                                {candidate.profession}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        {/* Actions dropdown trigger */}
                                        <div className="relative">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveMenuRecordId(isMenuOpen ? null : record._id);
                                            }}
                                            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-meta-4"
                                            title="Actions"
                                          >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Dropdown Menu */}
                                          {isMenuOpen && (
                                            <div
                                              onClick={(e) => e.stopPropagation()}
                                              className="absolute right-0 top-6 z-30 w-44 bg-white dark:bg-boxdark rounded-md shadow-lg border border-gray-200 dark:border-strokedark py-1 text-xs"
                                            >
                                              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500">
                                                Move to Stage
                                              </div>
                                              <div className="max-h-40 overflow-y-auto">
                                                {STAGES.filter((s) => s.id !== record.stage).map((s) => (
                                                  <button
                                                    key={s.id}
                                                    onClick={() => handleQuickMove(record, s.id)}
                                                    className="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-meta-4 text-gray-700 dark:text-gray-300 flex items-center justify-between"
                                                  >
                                                    <span>{s.label}</span>
                                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                                  </button>
                                                ))}
                                              </div>
                                              <div className="border-t border-gray-100 dark:border-strokedark my-1"></div>
                                              <button
                                                onClick={() => handleOpenHistory(record)}
                                                className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-meta-4 text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                                              >
                                                <History className="w-3.5 h-3.5 text-blue-500" />
                                                Stage History
                                              </button>
                                              <button
                                                onClick={() => handleRemove(record)}
                                                className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-1.5"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Remove from Pipeline
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Passport & Contact Details */}
                                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-strokedark/50 flex flex-wrap items-center justify-between gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                        <span className="bg-gray-100 dark:bg-meta-4 px-1.5 py-0.5 rounded font-mono text-[10px]">
                                          {candidate.passportNumber ? `🛂 ${candidate.passportNumber}` : "No Passport"}
                                        </span>
                                        {candidate.phone && (
                                          <span className="flex items-center gap-1 text-gray-400">
                                            <Phone className="w-2.5 h-2.5" />
                                            {candidate.phone}
                                          </span>
                                        )}
                                      </div>

                                      {/* Stage History Quick Icon */}
                                      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                                        <span>
                                          Enrolled: {new Date(record.createdAt).toLocaleDateString()}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenHistory(record);
                                          }}
                                          className="text-brand-500 hover:underline flex items-center gap-0.5"
                                        >
                                          <History className="w-2.5 h-2.5" />
                                          History
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Modal: Enroll Candidate */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-boxdark rounded-xl max-w-2xl w-full p-5 shadow-2xl border border-gray-200 dark:border-strokedark">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-strokedark">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  Enroll Candidate in Pipeline
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="mt-4 space-y-4 text-xs">
              {/* Target Demand Info */}
              <div className="p-2.5 bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-200 dark:border-strokedark">
                <span className="text-[11px] text-gray-400 block mb-0.5">Selected Job Demand:</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {currentDemand?.profession} &mdash; {currentDemand?.country}
                </p>
                {currentDemand?.employerId?.companyName && (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Employer: {currentDemand.employerId.companyName}
                  </p>
                )}
              </div>

              {/* Candidate Picker and Stage Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Candidate Picker */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Candidate <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                    className="w-full bg-white dark:bg-boxdark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {candidatesList.map((c) => {
                      const isAlreadyEnrolled = enrolledCandidateIds.has(c._id);
                      return (
                        <option
                          key={c._id}
                          value={c._id}
                          disabled={isAlreadyEnrolled}
                        >
                          {c.firstName} {c.lastName} {c.profession ? `(${c.profession})` : ""} {c.passportNumber ? `[${c.passportNumber}]` : ""} {isAlreadyEnrolled ? "— (Enrolled)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Initial Stage */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Initial Stage
                  </label>
                  <select
                    value={initialStage}
                    onChange={(e) => setInitialStage(e.target.value)}
                    className="w-full bg-white dark:bg-boxdark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Recommended by agent, medical passed recently..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white dark:bg-boxdark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-strokedark">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd || !selectedCandidateId}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submittingAdd ? "Enrolling..." : "Enroll Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Stage Progression History */}
      {historyRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-boxdark rounded-xl max-w-xl w-full p-5 shadow-2xl border border-gray-200 dark:border-strokedark max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-strokedark flex-shrink-0">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    Stage Progression History
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {historyRecord.candidateId?.firstName} {historyRecord.candidateId?.lastName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryRecord(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* History timeline content */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 text-xs">
              {loadingHistory ? (
                <div className="py-8 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                </div>
              ) : historyItems.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  No stage progression history recorded yet.
                </div>
              ) : (
                <div className="relative pl-5 border-l-2 border-gray-200 dark:border-strokedark space-y-4 ml-2 my-1">
                  {historyItems.map((item, idx) => {
                    const isLatest = idx === historyItems.length - 1;
                    return (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-boxdark ${
                            isLatest ? "border-brand-500 bg-brand-500" : "border-gray-400"
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
                              {STAGE_MAP.get(item.stage) || item.stage}
                            </span>
                            {isLatest && (
                              <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 px-1.5 py-0.2 rounded font-medium">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.enteredAt).toLocaleString()}
                          </p>
                          {item.enteredBy && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Updated by: {item.enteredBy.name} ({item.enteredBy.email})
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-strokedark flex justify-end flex-shrink-0 mt-3">
              <button
                onClick={() => setHistoryRecord(null)}
                className="px-3.5 py-1.5 text-xs text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

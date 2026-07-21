import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// We define the strict order of columns we want to show
const STAGES = [
  "applied",
  "shortlisted",
  "interview",
  "selected",
  "medical",
  "visa",
  "ticket",
  "deployment",
  "completed",
  "rejected"
];

const STAGE_LABELS: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  medical: "Medical",
  visa: "Visa",
  ticket: "Ticket",
  deployment: "Deployment",
  completed: "Completed",
  rejected: "Rejected"
};

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  passportNumber?: string;
  photoUrl?: string;
}

interface PipelineRecord {
  _id: string;
  candidateId: Candidate;
  stage: string;
  createdAt: string;
}

export default function PipelineBoard() {
  const { id: demandId } = useParams<{ id: string }>();
  const [boardData, setBoardData] = useState<Record<string, PipelineRecord[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoardData();
  }, [demandId]);

  const fetchBoardData = async () => {
    try {
      // Assuming GET /api/v1/demands/:id/pipeline returns the grouped object
      const response = await axios.get(`/api/v1/pipeline/demand/${demandId}`);
      
      // The API returns an object where keys are stages and values are arrays of pipelines
      const rawData = response.data.data;
      
      // Initialize all stages with empty arrays to ensure columns render even if empty
      const normalizedData: Record<string, PipelineRecord[]> = {};
      STAGES.forEach(stage => {
        normalizedData[stage] = rawData[stage] || [];
      });
      
      setBoardData(normalizedData);
    } catch (error) {
      toast.error("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    
    // Optimistic UI update
    const newBoard = { ...boardData };
    const sourceList = [...newBoard[sourceStage]];
    const destList = [...newBoard[destStage]];
    
    const [movedItem] = sourceList.splice(source.index, 1);
    movedItem.stage = destStage;
    destList.splice(destination.index, 0, movedItem);
    
    newBoard[sourceStage] = sourceList;
    newBoard[destStage] = destList;
    
    setBoardData(newBoard);

    try {
      await axios.patch(`/api/v1/pipeline/${draggableId}/stage`, {
        stage: destStage
      });
      toast.success(`Moved to ${STAGE_LABELS[destStage]}`);
    } catch (error) {
      toast.error("Failed to update stage. Reverting.");
      fetchBoardData(); // Revert on failure
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden flex flex-col">
      <div className="mb-6 px-6 pt-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">Pipeline Board</h2>
        <p className="text-sm text-gray-500">Drag and drop candidates to update their stage and trigger automations.</p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-4 min-w-max">
            {STAGES.map((stage) => (
              <div key={stage} className="flex flex-col w-[300px] h-full bg-gray-100 dark:bg-boxdark rounded-lg flex-shrink-0">
                <div className="p-3 border-b border-gray-200 dark:border-strokedark flex justify-between items-center bg-gray-200 dark:bg-meta-4 rounded-t-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">{STAGE_LABELS[stage]}</h3>
                  <span className="bg-gray-300 dark:bg-boxdark px-2 py-0.5 rounded text-xs font-medium text-gray-700 dark:text-gray-400">
                    {boardData[stage]?.length || 0}
                  </span>
                </div>
                
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-2 overflow-y-auto transition-colors ${
                        snapshot.isDraggingOver ? 'bg-brand-50 dark:bg-meta-4/50' : ''
                      }`}
                    >
                      {boardData[stage]?.map((record, index) => (
                        <Draggable key={record._id} draggableId={record._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 p-3 bg-white dark:bg-boxdark-2 rounded shadow-sm border border-gray-200 dark:border-strokedark select-none ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-brand-500 opacity-90' : 'hover:border-brand-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {record.candidateId?.photoUrl ? (
                                  <img 
                                    src={record.candidateId.photoUrl} 
                                    alt="avatar" 
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border border-gray-300">
                                    {record.candidateId?.firstName?.charAt(0) || "U"}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-black dark:text-white text-sm">
                                    {record.candidateId?.firstName} {record.candidateId?.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Passport: {record.candidateId?.passportNumber || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

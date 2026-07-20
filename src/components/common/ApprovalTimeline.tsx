interface HistoryEntry {
  actorId: { name?: string } | string;
  level: number;
  action: "approve" | "reject";
  atBs: string;
  comment?: string;
}

interface ApprovalTimelineProps {
  history: HistoryEntry[];
  className?: string;
}

function actorName(actor: HistoryEntry["actorId"]): string {
  if (typeof actor === "object" && actor?.name) return actor.name;
  return "Unknown";
}

export default function ApprovalTimeline({ history, className = "" }: ApprovalTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">No approval actions yet.</p>
    );
  }

  return (
    <ol className={`relative border-l border-gray-200 dark:border-gray-700 space-y-4 ml-3 ${className}`}>
      {history.map((entry, idx) => (
        <li key={idx} className="ml-4">
          <div className={`absolute w-3 h-3 rounded-full -left-1.5 border border-white ${
            entry.action === "approve" ? "bg-green-500" : "bg-red-500"
          }`} />
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wide ${
              entry.action === "approve" ? "text-green-600" : "text-red-600"
            }`}>
              {entry.action === "approve" ? "✓ Approved" : "✗ Rejected"}
            </span>
            <span className="text-xs text-gray-400">by {actorName(entry.actorId)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {entry.atBs} &middot; Level {entry.level}
          </p>
          {entry.comment && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">"{entry.comment}"</p>
          )}
        </li>
      ))}
    </ol>
  );
}

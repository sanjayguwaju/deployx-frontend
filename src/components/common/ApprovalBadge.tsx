interface ApprovalBadgeProps {
  status: "pending" | "approved" | "rejected" | "disbursed";
}

const CONFIG = {
  pending:  { label: "Pending Approval", classes: "bg-amber-100 text-amber-700 border border-amber-200" },
  approved: { label: "Approved",         classes: "bg-green-100 text-green-700 border border-green-200" },
  rejected: { label: "Rejected",         classes: "bg-red-100 text-red-700 border border-red-200" },
  disbursed: { label: "Disbursed",       classes: "bg-blue-100 text-blue-700 border border-blue-200" },
};

export default function ApprovalBadge({ status }: ApprovalBadgeProps) {
  const { label, classes } = CONFIG[status] ?? CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "approved" || status === "disbursed" ? "bg-green-500" :
        status === "rejected" ? "bg-red-500" : "bg-amber-500"
      }`} />
      {label}
    </span>
  );
}

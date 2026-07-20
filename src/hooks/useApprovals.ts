import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import api from "../api/axios";

interface PendingApproval {
  _id: string;
  module: string;
  recordType: string;
  recordId: string;
  currentLevelRequired: number;
  status: string;
  createdAt: string;
}

export function useApprovals() {
  const { socket } = useSocket();
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await api.get("/approvals");
      if (res.data.success) {
        const data: PendingApproval[] = res.data.data ?? [];
        setApprovals(data);
        setPendingCount(data.filter((a) => a.status === "pending").length);
      }
    } catch {
      // silently fail — badge is best-effort
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      // Re-fetch to update badge count and list when a new approval comes in
      refresh();
    };
    socket.on("approval:pending", handler);
    return () => { socket.off("approval:pending", handler); };
  }, [socket]);

  return { approvals, pendingCount, loading, refresh };
}

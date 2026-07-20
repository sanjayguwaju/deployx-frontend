import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

interface InventoryItem {
  _id: string;
  category: string;
  name: string;
  nameNp?: string;
  unit: string;
}

export function useInventory(modulePrefix: "health" | "education" | "agriculture") {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/${modulePrefix}-inventory/items`);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch inventory items");
    } finally {
      setLoading(false);
    }
  }, [modulePrefix]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refresh: fetchItems };
}

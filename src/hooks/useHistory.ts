"use client";

import { useCallback, useEffect, useState } from "react";
import type { Passage } from "@/types";

export interface HistoryEntry {
  passage: Passage;
  viewedAt: string; // ISO timestamp
}

const HISTORY_KEY = "randompage_history";
const MAX_HISTORY = 100;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // storage quota exceeded — silently ignore
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback((passage: Passage) => {
    setHistory((prev) => {
      // Avoid consecutive duplicates
      if (prev.length > 0 && prev[0].passage.id === passage.id) return prev;
      const entry: HistoryEntry = { passage, viewedAt: new Date().toISOString() };
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}

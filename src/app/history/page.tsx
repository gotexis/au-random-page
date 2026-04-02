"use client";

import { Clock, Trash2 } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const { history, clearHistory } = useHistory();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="text-primary" size={28} />
            <h1 className="text-3xl font-bold">历史</h1>
          </div>
          <p className="text-base-content/60">
            {history.length > 0
              ? `${history.length} 个已读片段`
              : "浏览过的片段将在此记录"}
          </p>
        </div>
        {history.length > 0 && (
          <button
            className="btn btn-ghost btn-sm text-error"
            onClick={clearHistory}
          >
            <Trash2 size={16} />
            清空
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center text-base-content/40 mt-16">
          <Clock size={48} className="mx-auto mb-4 opacity-30" />
          <p>暂无浏览记录。开始在「发现」页面翻阅片段吧。</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((entry, i) => (
            <div key={`${entry.passage.id}-${i}`} className="card bg-base-200 shadow">
              <div className="card-body py-4">
                <p className="text-base-content/80 text-sm line-clamp-3 leading-relaxed">
                  {entry.passage.text.slice(0, 200)}
                  {entry.passage.text.length > 200 ? "…" : ""}
                </p>
                <div className="flex justify-between items-center mt-2 flex-wrap gap-1">
                  <div>
                    <span className="font-semibold text-primary text-sm">
                      {entry.passage.title}
                    </span>
                    <span className="text-base-content/50 text-xs ml-2">
                      by {entry.passage.author}
                    </span>
                    {entry.passage.tags && entry.passage.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.passage.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="badge badge-outline badge-xs capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-base-content/40 text-xs whitespace-nowrap">
                    {formatDate(entry.viewedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

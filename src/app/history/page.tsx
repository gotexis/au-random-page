"use client";

import { Clock } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <Clock className="mx-auto mb-3 text-primary" size={40} />
        <h1 className="text-3xl font-bold mb-2">历史</h1>
        <p className="text-base-content/60">浏览过的片段将在此记录</p>
      </div>
      <div className="text-center text-base-content/40 mt-16">
        <p>暂无浏览记录。开始在「发现」页面翻阅片段吧。</p>
      </div>
    </div>
  );
}

"use client";

import { BookMarked } from "lucide-react";

export default function ShelfPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <BookMarked className="mx-auto mb-3 text-primary" size={40} />
        <h1 className="text-3xl font-bold mb-2">书架</h1>
        <p className="text-base-content/60">收藏的片段将在此显示</p>
      </div>
      <div className="text-center text-base-content/40 mt-16">
        <p>暂无收藏。在「发现」页面点击收藏按钮以保存片段。</p>
      </div>
    </div>
  );
}

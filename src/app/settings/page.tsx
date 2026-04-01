"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <Settings className="mx-auto mb-3 text-primary" size={40} />
        <h1 className="text-3xl font-bold mb-2">设置</h1>
        <p className="text-base-content/60">偏好与主题设置</p>
      </div>
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title text-lg">主题</h2>
          <p className="text-base-content/60 text-sm">更多设置选项即将推出。</p>
        </div>
      </div>
    </div>
  );
}

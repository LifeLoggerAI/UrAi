// src/components/UrAiAdminToolbar.tsx

'use client';

import React from 'react';

type Props = {
  className?: string;
  onRefresh?: () => void;
  onClearCache?: () => void;
  status?: string;
};

export default function UrAiAdminToolbar({ className, onRefresh, onClearCache, status = 'ok' }: Props) {
  return (
    <div className={`p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border shadow-sm space-y-4 ${className ?? ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">UrAi Admin Toolbar</h2>
          <p className="text-sm text-slate-500">Status: {status}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="px-3 py-2 rounded-xl border shadow-sm" data-testid="refresh-btn">
            Refresh
          </button>
          <button onClick={onClearCache} className="px-3 py-2 rounded-xl border shadow-sm" data-testid="clear-cache-btn">
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}

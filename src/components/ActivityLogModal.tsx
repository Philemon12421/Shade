import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { ActivityLogEntry } from '../types';

interface ActivityLogProps {
  userId: string;
}

export const ActivityLogModal: React.FC<ActivityLogProps> = ({ userId }) => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [userId]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs', {
        headers: { Authorization: `Bearer ${userId}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Activity History</h2>
          <p className="text-xs text-slate-500 font-medium">Log of recent logins, changes, and security updates</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-semibold">Loading history...</div>
      ) : logs.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
          No activity recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    log.status === 'success' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                ></div>
                <div>
                  <span className="font-bold text-slate-800">{log.action}</span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  log.status === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : log.status === 'warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

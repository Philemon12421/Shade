import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCcw,
  Sparkles,
  ArrowUpRight,
  CheckCircle,
  Key,
  Lock,
} from 'lucide-react';
import { DecryptedVaultItem } from '../types';
import { evaluatePasswordStrength } from '../lib/crypto';
import { getServiceIcon } from '../lib/icons';

interface SecurityAuditViewProps {
  items: DecryptedVaultItem[];
  onFixItem: (item: DecryptedVaultItem) => void;
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({ items, onFixItem }) => {
  // Compute analytics
  const totalItems = items.length;

  const weakItems = items.filter((item) => {
    if (!item.payload.password) return false;
    const strength = evaluatePasswordStrength(item.payload.password);
    return strength.score < 45 || item.payload.password.length < 10;
  });

  // Find reused passwords
  const passwordMap = new Map<string, DecryptedVaultItem[]>();
  items.forEach((item) => {
    if (item.payload.password) {
      const existing = passwordMap.get(item.payload.password) || [];
      passwordMap.set(item.payload.password, [...existing, item]);
    }
  });

  const reusedItems: DecryptedVaultItem[] = [];
  passwordMap.forEach((itemList) => {
    if (itemList.length > 1) {
      reusedItems.push(...itemList);
    }
  });

  // Overall Vault Score calculation
  let healthScore = 100;
  if (totalItems > 0) {
    const weakPenalty = (weakItems.length / totalItems) * 40;
    const reusePenalty = (reusedItems.length / totalItems) * 40;
    healthScore = Math.max(0, Math.round(100 - weakPenalty - reusePenalty));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 my-6">
      {/* Overview Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center p-3 text-white shadow-lg ${
              healthScore >= 80
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20'
                : healthScore >= 50
                ? 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-rose-500 to-red-400 shadow-rose-500/20'
            }`}
          >
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">Security Check</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {totalItems} Items Checked
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Checks your saved logins for weak or reused passwords
            </p>
          </div>
        </div>

        {/* Score Ring / Badge */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-8">
          <div className="text-center">
            <span
              className={`text-4xl font-extrabold font-mono ${
                healthScore >= 80 ? 'text-emerald-600' : healthScore >= 50 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {healthScore}%
            </span>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>{weakItems.length} Weak Passwords</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{reusedItems.length} Reused Passwords</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Passwords Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="font-extrabold text-slate-900 text-base">Weak Passwords ({weakItems.length})</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Short or simple passwords</span>
        </div>

        {weakItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-800 text-xs flex items-center gap-3 font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Excellent! All your stored passwords pass strength criteria.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {weakItems.map((item) => {
              const ServiceIcon = getServiceIcon(item.serviceName, item.category);
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2">
                      <ServiceIcon size={20} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.serviceName}</h4>
                      <p className="text-xs text-slate-500 font-mono">{item.payload.usernameOrEmail}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onFixItem(item)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fix with Generator</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reused Passwords Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-base">Reused Passwords ({reusedItems.length})</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Reused across multiple accounts</span>
        </div>

        {reusedItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-800 text-xs flex items-center gap-3 font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>No password reuse detected across your accounts.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {reusedItems.map((item) => {
              const ServiceIcon = getServiceIcon(item.serviceName, item.category);
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2">
                      <ServiceIcon size={20} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.serviceName}</h4>
                      <p className="text-xs text-slate-500 font-mono">{item.payload.usernameOrEmail}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onFixItem(item)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Change Password</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

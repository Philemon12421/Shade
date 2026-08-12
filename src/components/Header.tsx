import React from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  Plus,
  Key,
  Fingerprint,
  LogOut,
  Sliders,
  History,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { UserSession, ViewTab } from '../types';

interface HeaderProps {
  user: UserSession;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewItem: () => void;
  onLockVault: () => void;
  onOpen2FASettings: () => void;
  itemCount: number;
  weakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenNewItem,
  onLockVault,
  onOpen2FASettings,
  itemCount,
  weakCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/70 border-b border-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[14px] flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
              Shride
            </h1>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logins, credit cards, accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 border border-slate-200/80 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm text-slate-800 placeholder-slate-400 outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Right Navigation & User Menu */}
        <div className="flex items-center gap-2.5">
          {/* New Secret Button */}
          <button
            onClick={onOpenNewItem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Add Item</span>
          </button>

          {/* Security Status Modal Triggers */}
          <button
            onClick={() => setActiveTab('audit')}
            className={`p-2.5 rounded-2xl border transition-all relative cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
            title="Security Check"
          >
            <ShieldAlert className="w-4 h-4" />
            {weakCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {weakCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
            title="Password Generator"
          >
            <Key className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
            title="Activity History"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
            title="Security Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-slate-200/80 mx-1 hidden sm:block"></div>

          {/* Master Lock Action */}
          <button
            onClick={onLockVault}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-all cursor-pointer"
            title="Lock App"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Lock</span>
          </button>
        </div>
      </div>
    </header>
  );
};

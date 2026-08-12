import React, { useState } from 'react';
import { Download, Upload, Shield, AlertTriangle, FileText, Check } from 'lucide-react';
import { DecryptedVaultItem } from '../types';

interface ImportExportProps {
  items: DecryptedVaultItem[];
  onImportItems: (importedItems: any[]) => void;
}

export const ImportExportModal: React.FC<ImportExportProps> = ({ items, onImportItems }) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Export Encrypted JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      vaultItems: items,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shride_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Category', 'ServiceName', 'UsernameOrEmail', 'Password', 'URL', 'Notes'];
    const rows = items.map((i) => [
      i.category,
      `"${i.serviceName.replace(/"/g, '""')}"`,
      `"${(i.payload.usernameOrEmail || '').replace(/"/g, '""')}"`,
      `"${(i.payload.password || '').replace(/"/g, '""')}"`,
      `"${(i.payload.url || '').replace(/"/g, '""')}"`,
      `"${(i.payload.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shride_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.vaultItems)) {
          onImportItems(parsed.vaultItems);
          setImportStatus(`Successfully restored ${parsed.vaultItems.length} vault items!`);
        } else {
          throw new Error('Invalid backup file format');
        }
      } catch (err: any) {
        setImportStatus('Failed to parse backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto my-6 bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Backup & Restore Vault</h2>
        <p className="text-xs text-slate-500 font-medium">Export encrypted backups or restore credentials from JSON</p>
      </div>

      {importStatus && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-indigo-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Export Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">JSON Encrypted Backup</h3>
          </div>
          <p className="text-xs text-slate-500">Includes all credentials and local metadata in structured JSON.</p>
          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition-all cursor-pointer"
          >
            Download JSON Backup
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Unencrypted CSV Export</h3>
          </div>
          <p className="text-xs text-slate-500">Export passwords to plain CSV for browser imports.</p>
          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow transition-all cursor-pointer"
          >
            Export CSV File
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-2.5">
          <Upload className="w-5 h-5 text-sky-600" />
          <h3 className="font-extrabold text-slate-900 text-sm">Restore from JSON File</h3>
        </div>
        <p className="text-xs text-slate-500">Select a previously exported Shride JSON file to merge items.</p>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
        />
      </div>
    </div>
  );
};

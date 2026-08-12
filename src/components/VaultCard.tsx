import React, { useState, useEffect } from 'react';
import {
  Star,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Edit2,
  Trash2,
  CreditCard,
  Landmark,
  Key,
  FileText,
  Shield,
  Clock,
  Lock,
} from 'lucide-react';
import { DecryptedVaultItem } from '../types';
import { getServiceIcon } from '../lib/icons';

interface VaultCardProps {
  item: DecryptedVaultItem;
  onEdit: (item: DecryptedVaultItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (item: DecryptedVaultItem) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({ item, onEdit, onDelete, onToggleFavorite }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copyCountdown, setCopyCountdown] = useState<number | null>(null);

  const ServiceIcon = getServiceIcon(item.serviceName, item.category);

  // Auto-clear clipboard timer simulation
  useEffect(() => {
    let interval: any = null;
    if (copyCountdown !== null && copyCountdown > 0) {
      interval = setInterval(() => {
        setCopyCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
    } else if (copyCountdown === 0) {
      setCopiedField(null);
    }
    return () => clearInterval(interval);
  }, [copyCountdown]);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setCopyCountdown(30); // 30-second clear timer
  };

  const getCategoryBadge = () => {
    switch (item.category) {
      case 'card':
        return { label: 'Credit Card', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' };
      case 'bank':
        return { label: 'Bank Account', color: 'bg-sky-50 text-sky-700 border-sky-200/80' };
      case 'note':
        return { label: 'Secure Note', color: 'bg-purple-50 text-purple-700 border-purple-200/80' };
      case 'apikey':
        return { label: 'API Key', color: 'bg-amber-50 text-amber-700 border-amber-200/80' };
      case 'identity':
        return { label: 'Identity', color: 'bg-rose-50 text-rose-700 border-rose-200/80' };
      default:
        return { label: 'Login', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' };
    }
  };

  const categoryBadge = getCategoryBadge();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/90 hover:border-indigo-200/80 shadow-md hover:shadow-xl transition-all duration-200 rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden">
      {/* Favorite Star Accent */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-2.5 shadow-sm text-slate-800 shrink-0">
            <ServiceIcon size={26} className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors">
              {item.serviceName}
            </h3>
            <span
              className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryBadge.color}`}
            >
              {categoryBadge.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(item)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              item.favorite ? 'text-amber-500 bg-amber-50/80' : 'text-slate-300 hover:text-amber-400'
            }`}
            title={item.favorite ? 'Unfavorite' : 'Mark Favorite'}
          >
            <Star className={`w-4 h-4 ${item.favorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Fields */}
      <div className="space-y-3 my-2">
        {/* Username / Email */}
        {item.payload.usernameOrEmail && (
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Account / Email
              </span>
              <span className="text-xs font-semibold text-slate-800 truncate block">
                {item.payload.usernameOrEmail}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(item.payload.usernameOrEmail, 'Email')}
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
              title="Copy Email"
            >
              {copiedField === 'Email' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Password / Main Secret */}
        {item.payload.password && (
          <div className="p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100/80 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">
                Password
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 truncate block">
                {showSecret ? item.payload.password : '••••••••••••••••'}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="p-1.5 rounded-lg hover:bg-indigo-100/60 text-indigo-600 transition-colors cursor-pointer"
                title={showSecret ? 'Hide Password' : 'Show Password'}
              >
                {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => copyToClipboard(item.payload.password || '', 'Password')}
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-sm"
                title="Copy Password"
              >
                {copiedField === 'Password' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Credit Card Details */}
        {item.category === 'card' && item.payload.cardNumber && (
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Card Number</span>
              <button
                onClick={() => copyToClipboard(item.payload.cardNumber || '', 'Card')}
                className="text-[10px] text-indigo-600 hover:underline font-semibold"
              >
                Copy
              </button>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 block">
              {showSecret ? item.payload.cardNumber : `•••• •••• •••• ${item.payload.cardNumber.slice(-4)}`}
            </span>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-mono">
              <span>Exp: {item.payload.expiryDate || 'MM/YY'}</span>
              <span>CVV: {showSecret ? item.payload.cvv : '•••'}</span>
            </div>
          </div>
        )}

        {/* Notes Preview */}
        {item.payload.notes && (
          <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50/50 p-2 rounded-xl italic border border-slate-100">
            "{item.payload.notes}"
          </p>
        )}
      </div>

      {/* Auto-Clear Countdown Bar */}
      {copyCountdown !== null && (
        <div className="my-2 p-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-emerald-600 animate-spin" />
            <span>Clipboard Auto-Clear in {copyCountdown}s</span>
          </div>
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
        <span className="text-[10px] text-slate-400 font-medium">
          Updated {new Date(item.updatedAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-1">
          {item.payload.url && (
            <a
              href={item.payload.url.startsWith('http') ? item.payload.url : `https://${item.payload.url}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              title="Launch Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Edit Item"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

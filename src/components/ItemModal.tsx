import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Key,
  Globe,
  CreditCard,
  Landmark,
  FileText,
  Shield,
  Star,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { CategoryType, DecryptedVaultItem } from '../types';
import { generateSecurePassword, evaluatePasswordStrength } from '../lib/crypto';
import { getServiceIcon } from '../lib/icons';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    category: CategoryType;
    serviceName: string;
    favorite: boolean;
    payload: any;
  }) => void;
  editingItem?: DecryptedVaultItem | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, editingItem }) => {
  const [category, setCategory] = useState<CategoryType>('login');
  const [serviceName, setServiceName] = useState('');
  const [favorite, setFavorite] = useState(false);

  // Form payload fields
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Bank & API key fields
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  useEffect(() => {
    if (editingItem) {
      setCategory(editingItem.category);
      setServiceName(editingItem.serviceName);
      setFavorite(editingItem.favorite);
      setUsernameOrEmail(editingItem.payload.usernameOrEmail || '');
      setPassword(editingItem.payload.password || '');
      setUrl(editingItem.payload.url || '');
      setNotes(editingItem.payload.notes || '');
      setCardNumber(editingItem.payload.cardNumber || '');
      setCardHolder(editingItem.payload.cardHolder || '');
      setExpiryDate(editingItem.payload.expiryDate || '');
      setCvv(editingItem.payload.cvv || '');
      setAccountNumber(editingItem.payload.accountNumber || '');
      setPin(editingItem.payload.pin || '');
      setApiKey(editingItem.payload.apiKey || '');
      setApiSecret(editingItem.payload.apiSecret || '');
    } else {
      resetForm();
    }
  }, [editingItem, isOpen]);

  const resetForm = () => {
    setCategory('login');
    setServiceName('');
    setFavorite(false);
    setUsernameOrEmail('');
    setPassword('');
    setUrl('');
    setNotes('');
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
    setAccountNumber('');
    setPin('');
    setApiKey('');
    setApiSecret('');
  };

  if (!isOpen) return null;

  const ServiceIcon = getServiceIcon(serviceName, category);
  const passwordStrength = evaluatePasswordStrength(password);

  const handleGeneratePassword = () => {
    const pass = generateSecurePassword({
      length: 20,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false,
    });
    setPassword(pass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName) return;

    const payload: any = {
      usernameOrEmail,
      password,
      url,
      notes,
    };

    if (category === 'card') {
      payload.cardNumber = cardNumber;
      payload.cardHolder = cardHolder;
      payload.expiryDate = expiryDate;
      payload.cvv = cvv;
    } else if (category === 'bank') {
      payload.accountNumber = accountNumber;
      payload.pin = pin;
    } else if (category === 'apikey') {
      payload.apiKey = apiKey;
      payload.apiSecret = apiSecret;
    }

    onSave({
      id: editingItem?.id,
      category,
      serviceName,
      favorite,
      payload,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-indigo-950/20 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 p-2.5">
            <ServiceIcon size={26} className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Your information is saved securely</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'login', label: 'Login', icon: Globe },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'bank', label: 'Bank', icon: Landmark },
                { id: 'note', label: 'Note', icon: FileText },
                { id: 'apikey', label: 'API Key', icon: Key },
                { id: 'identity', label: 'Identity', icon: Shield },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as CategoryType)}
                    className={`py-2 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Service / Account Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Google, GitHub, Netflix, Chase Bank"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Username / Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username or Email</label>
            <input
              type="text"
              placeholder="user@example.com"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Password with Generator Button */}
          {category !== 'note' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password / Secret</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Auto-Generate</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm font-mono text-slate-800 placeholder-slate-400 outline-none transition-all"
              />

              {password && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Strength: {passwordStrength.label}</span>
                  <span style={{ color: passwordStrength.color }}>{passwordStrength.score}%</span>
                </div>
              )}
            </div>
          )}

          {/* Credit Card Specific Fields */}
          {category === 'card' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8890"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm font-mono text-slate-800 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm font-mono text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm font-mono text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Website URL</label>
            <input
              type="text"
              placeholder="https://accounts.google.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Secure Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Secure Notes / Recovery Codes</label>
            <textarea
              rows={3}
              placeholder="Add recovery keys, security questions, or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="favoriteToggle"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="favoriteToggle" className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Pin to Favorites</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {editingItem ? 'Update Encrypted Secret' : 'Encrypt & Save Secret'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

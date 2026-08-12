import React, { useState, useEffect } from 'react';
import {
  Globe,
  CreditCard,
  Landmark,
  FileText,
  Key,
  Shield,
  Star,
  Plus,
  Lock,
  Search,
  Sparkles,
  ShieldAlert,
  Sliders,
  History,
  Download,
  Folder,
} from 'lucide-react';
import { UserSession, CategoryType, DecryptedVaultItem, ViewTab } from './types';
import { decryptPayload, encryptPayload, evaluatePasswordStrength } from './lib/crypto';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { VaultCard } from './components/VaultCard';
import { ItemModal } from './components/ItemModal';
import { PasswordGeneratorModal } from './components/PasswordGeneratorModal';
import { SecurityAuditView } from './components/SecurityAuditView';
import { SecuritySettingsModal } from './components/SecuritySettingsModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { ImportExportModal } from './components/ImportExportModal';

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);

  const [vaultItems, setVaultItems] = useState<DecryptedVaultItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState<ViewTab>('vault');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedVaultItem | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  // Auto lock on inactivity (5 mins)
  useEffect(() => {
    let timer: any = null;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      if (userSession && masterKey) {
        timer = setTimeout(() => {
          handleLockVault();
        }, 5 * 60 * 1000); // 5 minutes inactivity lock
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [userSession, masterKey]);

  // Handle Login & Decrypt Vault Items
  const handleLoginSuccess = async (session: UserSession, key: CryptoKey) => {
    setUserSession(session);
    setMasterKey(key);
    setLoading(true);

    try {
      const res = await fetch('/api/vault', {
        headers: { Authorization: `Bearer ${session.id}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch vault');

      // Decrypt items locally
      const decryptedList: DecryptedVaultItem[] = [];
      for (const encItem of data.items || []) {
        try {
          const payload = await decryptPayload(encItem.encryptedData, encItem.iv, key);
          decryptedList.push({
            ...encItem,
            payload,
          });
        } catch (decErr) {
          console.error(`Failed to decrypt item ${encItem.id}:`, decErr);
        }
      }

      setVaultItems(decryptedList);
    } catch (err) {
      console.error('Vault load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lock Vault
  const handleLockVault = () => {
    setUserSession(null);
    setMasterKey(null);
    setVaultItems([]);
    setActiveTab('vault');
  };

  // Save / Update Item (Encrypt Client-Side)
  const handleSaveSecret = async (itemData: {
    id?: string;
    category: CategoryType;
    serviceName: string;
    favorite: boolean;
    payload: any;
  }) => {
    if (!userSession || !masterKey) return;

    try {
      // 1. Client-side AES-256 GCM encryption
      const { ciphertext, iv } = await encryptPayload(itemData.payload, masterKey);

      const endpoint = itemData.id ? `/api/vault/${itemData.id}` : '/api/vault';
      const method = itemData.id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userSession.id}`,
        },
        body: JSON.stringify({
          category: itemData.category,
          serviceName: itemData.serviceName,
          favorite: itemData.favorite,
          encryptedData: ciphertext,
          iv,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save secret');

      // Decrypt saved item into local state
      const decryptedPayload = await decryptPayload(data.item.encryptedData, data.item.iv, masterKey);
      const newDecryptedItem: DecryptedVaultItem = {
        ...data.item,
        payload: decryptedPayload,
      };

      if (itemData.id) {
        setVaultItems((prev) => prev.map((i) => (i.id === itemData.id ? newDecryptedItem : i)));
      } else {
        setVaultItems((prev) => [newDecryptedItem, ...prev]);
      }
    } catch (err: any) {
      alert('Error saving secret: ' + err.message);
    }
  };

  // Delete Secret
  const handleDeleteSecret = async (id: string) => {
    if (!userSession || !confirm('Are you sure you want to permanently delete this secret?')) return;

    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userSession.id}` },
      });

      if (res.ok) {
        setVaultItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (item: DecryptedVaultItem) => {
    if (!userSession) return;

    const newFav = !item.favorite;
    setVaultItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, favorite: newFav } : i)));

    try {
      await fetch(`/api/vault/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userSession.id}`,
        },
        body: JSON.stringify({ favorite: newFav }),
      });
    } catch (err) {
      console.error('Failed to update favorite:', err);
    }
  };

  // Filter Items
  const filteredItems = vaultItems.filter((item) => {
    // Category match
    if (selectedCategory === 'favorites' && !item.favorite) return false;
    if (
      selectedCategory !== 'all' &&
      selectedCategory !== 'favorites' &&
      item.category !== selectedCategory
    )
      return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.serviceName.toLowerCase().includes(q);
      const matchEmail = (item.payload.usernameOrEmail || '').toLowerCase().includes(q);
      const matchNotes = (item.payload.notes || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchNotes;
    }

    return true;
  });

  // Weak item count for header badge
  const weakCount = vaultItems.filter((item) => {
    if (!item.payload.password) return false;
    const strength = evaluatePasswordStrength(item.payload.password);
    return strength.score < 45 || item.payload.password.length < 10;
  }).length;

  // Unauthenticated view
  if (!userSession || !masterKey) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header Bar */}
      <Header
        user={userSession}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNewItem={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        onLockVault={handleLockVault}
        onOpen2FASettings={() => setActiveTab('settings')}
        itemCount={vaultItems.length}
        weakCount={weakCount}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Glass Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-white/70 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 rounded-3xl p-5 space-y-2">
                <div className="px-3 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Vault Categories
                </div>

                {[
                  { id: 'all', label: 'All Items', icon: Folder, count: vaultItems.length },
                  {
                    id: 'favorites',
                    label: 'Favorites',
                    icon: Star,
                    count: vaultItems.filter((i) => i.favorite).length,
                  },
                  {
                    id: 'login',
                    label: 'Passwords & Logins',
                    icon: Globe,
                    count: vaultItems.filter((i) => i.category === 'login').length,
                  },
                  {
                    id: 'card',
                    label: 'Credit Cards',
                    icon: CreditCard,
                    count: vaultItems.filter((i) => i.category === 'card').length,
                  },
                  {
                    id: 'bank',
                    label: 'Bank Accounts',
                    icon: Landmark,
                    count: vaultItems.filter((i) => i.category === 'bank').length,
                  },
                  {
                    id: 'note',
                    label: 'Secure Notes',
                    icon: FileText,
                    count: vaultItems.filter((i) => i.category === 'note').length,
                  },
                  {
                    id: 'apikey',
                    label: 'API Keys',
                    icon: Key,
                    count: vaultItems.filter((i) => i.category === 'apikey').length,
                  },
                  {
                    id: 'identity',
                    label: 'Identities',
                    icon: Shield,
                    count: vaultItems.filter((i) => i.category === 'identity').length,
                  },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span>{cat.label}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Tools Box */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 rounded-3xl p-5 space-y-3">
                <div className="px-1 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Backup & Import
                </div>
                <button
                  onClick={() => setIsImportExportOpen(!isImportExportOpen)}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Backup / Restore Vault</span>
                </button>
              </div>
            </aside>

            {/* Right Vault Items Grid */}
            <section className="lg:col-span-3 space-y-6">
              {isImportExportOpen && (
                <ImportExportModal
                  items={vaultItems}
                  onImportItems={(imported) => {
                    // Save imported items
                    imported.forEach((i) => {
                      if (i.payload) handleSaveSecret(i);
                    });
                  }}
                />
              )}

              {/* Search Bar on Mobile */}
              <div className="sm:hidden mb-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search secrets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Items Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 capitalize">
                    {selectedCategory === 'all'
                      ? 'All Saved Items'
                      : selectedCategory === 'favorites'
                      ? 'Favorite Items'
                      : `${selectedCategory} Items`}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Showing {filteredItems.length} saved items
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsItemModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Grid Cards */}
              {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm font-semibold">
                  Loading your saved items...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-xl border border-white/90 shadow-lg rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-100">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">No items found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      {searchQuery
                        ? 'No items matched your search.'
                        : 'No items in this category yet. Click "Add Item" to save your first account!'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setIsItemModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Item</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <VaultCard
                      key={item.id}
                      item={item}
                      onEdit={(it) => {
                        setEditingItem(it);
                        setIsItemModalOpen(true);
                      }}
                      onDelete={handleDeleteSecret}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'audit' && (
          <SecurityAuditView
            items={vaultItems}
            onFixItem={(item) => {
              setEditingItem(item);
              setIsItemModalOpen(true);
            }}
          />
        )}

        {activeTab === 'generator' && <PasswordGeneratorModal />}

        {activeTab === 'activity' && <ActivityLogModal userId={userSession.id} />}

        {activeTab === 'settings' && (
          <SecuritySettingsModal
            user={userSession}
            onUserUpdate={(updated) => setUserSession(updated)}
          />
        )}
      </main>

      {/* Add / Edit Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveSecret}
        editingItem={editingItem}
      />
    </div>
  );
}

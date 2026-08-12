import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';
import { UserSession } from '../types';
import { evaluatePasswordStrength, deriveAuthHash, deriveMasterKey, generateSaltHex } from '../lib/crypto';

interface AuthScreenProps {
  onLoginSuccess: (session: UserSession, masterKey: CryptoKey) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('');
  const [masterPasswordHint, setMasterPasswordHint] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');

  // Password Strength for Master Password
  const masterStrength = evaluatePasswordStrength(masterPassword);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !masterPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (masterPassword !== confirmMasterPassword) {
      setError('Master passwords do not match');
      return;
    }

    if (masterStrength.score < 25) {
      setError('Master password is too weak. Please choose a stronger passphrase.');
      return;
    }

    setLoading(true);

    try {
      // 1. Generate client-side salt
      const salt = generateSaltHex();

      // 2. Derive Auth Password Hash for server authentication
      const passwordHash = await deriveAuthHash(password, salt);

      // 3. Derive Master Encryption Key
      const masterKey = await deriveMasterKey(masterPassword, salt);

      // 4. Send registration to server
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          passwordHash,
          salt,
          masterPasswordHint,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onLoginSuccess(data.user, masterKey);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch user salt from server
      const saltRes = await fetch(`/api/auth/salt?email=${encodeURIComponent(email)}`);
      const saltData = await saltRes.json();

      if (!saltData.exists) {
        throw new Error('Invalid email or password');
      }

      const salt = saltData.salt;

      // 2. Derive Auth Password Hash
      const passwordHash = await deriveAuthHash(password, salt);

      // 3. Derive Master Key
      const masterKey = await deriveMasterKey(password, salt);

      // 4. Perform Login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          passwordHash,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.requires2FA) {
        setRequires2FA(true);
        setPendingUserId(data.userId);
        return;
      }

      onLoginSuccess(data.user, masterKey);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode || totpCode.length !== 6 || !pendingUserId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: pendingUserId,
          code: totpCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid 2FA code');
      }

      // Re-derive master key with user salt
      const masterKey = await deriveMasterKey(password, data.user.salt);
      onLoginSuccess(data.user, masterKey);
    } catch (err: any) {
      setError(err.message || '2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/40 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Glass Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-0.5 shadow-xl shadow-indigo-500/20 mb-4">
            <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center text-white">
              <ShieldCheck className="w-9 h-9" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shride</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Encrypted Vault</p>
        </div>

        {/* Glass Card Container */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-indigo-950/10 rounded-3xl p-6 sm:p-8">
          {/* 2FA Modal Step */}
          {requires2FA ? (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200/60">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit verification code from your authenticator app
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || totpCode.length !== 6}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? 'Verifying Code...' : 'Verify & Access Vault'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setTotpCode('');
                  }}
                  className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Back to Sign In
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Glass Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 mb-6">
                <button
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="alex@shride.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {mode === 'signup' ? 'Account Auth Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">Master Password (Vault Key)</label>
                        <span className="text-[10px] font-medium text-slate-400">AES Key</span>
                      </div>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Your master key passphrase..."
                          value={masterPassword}
                          onChange={(e) => setMasterPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all font-mono"
                        />
                      </div>

                      {/* Password Strength Indicator */}
                      {masterPassword && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-slate-500">Key Strength:</span>
                            <span className="font-bold text-[11px]" style={{ color: masterStrength.color }}>
                              {masterStrength.label} ({masterStrength.score}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-300"
                              style={{ width: `${masterStrength.score}%`, backgroundColor: masterStrength.color }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Master Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter master password..."
                        value={confirmMasterPassword}
                        onChange={(e) => setConfirmMasterPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Master Password Hint <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Favorite childhood book title + year"
                        value={masterPasswordHint}
                        onChange={(e) => setMasterPasswordHint(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    'Processing Key Derivation...'
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Unlock Vault' : 'Create Encrypted Vault'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] text-slate-400 mt-6 font-medium">
          Secure Architecture • Data encrypted with AES-256-GCM before transmission
        </p>
      </div>
    </div>
  );
};

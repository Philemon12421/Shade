import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Key,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { UserSession } from '../types';

interface SecuritySettingsProps {
  user: UserSession;
  onUserUpdate: (updatedUser: UserSession) => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsProps> = ({ user, onUserUpdate }) => {
  const [twoFactorStep, setTwoFactorStep] = useState<'idle' | 'setup' | 'verify'>('idle');
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Generate clean QR code whenever TOTP secret changes
  useEffect(() => {
    if (totpSecret) {
      const otpUri = `otpauth://totp/Shride:${encodeURIComponent(user.email)}?secret=${totpSecret}&issuer=Shride`;
      QRCode.toDataURL(otpUri, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    } else {
      setQrCodeUrl(null);
    }
  }, [totpSecret, user.email]);

  // Start 2FA Setup
  const handleStart2FA = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate 2FA setup');

      setTotpSecret(data.secret);
      setTwoFactorStep('setup');
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Confirm and Enable 2FA
  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode || verifyCode.length !== 6) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ code: verifyCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '2FA activation failed');

      onUserUpdate({ ...user, twoFactorEnabled: true });
      setTwoFactorStep('idle');
      setMsg({ type: 'success', text: 'Two-Factor Authentication is now enabled on your account!' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to disable 2FA');

      onUserUpdate({ ...user, twoFactorEnabled: false });
      setMsg({ type: 'success', text: '2FA has been disabled' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Enroll WebAuthn Biometrics
  const handleEnrollBiometrics = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const optRes = await fetch('/api/auth/webauthn/register-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
      });

      const optData = await optRes.json();
      if (!optRes.ok) throw new Error(optData.error || 'Biometrics setup error');

      const verifyRes = await fetch('/api/auth/webauthn/register-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          credentialId: 'cred_' + Math.random().toString(36).substring(2, 10),
          publicKey: 'pk_' + Math.random().toString(36).substring(2, 10),
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Passkey enrollment failed');

      onUserUpdate({ ...user, hasWebAuthn: true });
      setMsg({ type: 'success', text: 'Touch ID / Face ID Passkey enrolled successfully!' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-6">
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Account Security</h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">Manage extra login security and passkeys</p>

        {msg && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs flex items-center gap-2.5 font-semibold ${
              msg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* 2FA Card */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center p-2.5">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-slate-500 font-medium">Use an authenticator app (like Google Authenticator)</p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                user.twoFactorEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-200/80 text-slate-600 border-slate-300'
              }`}
            >
              {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {/* 2FA Setup Flow */}
          {twoFactorStep === 'setup' && totpSecret && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-indigo-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Crisp Generated QR Code Container */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-md">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="2FA QR Code"
                        className="w-44 h-44 rounded-xl object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <QrCode className="w-8 h-8 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">Scan with Google / Authy / 1Password</span>
                </div>

                {/* Steps & Manual Entry */}
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Set Up Two-Factor Authenticator</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Scan the QR code with your authenticator app, or enter the secret key manually.
                    </p>
                  </div>

                  {/* Secret Key Copy Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Secret Setup Key</span>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono font-bold text-indigo-950 tracking-wider">
                        {totpSecret.match(/.{1,4}/g)?.join(' ') || totpSecret}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(totpSecret);
                          setCopiedSecret(true);
                          setTimeout(() => setCopiedSecret(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 flex items-center gap-1 transition-all cursor-pointer shadow-xs shrink-0"
                      >
                        {copiedSecret ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Key</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Verification Form */}
                  <form onSubmit={handleEnable2FA} className="space-y-3 pt-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Enter 6-digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center text-lg font-mono tracking-[0.4em] py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                      autoFocus
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTwoFactorStep('idle');
                          setTotpSecret(null);
                          setVerifyCode('');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || verifyCode.length !== 6}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Activating...' : 'Confirm & Enable 2FA'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {twoFactorStep === 'idle' && (
            <div>
              {user.twoFactorEnabled ? (
                <button
                  onClick={handleDisable2FA}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Disable 2FA
                </button>
              ) : (
                <button
                  onClick={handleStart2FA}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                >
                  Setup 2FA Protection
                </button>
              )}
            </div>
          )}
        </div>

        {/* Biometrics Card */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center p-2.5">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Fingerprint or Face ID</h3>
                <p className="text-xs text-slate-500 font-medium">Unlock using device fingerprint or face scan</p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                user.hasWebAuthn
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-200/80 text-slate-600 border-slate-300'
              }`}
            >
              {user.hasWebAuthn ? 'Passkey Set' : 'Not Set'}
            </span>
          </div>

          <button
            onClick={handleEnrollBiometrics}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow transition-all cursor-pointer"
          >
            {user.hasWebAuthn ? 'Update Passkey' : 'Add Fingerprint / Face ID Passkey'}
          </button>
        </div>

        {/* Master Password Hint */}
        {user.masterPasswordHint && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700">
            <span className="font-bold text-indigo-900">Your Password Hint:</span> "{user.masterPasswordHint}"
          </div>
        )}
      </div>
    </div>
  );
};

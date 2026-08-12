import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import { generateSecurePassword, evaluatePasswordStrength, PasswordGenOptions } from '../lib/crypto';

export const PasswordGeneratorModal: React.FC = () => {
  const [options, setOptions] = useState<PasswordGenOptions>({
    length: 24,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateNewPassword();
  }, [options]);

  const generateNewPassword = () => {
    const pwd = generateSecurePassword(options);
    setGeneratedPassword(pwd);
    setCopied(false);
  };

  const strength = evaluatePasswordStrength(generatedPassword);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto my-6">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900">Password Generator</h2>
        <p className="text-xs text-slate-500 font-medium">Create strong and secure passwords instantly</p>
      </div>

      {/* Generated Output Box */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-inner mb-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-base sm:text-lg font-bold tracking-wider break-all text-sky-300">
            {generatedPassword}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generateNewPassword}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength & Crack Time Banner */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Score:</span>
            <span className="font-bold text-sky-400">{strength.score}%</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {strength.label}
            </span>
          </div>
          <div className="text-slate-400">
            Estimated Crack Time: <span className="text-white font-semibold">{strength.crackTimeEstimate}</span>
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="space-y-5">
        {/* Length Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700">Password Length</label>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono text-xs font-bold">
              {options.length} characters
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Toggle Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { key: 'uppercase', label: 'A-Z Uppercase' },
            { key: 'lowercase', label: 'a-z Lowercase' },
            { key: 'numbers', label: '0-9 Numbers' },
            { key: 'symbols', label: '!@# Symbols' },
            { key: 'excludeAmbiguous', label: 'Exclude Ambiguous (1,l,O,0)' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-white transition-all text-xs font-semibold text-slate-700"
            >
              <input
                type="checkbox"
                checked={(options as any)[item.key]}
                onChange={(e) => setOptions({ ...options, [item.key]: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

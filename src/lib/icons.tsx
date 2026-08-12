import React from 'react';
import { Key, Shield, Globe, CreditCard, Landmark, FileText, Lock } from 'lucide-react';

export interface ServiceIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const RealServiceIcons: Record<string, React.FC<{ className?: string; size?: number }>> = {
  google: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  ),

  github: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  ),

  twitter: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),

  facebook: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),

  instagram: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor" strokeWidth="2" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  linkedin: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#0A66C2">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  ),

  netflix: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#E50914">
      <path d="M5.398 0v24h4.195V12.72l5.127 11.28h4.195V0h-4.195v11.28L9.593 0H5.398z" />
    </svg>
  ),

  spotify: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#1DB954">
      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.32 9.78-.66 13.44 1.56.42.24.54.84.3 1.261zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.62.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),

  apple: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.75-.95 2.78 1.01.08 2.06-.54 2.68-1.29z" />
    </svg>
  ),

  amazon: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#FF9900">
      <path d="M13.8 11.8c-.8.1-1.7.3-2.5.5-1.9.4-3.1 1.3-3.1 2.7 0 1.6 1.3 2.6 3.1 2.6 1.4 0 2.6-.6 3.3-1.6v1.3h2.6V12c0-2.8-1.8-4.1-4.8-4.1-2.6 0-4.6 1-5 3.3l2.5.3c.3-1.1 1.2-1.6 2.5-1.6 1.4 0 2.2.6 2.2 1.9v.3zm-.3 3.6c-.5.6-1.2.9-2 .9-.9 0-1.5-.5-1.5-1.3 0-.9.7-1.4 2-1.7.6-.1 1.1-.2 1.5-.3v2.4z" />
      <path d="M21.2 19.3c-2.3 1.8-5.6 2.7-8.8 2.7-4.4 0-8.4-1.6-11.4-4.3-.2-.2 0-.5.3-.3 3.2 1.8 7.2 2.9 11.4 2.9 2.8 0 5.8-.6 8.5-1.8.4-.2.7.3.3.6z" />
    </svg>
  ),

  discord: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),

  twitch: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#9146FF">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  ),

  microsoft: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  ),

  slack: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.527 2.527 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"
        fill="#ECB22E"
      />
    </svg>
  ),

  reddit: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#FF4500">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.344 6.315 3.516 8.484l-1.026 3.123c-.116.353.226.695.579.579l3.123-1.026C8.369 23.656 10.128 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.67 14.5c.01.168.015.337.015.508 0 2.593-3.003 4.695-6.685 4.695-3.682 0-6.685-2.102-6.685-4.695 0-.171.005-.34.015-.508a2.127 2.127 0 01-1.127-1.87 2.13 2.13 0 013.39-1.696c1.192-.767 2.809-1.258 4.6-1.317l.867-4.084a.273.273 0 01.32-.21l2.843.604a1.69 1.69 0 11.23.896l-2.458-.522-.72 3.39c1.83.05 3.486.538 4.692 1.312a2.13 2.13 0 013.39 1.696c0 .822-.464 1.536-1.14 1.88z" />
    </svg>
  ),

  notion: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.393-.84c.326-.046.373-.233.093-.42L16.27 1.737c-.56-.373-1.354-.513-2.101-.42L3.06 2.39c-.42.047-.513.28-.28.513l1.68 1.305zm1.26 3.686v13.532c0 .793.373 1.12 1.26 1.073l12.878-.887c.887-.046 1.073-.56 1.073-1.353V6.76c0-.793-.326-1.12-1.073-1.073l-13.018.887c-.84.046-1.12.42-1.12 1.32zm12.318.513c.093.42.046.84-.326.887l-1.027.14c-.373.046-.513.28-.513.653v10.125c0 .326.14.466.513.42l1.213-.14c.373-.046.466.187.42.56l-.14 1.027c-.046.373-.28.466-.653.513l-4.153.28c-.373.046-.513-.14-.513-.466v-.887c0-.326.14-.513.466-.56l1.027-.093c.373-.046.466-.28.466-.606v-4.573L10.3 20.31c-.373.466-.7.466-1.073.326l-2.753-.887c-.373-.14-.42-.42-.42-.746V8.627c0-.373.14-.56.513-.606l1.493-.233c.373-.046.513.14.513.466v6.906l4.246-6.813c.373-.56.746-.606 1.213-.56l5.086.326c.42.047.56.233.56.653z" />
    </svg>
  ),

  paypal: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="#003087">
      <path d="M20.067 8.478c.492.315.844.782.996 1.391.218.872.086 2.05-.398 3.535-.747 2.29-2.222 3.82-4.426 4.592a8.558 8.558 0 0 1-2.828.43h-2.922c-.446 0-.825.32-.897.76l-.763 4.829c-.04.254-.258.441-.515.441H2.438a.517.517 0 0 1-.51-.595l3.208-20.31a.885.885 0 0 1 .874-.747h6.635c2.31 0 4.1.516 5.32 1.535 1.05.877 1.558 2.072 1.51 3.555a6.49 6.49 0 0 1-.408 2.184z" />
    </svg>
  ),

  openai: ({ className = 'w-5 h-5', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0813 4.779-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4952 4.4953z" />
    </svg>
  ),
};

export function getServiceIcon(serviceName: string, category?: string) {
  const cleanName = (serviceName || '').toLowerCase().trim();

  // Match brand
  if (cleanName.includes('google') || cleanName.includes('gmail')) return RealServiceIcons.google;
  if (cleanName.includes('github')) return RealServiceIcons.github;
  if (cleanName.includes('twitter') || cleanName.includes('x.com')) return RealServiceIcons.twitter;
  if (cleanName.includes('facebook')) return RealServiceIcons.facebook;
  if (cleanName.includes('instagram')) return RealServiceIcons.instagram;
  if (cleanName.includes('linkedin')) return RealServiceIcons.linkedin;
  if (cleanName.includes('netflix')) return RealServiceIcons.netflix;
  if (cleanName.includes('spotify')) return RealServiceIcons.spotify;
  if (cleanName.includes('apple') || cleanName.includes('icould')) return RealServiceIcons.apple;
  if (cleanName.includes('amazon')) return RealServiceIcons.amazon;
  if (cleanName.includes('discord')) return RealServiceIcons.discord;
  if (cleanName.includes('twitch')) return RealServiceIcons.twitch;
  if (cleanName.includes('microsoft') || cleanName.includes('outlook') || cleanName.includes('hotmail'))
    return RealServiceIcons.microsoft;
  if (cleanName.includes('slack')) return RealServiceIcons.slack;
  if (cleanName.includes('reddit')) return RealServiceIcons.reddit;
  if (cleanName.includes('notion')) return RealServiceIcons.notion;
  if (cleanName.includes('paypal')) return RealServiceIcons.paypal;
  if (cleanName.includes('openai') || cleanName.includes('chatgpt')) return RealServiceIcons.openai;

  // Category fallback
  switch (category) {
    case 'card':
      return ({ className }: { className?: string }) => <CreditCard className={className} />;
    case 'bank':
      return ({ className }: { className?: string }) => <Landmark className={className} />;
    case 'note':
      return ({ className }: { className?: string }) => <FileText className={className} />;
    case 'apikey':
      return ({ className }: { className?: string }) => <Key className={className} />;
    case 'identity':
      return ({ className }: { className?: string }) => <Shield className={className} />;
    default:
      return ({ className }: { className?: string }) => <Globe className={className} />;
  }
}

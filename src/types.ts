import { DecryptedSecretPayload } from './lib/crypto';

export type CategoryType = 'login' | 'card' | 'bank' | 'note' | 'apikey' | 'identity';

export interface UserSession {
  id: string;
  email: string;
  salt: string;
  twoFactorEnabled: boolean;
  hasWebAuthn: boolean;
  masterPasswordHint?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface EncryptedVaultItem {
  id: string;
  userId: string;
  encryptedData: string;
  iv: string;
  category: CategoryType;
  serviceName: string;
  serviceIcon?: string;
  favorite: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface DecryptedVaultItem extends EncryptedVaultItem {
  payload: DecryptedSecretPayload;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  ipAddress?: string;
  status: 'success' | 'failure' | 'warning';
  timestamp: string;
}

export type ViewTab = 'vault' | 'audit' | 'generator' | 'activity' | 'settings';

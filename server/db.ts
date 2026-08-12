import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string; // Salt for auth password hash
  masterPasswordHint?: string;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  webAuthnCredentials: Array<{
    id: string;
    publicKey: string;
    counter: number;
    transports?: string[];
    createdAt: string;
  }>;
  createdAt: string;
  lastLoginAt?: string;
}

export interface VaultItem {
  id: string;
  userId: string;
  encryptedData: string; // Base64 ciphertext of JSON payload
  iv: string;            // Base64 Initialization Vector (12 bytes)
  category: 'login' | 'card' | 'bank' | 'note' | 'apikey' | 'identity';
  serviceName: string;   // e.g., "Google", "GitHub"
  serviceIcon?: string;  // Icon identifier or domain
  favorite: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  timestamp: string;
}

interface DBData {
  users: User[];
  vaultItems: VaultItem[];
  activityLogs: ActivityLog[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'vault_db.json');

class DatabaseManager {
  private data: DBData = { users: [], vaultItems: [], activityLogs: [] };

  constructor() {
    this.init();
  }

  private init() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('[DB] Failed to load database, initializing fallback:', err);
      this.data = { users: [], vaultItems: [], activityLogs: [] };
    }
  }

  private save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to persist database:', err);
    }
  }

  // Users
  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return undefined;
  }

  // Vault Items
  public getVaultItemsByUserId(userId: string): VaultItem[] {
    return this.data.vaultItems.filter((v) => v.userId === userId);
  }

  public getVaultItemById(id: string, userId: string): VaultItem | undefined {
    return this.data.vaultItems.find((v) => v.id === id && v.userId === userId);
  }

  public createVaultItem(item: VaultItem): VaultItem {
    this.data.vaultItems.push(item);
    this.save();
    return item;
  }

  public updateVaultItem(id: string, userId: string, updates: Partial<VaultItem>): VaultItem | undefined {
    const idx = this.data.vaultItems.findIndex((v) => v.id === id && v.userId === userId);
    if (idx !== -1) {
      this.data.vaultItems[idx] = {
        ...this.data.vaultItems[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.data.vaultItems[idx];
    }
    return undefined;
  }

  public deleteVaultItem(id: string, userId: string): boolean {
    const initialLen = this.data.vaultItems.length;
    this.data.vaultItems = this.data.vaultItems.filter((v) => !(v.id === id && v.userId === userId));
    if (this.data.vaultItems.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Activity Logs
  public addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const entry: ActivityLog = {
      ...log,
      id: 'log_' + Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
    };
    this.data.activityLogs.unshift(entry);
    // Keep max 500 logs
    if (this.data.activityLogs.length > 500) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 500);
    }
    this.save();
    return entry;
  }

  public getActivityLogsByUserId(userId: string, limit = 50): ActivityLog[] {
    return this.data.activityLogs.filter((l) => l.userId === userId).slice(0, limit);
  }
}

export const db = new DatabaseManager();

# REST API & Database Schema Documentation

## 1. REST API Specification

### Authentication Endpoints

#### `POST /api/auth/register`
Creates a new user account with master salt and authentication password hash.
- **Request Body**:
  ```json
  {
    "email": "alex@vaultshield.io",
    "passwordHash": "a8f5c9...",
    "salt": "3f8a12...",
    "masterPasswordHint": "Favorite book title"
  }
  ```
- **Response**: `{ "success": true, "token": "usr_...", "user": { ... } }`

#### `GET /api/auth/salt?email=...`
Retrieves user salt required to derive key before login.
- **Response**: `{ "salt": "3f8a12...", "exists": true, "twoFactorEnabled": false }`

#### `POST /api/auth/login`
Authenticates user with email and derived password hash.
- **Response**: `{ "success": true, "token": "usr_...", "user": { ... } }` or `{ "requires2FA": true }`

#### `POST /api/auth/verify-2fa`
Verifies 6-digit TOTP code during multi-factor login.
- **Request Body**: `{ "userId": "usr_...", "code": "123456" }`

#### `POST /api/auth/demo-login`
Provides instant access to test account with pre-configured sample encrypted items.

---

### Vault Endpoints (Requires `Authorization: Bearer <userId>`)

#### `GET /api/vault`
Fetches all encrypted vault items for the authenticated user.
- **Response**:
  ```json
  {
    "items": [
      {
        "id": "item_8f21a",
        "userId": "usr_992a",
        "category": "login",
        "serviceName": "Google",
        "encryptedData": "b3BlbnNzbC...",
        "iv": "a3F1...",
        "favorite": true,
        "updatedAt": "2026-08-12T04:10:00Z"
      }
    ]
  }
  ```

#### `POST /api/vault`
Saves a new encrypted secret item.

#### `PUT /api/vault/:id`
Updates an existing vault item.

#### `DELETE /api/vault/:id`
Deletes a vault item.

---

## 2. Database Schema (`data/vault_db.json`)

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  masterPasswordHint?: string;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  webAuthnCredentials: Array<{
    id: string;
    publicKey: string;
    counter: number;
    createdAt: string;
  }>;
  createdAt: string;
  lastLoginAt?: string;
}

interface VaultItem {
  id: string;
  userId: string;
  encryptedData: string; // Base64 AES-GCM Ciphertext
  iv: string;            // Base64 12-byte IV
  category: 'login' | 'card' | 'bank' | 'note' | 'apikey' | 'identity';
  serviceName: string;
  serviceIcon?: string;
  favorite: boolean;
  updatedAt: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress?: string;
  status: 'success' | 'failure' | 'warning';
  timestamp: string;
}
```

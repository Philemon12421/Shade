# System Architecture & Data Flow

## 1. Architectural Philosophy
VaultShield adheres strictly to the **Zero-Knowledge Security Architecture**. All cryptographic operations (key derivation, encryption, decryption, entropy calculation) take place strictly within the client's browser context via the Web Crypto API (`window.crypto.subtle`).

```
                    +-----------------------------+
                    |    Browser Client Context   |
                    |                             |
                    |  +-----------------------+  |
                    |  | Master Key Derivation |  |
                    |  +-----------+-----------+  |
                    |              |              |
                    |  +-----------v-----------+  |
                    |  | AES-GCM 256 Encryption|  |
                    |  +-----------+-----------+  |
                    +--------------|--------------+
                                   |
                         Ciphertext + IV
                                   |
                                   v
                    +-----------------------------+
                    |   Express Backend Server    |
                    |                             |
                    |  +-----------------------+  |
                    |  | REST API Endpoints    |  |
                    |  +-----------+-----------+  |
                    |              |              |
                    |  +-----------v-----------+  |
                    |  | Disk DB (vault_db.json)| |
                    |  +-----------------------+  |
                    +-----------------------------+
```

---

## 2. Component Hierarchy

- **`App.tsx`**: Central application state container managing session, master key, item cache, search queries, and tab routes.
  - **`Header.tsx`**: Top header with security indicators, instant lock, search bar, and tab navigation.
  - **`AuthScreen.tsx`**: Unauthenticated entry point supporting Sign Up, Sign In, 2FA challenge, WebAuthn passkeys, and Demo access.
  - **`VaultCard.tsx`**: Renders individual secret cards with brand icons, copy-with-timer actions, and visibility toggles.
  - **`ItemModal.tsx`**: Dialog for creating and editing records with dynamic form inputs based on item category.
  - **`SecurityAuditView.tsx`**: Automated scanner evaluating vault health, weak passwords, and credential reuse.
  - **`SecuritySettingsModal.tsx`**: Controls for TOTP 2FA setup and WebAuthn passkey registration.
  - **`ActivityLogModal.tsx`**: Audit log viewer for security-sensitive account events.
  - **`ImportExportModal.tsx`**: Encrypted backup and restore utilities.

---

## 3. Data Flow Steps

### Secret Creation Workflow
1. User enters plain text account secret (e.g., password, card details) into `ItemModal`.
2. Client calls `encryptPayload(payload, masterKey)` in `src/lib/crypto.ts`.
3. Web Crypto API generates a 12-byte random IV and returns AES-GCM 256 ciphertext.
4. Client issues `POST /api/vault` with `encryptedData`, `iv`, `serviceName`, and `category`.
5. Express server stores ciphertext in `data/vault_db.json`.

### Secret Retrieval Workflow
1. Client sends `GET /api/vault` with `Authorization: Bearer <userId>`.
2. Server responds with user's encrypted vault records.
3. Client loops over records and executes `decryptPayload(encryptedData, iv, masterKey)`.
4. Decrypted plain-text secret is held strictly in volatile React state.

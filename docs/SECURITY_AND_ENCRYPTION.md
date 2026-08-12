# Security & Encryption Specification

## 1. Zero-Knowledge Cryptography

VaultShield employs a **Zero-Knowledge Security Standard**. The server never receives, logs, or stores the Master Password or unencrypted vault data.

### Key Derivation Function (PBKDF2)
- **Algorithm**: `PBKDF2-HMAC-SHA-256`
- **Iterations**: `100,000` rounds
- **Salt**: 16 cryptographically secure random bytes (32 hex characters) generated per user on registration
- **Output**: 256-bit AES-GCM Key (`CryptoKey` object)

### Authenticator Password Hash (Server Verifier)
To authenticate the user without sending the Master Password or encryption key:
```
Auth Hash = PBKDF2(MasterPassword, Salt + "_vaultshield_auth", 50000, SHA-256)
```
This derived Auth Hash is transmitted to the server for authentication comparison, ensuring that even if the server database is compromised, the Master Key cannot be computed.

---

## 2. AES-256-GCM Payload Encryption

- **Cipher Specification**: `AES-256-GCM` (Galois/Counter Mode)
- **Initialization Vector (IV)**: 12 random bytes generated using `window.crypto.getRandomValues()` for every encryption operation.
- **Authentication Tag**: Embedded within GCM mode to prevent payload tampering.

---

## 3. Two-Factor Authentication (2FA)

- **Standard**: Time-based One-Time Password (TOTP) compliant with RFC 6238.
- **Secret Generation**: 160-bit (20-byte) cryptographically secure secret.
- **URI Format**: `otpauth://totp/VaultShield:user@example.com?secret=SECRET&issuer=VaultShield`

---

## 4. WebAuthn / Biometric Passkeys

- **API**: Standard W3C WebAuthn API (`navigator.credentials.create` and `navigator.credentials.get`).
- **Authenticator Support**: Platform authenticators (Apple Touch ID, Face ID, Windows Hello, Android Fingerprint).
- **Public Key Cryptography**: ECDSA over P-256 (`alg: -7`) or RSA (`alg: -257`).

---

## 5. Memory Security Practices

1. **Auto-Lock Timer**: Automatic session locking after 5 minutes of inactivity.
2. **Clipboard Auto-Clear**: Copied secrets trigger a 30-second countdown after which the clipboard is cleared.
3. **Non-Extractable Keys**: CryptoKeys are initialized with `extractable: false` when supported.

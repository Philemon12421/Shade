# Shade -  Encrypted Secrets Manager

Shade is a modern, zero-knowledge secrets and password manager built with React 19, TypeScript, Express, and Tailwind CSS. Designed with a clean **white glassmorphism aesthetic**, VaultShield ensures that user credentials never leave the browser unencrypted.

---

## 🌟 Key Features 

- **Zero-Knowledge Client Encryption**: All secret data (passwords, credit cards, bank accounts, secure notes, API keys) is encrypted locally using **AES-256-GCM** with a key derived from the user's Master Password via **PBKDF2 (100,000 iterations)**.
- **Authentic Social Media & Brand Icons**: Integrated high-fidelity brand SVGs for Google, GitHub, X/Twitter, Facebook, Instagram, LinkedIn, Netflix, Spotify, Apple, Amazon, Discord, Twitch, Microsoft, Slack, Reddit, Notion, PayPal, OpenAI, and more.
- **Multi-Factor Authentication (2FA)**: Full support for TOTP authenticator applications (Google Authenticator, Authy, 1Password) with 6-digit verification.
- **WebAuthn / Biometric Login**: Touch ID, Face ID, and Fingerprint passkey enrollment and verification via standard WebAuthn browser APIs.
- **Password Strength Analyzer & Generator**: Built-in entropy calculator and customizable random password generator with one-click fill.
- **Vault Security Audit**: Automatic vulnerability scanner flagging weak passwords (<12 chars) and password reuse across accounts.
- **Auto-Clear Clipboard**: 30-second timer to clear copied passwords from system memory.
- **Backup & Restore**: Export encrypted JSON backups or CSV files, and restore vault records seamlessly.
- **White Glassmorphism UI**: Pristine, light neutral frosted-glass interface with high legibility and responsive layout.

---

## 🛡️ Security Architecture Overview

Shade operates on a **Zero-Knowledge Security Model**:

```
+-----------------------------------------------------------------------+
|                              CLIENT (Browser)                         |
|                                                                       |
|   Master Password -----> PBKDF2 (100k Iterations + Salt)             |
|                                |                                      |
|                                v                                      |
|                    AES-256 Encryption Key                             |
|                                |                                      |
|   Plain Text Secrets -------> AES-GCM-256 Encrypt -------> Ciphertext     |
+-----------------------------------------------------------------------+
                                                                |
                                                                | HTTPS / REST
                                                                v
+-----------------------------------------------------------------------+
|                            SERVER & DATABASE                          |
|                                                                       |
|   Only Stores: Ciphertext Base64, IV Base64, Salt, Auth Hash           |
|   * Zero Knowledge of User Secrets or Master Password *               |
+-----------------------------------------------------------------------+
```

---

## 📁 Repository Structure & Documentation

Detailed developer documentation is located in the [`/docs`](/docs) directory:

- 📖 [`README.md`](/README.md) - Project overview and quick start guide.
- ⚙️ [`/docs/TECHNICAL.md`](/docs/TECHNICAL.md) - Technical specifications, system components, and stack choices.
- 🏗️ [`/docs/ARCHITECTURE.md`](/docs/ARCHITECTURE.md) - Frontend and Backend architectural patterns and data flows.
- 🔐 [`/docs/SECURITY_AND_ENCRYPTION.md`](/docs/SECURITY_AND_ENCRYPTION.md) - Cryptographic design, key derivation, 2FA, and WebAuthn specs.
- 📡 [`/docs/API_AND_DATABASE.md`](/docs/API_AND_DATABASE.md) - REST API endpoint specifications and JSON schema definitions.

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

---

## 📄 License
Apache License 2.0. Built for Drenchack Tech Company

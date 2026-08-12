# Technical Specifications

## 1. Overview
VaultShield is built as a full-stack Web Application utilizing Node.js with Express for the HTTP API layer and React 19 with Vite for the single-page application frontend.

## 2. Technology Stack

### Frontend
- **Framework**: React 19 (`react`, `react-dom`)
- **Build System**: Vite 6 (`vite`, `@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
- **Animation**: Motion v12 (`motion`)
- **Icons**: Lucide React (`lucide-react`) + Custom SVG Brand Registry
- **Language**: TypeScript 5.8 (`typescript`)

### Backend
- **Runtime**: Node.js ES Modules / CommonJS bundled via `esbuild`
- **Server Framework**: Express 4 (`express`)
- **Persistence Layer**: Disk-backed ACID-like JSON engine (`server/db.ts`)
- **Dev Execution**: `tsx` for direct TypeScript server execution

---

## 3. Directory Layout

```
/
├── README.md
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── server.ts                  # Express server entry point
├── server/
│   └── db.ts                  # Disk database manager
├── docs/                      # Technical documentation folder
│   ├── TECHNICAL.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY_AND_ENCRYPTION.md
│   └── API_AND_DATABASE.md
├── data/
│   └── vault_db.json          # Persisted user & ciphertext database
└── src/
    ├── main.tsx               # Client React entry point
    ├── App.tsx                # Main container component
    ├── index.css              # Global Tailwind CSS imports
    ├── types.ts               # Shared TypeScript interfaces
    ├── lib/
    │   ├── crypto.ts          # Web Crypto API encryption module
    │   └── icons.tsx          # Real social media brand icons
    └── components/
        ├── Header.tsx         # Navigation & user status
        ├── AuthScreen.tsx     # Sign in, Sign up, 2FA, Biometrics
        ├── VaultCard.tsx      # Secret item card
        ├── ItemModal.tsx      # Create / Edit secret modal
        ├── PasswordGeneratorModal.tsx
        ├── SecurityAuditView.tsx
        ├── SecuritySettingsModal.tsx
        ├── ActivityLogModal.tsx
        └── ImportExportModal.tsx
```

---

## 4. Build Pipeline
- **Development**: `tsx server.ts` starts Express server with Vite dev middleware on port 3000.
- **Production Build**:
  1. `vite build` bundles client static assets into `dist/`.
  2. `esbuild server.ts --bundle --platform=node --format=cjs` compiles `server.ts` into `dist/server.cjs`.
- **Production Run**: `node dist/server.cjs` hosts static assets from `dist/` and handles `/api/*` endpoints.

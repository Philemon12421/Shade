/**
 * @file crypto.ts
 * Client-Side Zero-Knowledge Encryption Engine using Web Crypto API (AES-GCM 256-bit & PBKDF2)
 */

export interface DecryptedSecretPayload {
  usernameOrEmail: string;
  password?: string;
  notes?: string;
  url?: string;
  accountNumber?: string;
  pin?: string;
  cardHolder?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  apiKey?: string;
  apiSecret?: string;
  tags?: string[];
  customFields?: Array<{ label: string; value: string }>;
}

export interface PasswordStrength {
  score: number; // 0 - 100
  label: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Unbreakable';
  color: string;
  crackTimeEstimate: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  isCommon: boolean;
}

export interface PasswordGenOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean; // e.g. 0, O, 1, l, I
}

// Convert ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to ArrayBuffer
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert hex string to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Convert Uint8Array to Hex string
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate random Salt (16 bytes = 32 hex)
export function generateSaltHex(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return bytesToHex(array);
}

/**
 * Derive 256-bit AES-GCM Key from Master Password + Salt using PBKDF2 (100,000 iterations)
 */
export async function deriveMasterKey(masterPassword: string, saltHex: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(masterPassword);
  const saltBytes = hexToBytes(saltHex);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, // Non-extractable for security
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive Password Verifier Hash for Server Authentication (Separate PBKDF2 derivation so server never gets key)
 */
export async function deriveAuthHash(masterPassword: string, saltHex: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(masterPassword);
  const authSaltBytes = encoder.encode(saltHex + '_shride_auth');

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: authSaltBytes,
      iterations: 50000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return bytesToHex(new Uint8Array(derivedBits));
}

/**
 * Encrypt JSON Payload with AES-GCM 256-bit
 */
export async function encryptPayload(payload: any, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(JSON.stringify(payload));

  // 12 bytes IV (Recommended for AES-GCM)
  const ivBytes = new Uint8Array(12);
  window.crypto.getRandomValues(ivBytes);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    key,
    dataBytes
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(ivBytes.buffer),
  };
}

/**
 * Decrypt AES-GCM 256-bit Payload
 */
export async function decryptPayload<T = DecryptedSecretPayload>(
  ciphertextBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<T> {
  const encryptedBuffer = base64ToBuffer(ciphertextBase64);
  const ivBuffer = base64ToBuffer(ivBase64);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(ivBuffer),
    },
    key,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  const jsonString = decoder.decode(decryptedBuffer);
  return JSON.parse(jsonString) as T;
}

/**
 * Generate Secure Customizable Password
 */
export function generateSecurePassword(options: PasswordGenOptions): string {
  let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  let numberChars = '0123456789';
  let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.excludeAmbiguous) {
    uppercaseChars = uppercaseChars.replace(/[O]/g, '');
    lowercaseChars = lowercaseChars.replace(/[l]/g, '');
    numberChars = numberChars.replace(/[01]/g, '');
    symbolChars = symbolChars.replace(/[|]/g, '');
  }

  let charset = '';
  const requiredChars: string[] = [];

  if (options.uppercase) {
    charset += uppercaseChars;
    requiredChars.push(getRandomChar(uppercaseChars));
  }
  if (options.lowercase) {
    charset += lowercaseChars;
    requiredChars.push(getRandomChar(lowercaseChars));
  }
  if (options.numbers) {
    charset += numberChars;
    requiredChars.push(getRandomChar(numberChars));
  }
  if (options.symbols) {
    charset += symbolChars;
    requiredChars.push(getRandomChar(symbolChars));
  }

  if (charset === '') charset = lowercaseChars + numberChars;

  const length = Math.max(options.length, requiredChars.length);
  const result: string[] = [...requiredChars];

  for (let i = requiredChars.length; i < length; i++) {
    result.push(getRandomChar(charset));
  }

  // Cryptographic shuffle
  return shuffleArray(result).join('');
}

function getRandomChar(chars: string): string {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return chars[array[0] % chars.length];
}

function shuffleArray(array: string[]): string[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    const j = randomArray[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Calculate Password Entropy & Strength Metrics
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      color: '#ef4444',
      crackTimeEstimate: 'Instant',
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false,
      isCommon: false,
    };
  }

  const hasMinLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  let poolSize = 0;
  if (hasUppercase) poolSize += 26;
  if (hasLowercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 32;

  if (poolSize === 0) poolSize = 1;

  // Bits of Entropy = Length * log2(Pool Size)
  const entropy = password.length * Math.log2(poolSize);

  let score = Math.min(100, Math.round((entropy / 80) * 100));
  let label: PasswordStrength['label'] = 'Very Weak';
  let color = '#ef4444'; // Red
  let crackTimeEstimate = 'Instant';

  if (entropy < 28) {
    label = 'Very Weak';
    color = '#ef4444';
    crackTimeEstimate = 'Few seconds';
  } else if (entropy < 45) {
    label = 'Weak';
    color = '#f97316';
    crackTimeEstimate = 'A few hours';
  } else if (entropy < 65) {
    label = 'Moderate';
    color = '#eab308';
    crackTimeEstimate = 'Several months';
  } else if (entropy < 85) {
    label = 'Strong';
    color = '#10b981';
    crackTimeEstimate = '100+ years';
  } else {
    label = 'Unbreakable';
    color = '#06b6d4';
    crackTimeEstimate = 'Trillions of years';
  }

  return {
    score,
    label,
    color,
    crackTimeEstimate,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
    isCommon: ['password', '123456', 'qwerty', 'admin', 'welcome'].includes(password.toLowerCase()),
  };
}

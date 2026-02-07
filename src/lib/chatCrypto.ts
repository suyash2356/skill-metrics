/**
 * End-to-End Encryption utilities for chat messages.
 * Uses the native Web Crypto API (RSA-OAEP + AES-GCM + PBKDF2).
 * No external dependencies needed.
 */

// ─── Helpers ───────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ─── Key Generation ────────────────────────────────────────

export async function generateKeyPair(): Promise<{ publicKey: JsonWebKey; privateKey: JsonWebKey }> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );

  const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

  return { publicKey, privateKey };
}

// ─── Password-based Key Derivation ────────────────────────

async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return arrayBufferToBase64(salt.buffer);
}

// ─── Encrypt / Decrypt Private Key with Password ──────────

export async function encryptPrivateKey(
  privateKeyJwk: JsonWebKey,
  password: string,
  saltBase64: string
): Promise<string> {
  const salt = new Uint8Array(base64ToArrayBuffer(saltBase64));
  const aesKey = await deriveKeyFromPassword(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(privateKeyJwk));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    plaintext
  );

  // Return as JSON: { iv, ct }
  return JSON.stringify({
    iv: arrayBufferToBase64(iv.buffer),
    ct: arrayBufferToBase64(ciphertext),
  });
}

export async function decryptPrivateKey(
  encryptedBlob: string,
  password: string,
  saltBase64: string
): Promise<JsonWebKey> {
  const { iv, ct } = JSON.parse(encryptedBlob);
  const salt = new Uint8Array(base64ToArrayBuffer(saltBase64));
  const aesKey = await deriveKeyFromPassword(password, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(base64ToArrayBuffer(iv)) },
    aesKey,
    base64ToArrayBuffer(ct)
  );

  return JSON.parse(new TextDecoder().decode(plaintext));
}

// ─── Message Encryption ───────────────────────────────────

export interface EncryptedMessage {
  v: 1;
  type: 'e2ee';
  keys: Record<string, string>; // userId -> RSA-encrypted AES session key
  iv: string;
  ct: string;
}

/**
 * Encrypt a plaintext message for sender and recipient.
 * Both can decrypt using their own private key.
 */
export async function encryptMessage(
  plaintext: string,
  senderPublicKeyJwk: JsonWebKey,
  recipientPublicKeyJwk: JsonWebKey,
  senderId: string,
  recipientId: string
): Promise<string> {
  // 1. Generate a random AES-256-GCM session key
  const sessionKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const rawSessionKey = await crypto.subtle.exportKey('raw', sessionKey);

  // 2. Encrypt the message with the session key
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sessionKey,
    new TextEncoder().encode(plaintext)
  );

  // 3. Encrypt the session key with each user's RSA public key
  const importRsaPublic = async (jwk: JsonWebKey) =>
    crypto.subtle.importKey('jwk', jwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);

  const senderRsaPub = await importRsaPublic(senderPublicKeyJwk);
  const recipientRsaPub = await importRsaPublic(recipientPublicKeyJwk);

  const encSenderKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, senderRsaPub, rawSessionKey);
  const encRecipientKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, recipientRsaPub, rawSessionKey);

  const envelope: EncryptedMessage = {
    v: 1,
    type: 'e2ee',
    keys: {
      [senderId]: arrayBufferToBase64(encSenderKey),
      [recipientId]: arrayBufferToBase64(encRecipientKey),
    },
    iv: arrayBufferToBase64(iv.buffer),
    ct: arrayBufferToBase64(ciphertext),
  };

  return JSON.stringify(envelope);
}

/**
 * Decrypt a message using the user's private key.
 */
export async function decryptMessage(
  encryptedContent: string,
  privateKeyJwk: JsonWebKey,
  userId: string
): Promise<string> {
  const envelope: EncryptedMessage = JSON.parse(encryptedContent);

  if (envelope.type !== 'e2ee' || envelope.v !== 1) {
    throw new Error('Unknown encryption format');
  }

  const encSessionKeyB64 = envelope.keys[userId];
  if (!encSessionKeyB64) {
    throw new Error('No key for this user in the message envelope');
  }

  // 1. Decrypt the session key with our RSA private key
  const rsaPrivate = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );

  const rawSessionKey = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    rsaPrivate,
    base64ToArrayBuffer(encSessionKeyB64)
  );

  // 2. Import as AES key
  const sessionKey = await crypto.subtle.importKey(
    'raw',
    rawSessionKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // 3. Decrypt the message
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(base64ToArrayBuffer(envelope.iv)) },
    sessionKey,
    base64ToArrayBuffer(envelope.ct)
  );

  return new TextDecoder().decode(plaintext);
}

/**
 * Check if content looks like an encrypted message.
 */
export function isEncryptedMessage(content: string | null): boolean {
  if (!content) return false;
  try {
    const parsed = JSON.parse(content);
    return parsed?.type === 'e2ee' && parsed?.v === 1;
  } catch {
    return false;
  }
}

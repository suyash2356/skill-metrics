

# End-to-End Encrypted Messaging with Chat Password

## Overview

This plan adds client-side encryption to the existing messaging system. All messages will be encrypted in the browser before being sent to the database. Only the sender and receiver can read them. Even the database admin sees only scrambled text.

Users must set a "Chat Password" (custom text, minimum 6 characters) before they can use messaging. A recovery flow via email OTP allows resetting the password if forgotten (old messages become unreadable).

---

## How It Works (User Flow)

1. **First time visiting Messages**: User sees a setup screen asking them to create a Chat Password
2. **Sending a message**: Browser fetches recipient's public key, encrypts the message locally, sends encrypted text to the database
3. **Reading messages**: Browser downloads the user's encrypted private key, decrypts it using the Chat Password (held in session memory), then decrypts each message
4. **Forgot password**: User clicks "Forgot Password" on the PIN entry screen, receives an email OTP, verifies it, then sets a new Chat Password. A new key pair is generated -- old messages become unreadable (shown as "[Cannot decrypt - password was reset]")

---

## Technical Implementation

### Step 1: Database Changes (Migration)

Add a new table for encryption keys:

```text
Table: user_encryption_keys
- id (uuid, PK)
- user_id (uuid, unique, not null)
- public_key (text, not null)          -- RSA-OAEP public key in JWK format
- encrypted_private_key (text, not null) -- AES-GCM encrypted private key
- key_salt (text, not null)            -- Salt for PBKDF2 key derivation
- key_version (integer, default 1)     -- Incremented on password reset
- created_at, updated_at
```

RLS policies:
- SELECT: Anyone authenticated can read `public_key` (needed for encryption)
- INSERT/UPDATE: Only own `user_id = auth.uid()`
- A security definer function `get_public_key(target_user_id)` to fetch public keys without recursion

### Step 2: Edge Function for Password Recovery OTP

Create `supabase/functions/send-chat-otp/index.ts`:
- Accepts `{ email }` in the request body
- Generates a 6-digit OTP, stores it in a `chat_password_otps` table (with 10-minute expiry)
- Sends it via Resend to the user's email
- Rate-limited to 3 requests per hour per user

New table `chat_password_otps`:
```text
- id, user_id, otp_hash (text), expires_at (timestamptz), used (boolean)
```

### Step 3: Crypto Utility Module

Create `src/lib/chatCrypto.ts`:

- **generateKeyPair()**: Uses Web Crypto API (`window.crypto.subtle`) to generate RSA-OAEP 2048-bit key pair
- **deriveKeyFromPassword(password, salt)**: PBKDF2 with 100,000 iterations to derive an AES-256-GCM key from the user's password
- **encryptPrivateKey(privateKey, password)**: Encrypts the private key JWK with the derived AES key
- **decryptPrivateKey(encryptedBlob, password, salt)**: Reverses the above
- **encryptMessage(plaintext, recipientPublicKey)**: Generates a random AES-256-GCM session key, encrypts the message with it, then encrypts the session key with the recipient's RSA public key. Returns a JSON blob containing both encrypted parts
- **decryptMessage(encryptedBlob, privateKey)**: Reverses the above

All using the native Web Crypto API (no external libraries needed).

### Step 4: Encryption Context & Session Management

Create `src/context/ChatEncryptionContext.tsx`:

- Stores the decrypted private key in React state (memory only, never persisted)
- Provides `isSetup` (has user created keys?), `isUnlocked` (has user entered password this session?)
- Methods: `setupEncryption(password)`, `unlockWithPassword(password)`, `lockChat()`, `resetPassword(newPassword, otp)`
- On app load, checks if `user_encryption_keys` row exists for the user
- Auto-locks when the tab is closed (keys wiped from memory)

### Step 5: UI Components

**New components:**

1. **`ChatPasswordSetup.tsx`** -- Full-screen modal shown on first visit to /messages
   - Password input (min 6 chars) with confirmation field
   - Strength indicator
   - "Create Password" button that generates keys and saves them

2. **`ChatPasswordUnlock.tsx`** -- Shown when user visits messages but hasn't entered password this session
   - Password input field
   - "Unlock" button
   - "Forgot Password?" link leading to OTP recovery flow

3. **`ChatPasswordReset.tsx`** -- OTP verification + new password creation
   - Step 1: Enter email, request OTP
   - Step 2: Enter OTP code
   - Step 3: Create new password (generates new key pair, old messages become unreadable)

### Step 6: Modify Existing Messaging Code

**`useMessages.ts` changes:**
- `sendMessage()`: Before inserting, encrypt the content using recipient's public key AND sender's public key (store two copies or use a shared session key approach). Actually, the standard approach is: generate a random AES key for the message, encrypt the message with it, then encrypt the AES key twice (once with sender's public key, once with recipient's public key). Store all as a JSON blob in the `content` column.
- `fetchMessages()`: After fetching, decrypt each message's content using the private key from context. If decryption fails (old messages after reset), show "[Message cannot be decrypted]"

**`Chat.tsx` changes:**
- Wrap the chat view with encryption context checks
- If not setup: show `ChatPasswordSetup`
- If not unlocked: show `ChatPasswordUnlock`
- If unlocked: show normal chat (messages auto-decrypted)
- Display a green lock icon in the header indicating encryption is active

**`Messages.tsx` changes:**
- Last message preview: decrypt if possible, show "[Encrypted message]" if not unlocked
- Add lock icon indicator

**`useConversations.ts` changes:**
- Last message content will be encrypted -- show "[Encrypted message]" in conversation list when password isn't entered yet, or decrypt preview when unlocked

### Step 7: Message Format

The encrypted content stored in the `messages.content` column will be a JSON string:

```json
{
  "v": 1,
  "type": "e2ee",
  "keys": {
    "<sender_user_id>": "<base64 RSA-encrypted AES key>",
    "<recipient_user_id>": "<base64 RSA-encrypted AES key>"
  },
  "iv": "<base64 AES-GCM IV>",
  "ct": "<base64 AES-GCM ciphertext>"
}
```

This way both sender and recipient can decrypt using their own private key.

---

## Files to Create
- `src/lib/chatCrypto.ts` -- Core encryption/decryption utilities
- `src/context/ChatEncryptionContext.tsx` -- React context for key management
- `src/components/chat/ChatPasswordSetup.tsx` -- First-time setup UI
- `src/components/chat/ChatPasswordUnlock.tsx` -- Session unlock UI
- `src/components/chat/ChatPasswordReset.tsx` -- Forgot password recovery
- `supabase/functions/send-chat-otp/index.ts` -- OTP email sender
- Migration SQL for `user_encryption_keys` and `chat_password_otps` tables

## Files to Modify
- `src/hooks/useMessages.ts` -- Add encrypt/decrypt logic
- `src/hooks/useConversations.ts` -- Handle encrypted previews
- `src/pages/Chat.tsx` -- Add encryption gate screens
- `src/pages/Messages.tsx` -- Show encrypted preview indicators
- `src/App.tsx` -- Wrap with ChatEncryptionProvider
- `supabase/config.toml` -- Add edge function config

## Important Considerations
- No existing functionality will break -- unencrypted old messages will display normally (backward compatible)
- The Web Crypto API is available in all modern browsers natively
- Private keys never leave the browser in decrypted form
- The database only ever stores encrypted content
- Password reset means new key pair = old messages unreadable (by design, this is the security tradeoff)


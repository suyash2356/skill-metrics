import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  generateKeyPair,
  generateSalt,
  encryptPrivateKey,
  decryptPrivateKey,
} from '@/lib/chatCrypto';
import { toast } from 'sonner';

interface ChatEncryptionState {
  isSetup: boolean;
  isUnlocked: boolean;
  isLoading: boolean;
  privateKey: JsonWebKey | null;
  publicKey: JsonWebKey | null;
  keyVersion: number;
  setupEncryption: (password: string) => Promise<void>;
  unlockWithPassword: (password: string) => Promise<void>;
  lockChat: () => void;
  resetPassword: (newPassword: string) => Promise<void>;
  getUserPublicKey: (userId: string) => Promise<JsonWebKey | null>;
}

const ChatEncryptionContext = createContext<ChatEncryptionState | null>(null);

export function ChatEncryptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isSetup, setIsSetup] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [privateKey, setPrivateKey] = useState<JsonWebKey | null>(null);
  const [publicKey, setPublicKey] = useState<JsonWebKey | null>(null);
  const [keyVersion, setKeyVersion] = useState(1);
  const [encryptedData, setEncryptedData] = useState<{
    encrypted_private_key: string;
    key_salt: string;
  } | null>(null);

  // Check if user has encryption keys set up
  useEffect(() => {
    if (!user) {
      setIsSetup(false);
      setIsUnlocked(false);
      setPrivateKey(null);
      setPublicKey(null);
      setIsLoading(false);
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_encryption_keys')
          .select('public_key, encrypted_private_key, key_salt, key_version')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setIsSetup(true);
          setPublicKey(JSON.parse(data.public_key));
          setKeyVersion(data.key_version);
          setEncryptedData({
            encrypted_private_key: data.encrypted_private_key,
            key_salt: data.key_salt,
          });
        } else {
          setIsSetup(false);
        }
      } catch (err) {
        console.error('Error checking encryption keys:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  // Lock on tab close / beforeunload
  useEffect(() => {
    const handleUnload = () => {
      setPrivateKey(null);
      setIsUnlocked(false);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const setupEncryption = useCallback(async (password: string) => {
    if (!user) throw new Error('Not authenticated');

    const { publicKey: pubKey, privateKey: privKey } = await generateKeyPair();
    const salt = generateSalt();
    const encPrivKey = await encryptPrivateKey(privKey, password, salt);

    const { error } = await supabase.from('user_encryption_keys').insert({
      user_id: user.id,
      public_key: JSON.stringify(pubKey),
      encrypted_private_key: encPrivKey,
      key_salt: salt,
      key_version: 1,
    });

    if (error) throw error;

    setPublicKey(pubKey);
    setPrivateKey(privKey);
    setIsSetup(true);
    setIsUnlocked(true);
    setKeyVersion(1);
    setEncryptedData({ encrypted_private_key: encPrivKey, key_salt: salt });
  }, [user]);

  const unlockWithPassword = useCallback(async (password: string) => {
    if (!encryptedData) throw new Error('No encryption keys found');

    try {
      const privKey = await decryptPrivateKey(
        encryptedData.encrypted_private_key,
        password,
        encryptedData.key_salt
      );
      setPrivateKey(privKey);
      setIsUnlocked(true);
    } catch {
      throw new Error('Incorrect password');
    }
  }, [encryptedData]);

  const lockChat = useCallback(() => {
    setPrivateKey(null);
    setIsUnlocked(false);
  }, []);

  const resetPassword = useCallback(async (newPassword: string) => {
    if (!user) throw new Error('Not authenticated');

    // Generate entirely new key pair
    const { publicKey: pubKey, privateKey: privKey } = await generateKeyPair();
    const salt = generateSalt();
    const encPrivKey = await encryptPrivateKey(privKey, newPassword, salt);
    const newVersion = keyVersion + 1;

    const { error } = await supabase
      .from('user_encryption_keys')
      .update({
        public_key: JSON.stringify(pubKey),
        encrypted_private_key: encPrivKey,
        key_salt: salt,
        key_version: newVersion,
      })
      .eq('user_id', user.id);

    if (error) throw error;

    setPublicKey(pubKey);
    setPrivateKey(privKey);
    setIsSetup(true);
    setIsUnlocked(true);
    setKeyVersion(newVersion);
    setEncryptedData({ encrypted_private_key: encPrivKey, key_salt: salt });
    toast.warning('Password reset complete. Old messages cannot be decrypted.');
  }, [user, keyVersion]);

  const getUserPublicKey = useCallback(async (userId: string): Promise<JsonWebKey | null> => {
    try {
      const { data, error } = await supabase
        .from('user_encryption_keys')
        .select('public_key')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;
      return JSON.parse(data.public_key);
    } catch {
      return null;
    }
  }, []);

  return (
    <ChatEncryptionContext.Provider
      value={{
        isSetup,
        isUnlocked,
        isLoading,
        privateKey,
        publicKey,
        keyVersion,
        setupEncryption,
        unlockWithPassword,
        lockChat,
        resetPassword,
        getUserPublicKey,
      }}
    >
      {children}
    </ChatEncryptionContext.Provider>
  );
}

export function useChatEncryption() {
  const context = useContext(ChatEncryptionContext);
  if (!context) {
    throw new Error('useChatEncryption must be used within ChatEncryptionProvider');
  }
  return context;
}

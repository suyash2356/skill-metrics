import { useState } from 'react';
import { useChatEncryption } from '@/context/ChatEncryptionContext';
import { ChatPasswordSetup } from './ChatPasswordSetup';
import { ChatPasswordUnlock } from './ChatPasswordUnlock';
import { ChatPasswordReset } from './ChatPasswordReset';

interface ChatEncryptionGateProps {
  children: React.ReactNode;
}

/**
 * Wraps messaging pages. Shows setup/unlock screens if encryption
 * is not ready, otherwise renders children.
 */
export function ChatEncryptionGate({ children }: ChatEncryptionGateProps) {
  const { isSetup, isUnlocked, isLoading } = useChatEncryption();
  const [showReset, setShowReset] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isSetup) {
    return <ChatPasswordSetup />;
  }

  if (showReset) {
    return <ChatPasswordReset onBack={() => setShowReset(false)} />;
  }

  if (!isUnlocked) {
    return <ChatPasswordUnlock onForgotPassword={() => setShowReset(true)} />;
  }

  return <>{children}</>;
}

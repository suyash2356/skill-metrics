import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useChatEncryption } from '@/context/ChatEncryptionContext';
import { toast } from 'sonner';

interface ChatPasswordUnlockProps {
  onForgotPassword: () => void;
}

export function ChatPasswordUnlock({ onForgotPassword }: ChatPasswordUnlockProps) {
  const { unlockWithPassword } = useChatEncryption();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = async () => {
    if (!password) return;
    setIsSubmitting(true);
    try {
      await unlockWithPassword(password);
    } catch {
      toast.error('Incorrect password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-bold">Unlock Messages</h2>
          <p className="text-muted-foreground text-sm mt-2 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" /> Enter your Chat Password to decrypt your messages
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPass ? 'text' : 'password'}
              placeholder="Chat Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleUnlock(); }}
              className="pl-10 pr-10"
              autoFocus
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Button
            className="w-full"
            disabled={!password || isSubmitting}
            onClick={handleUnlock}
          >
            {isSubmitting ? 'Unlocking...' : 'Unlock'}
          </Button>

          <button
            className="text-sm text-primary hover:underline"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}

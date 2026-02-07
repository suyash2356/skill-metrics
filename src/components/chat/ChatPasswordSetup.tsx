import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { useChatEncryption } from '@/context/ChatEncryptionContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ChatPasswordSetup() {
  const { setupEncryption } = useChatEncryption();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checks = {
    length: password.length >= 6,
    match: password === confirm && confirm.length > 0,
    hasNumber: /\d/.test(password),
    hasMixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const canSubmit = checks.length && checks.match;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await setupEncryption(password);
      toast.success('End-to-end encryption enabled!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to set up encryption');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Secure Your Messages</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Create a Chat Password to enable end-to-end encryption. 
            Only you and the person you're chatting with can read messages.
          </p>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chat Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type={showPass ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>

          {/* Strength indicator */}
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i <= strength
                    ? strength <= 1 ? 'bg-destructive'
                      : strength <= 2 ? 'bg-orange-500'
                      : strength <= 3 ? 'bg-yellow-500'
                      : 'bg-green-500'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { ok: checks.length, text: 'At least 6 characters' },
              { ok: checks.hasNumber, text: 'Contains a number' },
              { ok: checks.hasMixed, text: 'Mixed case letters' },
              { ok: checks.match, text: 'Passwords match' },
            ].map((c, i) => (
              <div key={i} className={cn('flex items-center gap-2', c.ok ? 'text-green-600' : 'text-muted-foreground')}>
                {c.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {c.text}
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            disabled={!canSubmit || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Setting up encryption...' : 'Enable Encryption'}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          ⚠️ Remember this password. If you forget it, you can reset it via email 
          but all previous messages will become unreadable.
        </p>
      </div>
    </div>
  );
}

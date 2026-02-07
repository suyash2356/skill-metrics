import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, KeyRound, AlertTriangle } from 'lucide-react';
import { useChatEncryption } from '@/context/ChatEncryptionContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatPasswordResetProps {
  onBack: () => void;
}

export function ChatPasswordReset({ onBack }: ChatPasswordResetProps) {
  const { resetPassword } = useChatEncryption();
  const { user } = useAuth();
  const [step, setStep] = useState<'request' | 'verify' | 'newpass'>('request');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = user?.email || '';

  const handleRequestOtp = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-chat-otp', {
        body: { email },
      });
      if (error) throw error;
      toast.success('OTP sent to your email');
      setStep('verify');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-chat-otp', {
        body: { email, otp, action: 'verify' },
      });
      if (error) throw error;
      if (!data?.valid) {
        toast.error('Invalid or expired OTP');
        return;
      }
      toast.success('OTP verified');
      setStep('newpass');
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(newPassword);
      toast.success('Chat password reset successfully');
      onBack();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {step === 'request' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Mail className="h-7 w-7 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold">Reset Chat Password</h2>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Warning: Resetting your password will make all previous messages permanently unreadable.
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send a verification code to <strong>{email}</strong>
            </p>
            <Button className="w-full" onClick={handleRequestOtp} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Enter Verification Code</h2>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email
            </p>
            <Input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={6}
              autoFocus
            />
            <Button className="w-full" onClick={handleVerifyOtp} disabled={otp.length !== 6 || isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </Button>
            <button className="text-sm text-primary hover:underline" onClick={handleRequestOtp} disabled={isSubmitting}>
              Resend code
            </button>
          </div>
        )}

        {step === 'newpass' && (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold">Set New Chat Password</h2>
            <div className="space-y-3 text-left">
              <Input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleResetPassword} disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset & Enable Encryption'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

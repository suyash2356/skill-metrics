
-- Table for storing user encryption keys
CREATE TABLE public.user_encryption_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  public_key text NOT NULL,
  encrypted_private_key text NOT NULL,
  key_salt text NOT NULL,
  key_version integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read public keys (needed for encrypting messages to others)
CREATE POLICY "Anyone authenticated can read public keys"
  ON public.user_encryption_keys FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can only insert their own keys
CREATE POLICY "Users can insert own keys"
  ON public.user_encryption_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own keys
CREATE POLICY "Users can update own keys"
  ON public.user_encryption_keys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- No delete allowed
CREATE POLICY "No delete on encryption keys"
  ON public.user_encryption_keys FOR DELETE
  USING (false);

-- Security definer function to get a user's public key safely
CREATE OR REPLACE FUNCTION public.get_user_public_key(target_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public_key FROM user_encryption_keys WHERE user_id = target_user_id;
$$;

-- Table for chat password OTPs
CREATE TABLE public.chat_password_otps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  otp_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_password_otps ENABLE ROW LEVEL SECURITY;

-- Users can view their own OTPs
CREATE POLICY "Users can view own OTPs"
  ON public.chat_password_otps FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own OTPs
CREATE POLICY "Users can insert own OTPs"
  ON public.chat_password_otps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own OTPs (mark as used)
CREATE POLICY "Users can update own OTPs"
  ON public.chat_password_otps FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on user_encryption_keys
CREATE TRIGGER update_user_encryption_keys_updated_at
  BEFORE UPDATE ON public.user_encryption_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

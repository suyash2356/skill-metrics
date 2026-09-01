import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type OAuthResult = {
  data: Record<string, unknown> | null;
  error: { message: string } | null;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as typeof supabase.auth & { oauth: OAuthApi }).oauth;
}

function redirectFrom(data: Record<string, unknown> | null): string | null {
  const value = data?.redirect_url ?? data?.redirect_to;
  return typeof value === "string" ? value : null;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!authorizationId) {
        setError("This authorization request is missing its identifier.");
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        const next = window.location.pathname + window.location.search;
        window.location.assign(`/login?redirect=${encodeURIComponent(next)}`);
        return;
      }
      const result = await oauthApi().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (result.error) {
        setError(result.error.message);
        return;
      }
      const immediate = redirectFrom(result.data);
      const client = result.data?.client;
      if (immediate && !client) {
        window.location.assign(immediate);
        return;
      }
      setDetails(result.data);
    })();
    return () => { active = false; };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const result = approve
      ? await oauthApi().approveAuthorization(authorizationId)
      : await oauthApi().denyAuthorization(authorizationId);
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }
    const target = redirectFrom(result.data);
    if (!target) {
      setError("The authorization server did not return a redirect.");
      setBusy(false);
      return;
    }
    window.location.assign(target);
  };

  const client = details?.client as { name?: string } | undefined;
  const clientName = client?.name ?? "an external app";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect {clientName}</CardTitle>
          <CardDescription>
            This allows {clientName} to use Skill-Metrics catalog tools as your signed-in account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Could not complete this request: {error}</p>
          ) : !details ? (
            <p className="text-sm text-muted-foreground">Loading authorization request…</p>
          ) : (
            <div className="flex justify-end gap-3">
              <Button variant="outline" disabled={busy} onClick={() => void decide(false)}>Deny</Button>
              <Button disabled={busy} onClick={() => void decide(true)}>Approve</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
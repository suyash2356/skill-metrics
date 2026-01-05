import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin, useRegisterFirstAdmin } from '@/hooks/useAdmin';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsAdmin();
  const registerFirstAdmin = useRegisterFirstAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFirstAdminSetup, setShowFirstAdminSetup] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin === true) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || 'Failed to sign in');
        setIsLoading(false);
        return;
      }

      // Auth state change will trigger admin check
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAsFirstAdmin = async () => {
    if (!user) return;
    
    registerFirstAdmin.mutate(
      { userId: user.id, email: user.email || '' },
      {
        onSuccess: (success) => {
          if (success) {
            navigate('/admin/dashboard');
          }
        },
      }
    );
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in but not admin, show option to become first admin
  if (user && isAdmin === false && !adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Not an Admin</CardTitle>
            <CardDescription>
              You're logged in as <span className="font-medium">{user.email}</span>, but you don't have admin access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showFirstAdminSetup ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  If no admin exists yet, you can register as the first admin.
                </p>
                <Button 
                  onClick={handleRegisterAsFirstAdmin} 
                  className="w-full"
                  disabled={registerFirstAdmin.isPending}
                >
                  {registerFirstAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register as First Admin
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowFirstAdminSetup(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowFirstAdminSetup(true)}
                >
                  I'm setting up the first admin
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in with your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || adminCheckLoading}
            >
              {(isLoading || adminCheckLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

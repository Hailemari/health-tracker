
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.fullName || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      toast({
        title: "Account Created!",
        description: "Welcome to HealthTracker! You can now start tracking your wellness journey.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">HealthTracker</span>
          </div>
          <p className="text-gray-600">Your wellness journey starts here</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to continue your wellness journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setActiveTab('signup')}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>
                  Join thousands on their wellness journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={signupForm.fullName}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

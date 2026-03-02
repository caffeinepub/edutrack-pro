import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle2, UserPlus, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

type View = 'login' | 'register';

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { login, registerTeacher } = useAuth();

  // Shared
  const [view, setView] = useState<View>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Register form state
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regClassSection, setRegClassSection] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSuccessMessage('');
    setIsLoggingIn(true);
    await new Promise((r) => setTimeout(r, 400));
    const success = login(username, password);
    setIsLoggingIn(false);
    if (success) {
      onLogin();
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regDisplayName.trim()) {
      setRegError('Please enter your display name.');
      return;
    }
    if (!regUsername.trim()) {
      setRegError('Please enter a username.');
      return;
    }
    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters.');
      return;
    }

    setIsRegistering(true);
    await new Promise((r) => setTimeout(r, 400));

    const result = registerTeacher({
      displayName: regDisplayName,
      username: regUsername,
      password: regPassword,
      classSection: regClassSection,
    });

    setIsRegistering(false);

    if (result.success) {
      // Reset register form
      setRegDisplayName('');
      setRegUsername('');
      setRegPassword('');
      setRegClassSection('');
      setRegError('');
      // Switch to login with success message
      setSuccessMessage('Account created! You can now sign in with your new credentials.');
      setView('login');
    } else {
      setRegError(result.error);
    }
  };

  const switchToRegister = () => {
    setLoginError('');
    setSuccessMessage('');
    setRegError('');
    setView('register');
  };

  const switchToLogin = () => {
    setRegError('');
    setView('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-edu-accent mb-4 shadow-lg">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EduTrack Pro</h1>
          <p className="text-navy-300 mt-1 text-sm">Smart Teacher Management System</p>
        </div>

        {view === 'login' ? (
          <Card className="border-0 shadow-2xl bg-white dark:bg-navy-800 animate-slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-navy-900 dark:text-white">Sign In</CardTitle>
              <CardDescription className="text-navy-500 dark:text-navy-300">
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-navy-700 dark:text-navy-200 font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-navy-200 dark:border-navy-600 focus:border-edu-accent focus:ring-edu-accent"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-navy-700 dark:text-navy-200 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-navy-200 dark:border-navy-600 focus:border-edu-accent pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {successMessage && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg px-3 py-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {successMessage}
                  </div>
                )}

                {loginError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg px-3 py-2 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {loginError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-edu-accent hover:bg-edu-accent-dark text-white font-semibold h-11"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-5 p-4 bg-navy-50 dark:bg-navy-700/50 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-navy-500 dark:text-navy-300 uppercase tracking-wide">
                  Demo Credentials
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setUsername('teacher'); setPassword('class1'); setLoginError(''); setSuccessMessage(''); }}
                    className="text-left p-2.5 bg-white dark:bg-navy-600 rounded-lg border border-navy-200 dark:border-navy-500 hover:border-edu-accent transition-colors"
                  >
                    <p className="text-xs font-semibold text-edu-accent">Teacher</p>
                    <p className="text-xs text-navy-500 dark:text-navy-300">teacher / class1</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUsername('principal'); setPassword('admin'); setLoginError(''); setSuccessMessage(''); }}
                    className="text-left p-2.5 bg-white dark:bg-navy-600 rounded-lg border border-navy-200 dark:border-navy-500 hover:border-edu-accent transition-colors"
                  >
                    <p className="text-xs font-semibold text-purple-600">Principal</p>
                    <p className="text-xs text-navy-500 dark:text-navy-300">principal / admin</p>
                  </button>
                </div>
              </div>

              {/* Register link */}
              <div className="mt-4 text-center">
                <p className="text-sm text-navy-500 dark:text-navy-400">
                  New teacher?{' '}
                  <button
                    type="button"
                    onClick={switchToRegister}
                    className="text-edu-accent hover:text-edu-accent-dark font-semibold underline underline-offset-2 transition-colors"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-2xl bg-white dark:bg-navy-800 animate-slide-up">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-navy-400 hover:text-navy-700 dark:hover:text-navy-200 transition-colors"
                  aria-label="Back to login"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <CardTitle className="text-xl text-navy-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-edu-accent" />
                    Register as Teacher
                  </CardTitle>
                  <CardDescription className="text-navy-500 dark:text-navy-300 mt-0.5">
                    Create your teacher account to get started
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-displayname" className="text-navy-700 dark:text-navy-200 font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="reg-displayname"
                    type="text"
                    placeholder="e.g. Mr. John Smith"
                    value={regDisplayName}
                    onChange={(e) => setRegDisplayName(e.target.value)}
                    className="border-navy-200 dark:border-navy-600 focus:border-edu-accent"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-username" className="text-navy-700 dark:text-navy-200 font-medium">
                    Username
                  </Label>
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="Choose a username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="border-navy-200 dark:border-navy-600 focus:border-edu-accent"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password" className="text-navy-700 dark:text-navy-200 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Create a password (min. 4 chars)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="border-navy-200 dark:border-navy-600 focus:border-edu-accent pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-classsection" className="text-navy-700 dark:text-navy-200 font-medium">
                    Class / Section <span className="text-navy-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="reg-classsection"
                    type="text"
                    placeholder="e.g. Class 10-B"
                    value={regClassSection}
                    onChange={(e) => setRegClassSection(e.target.value)}
                    className="border-navy-200 dark:border-navy-600 focus:border-edu-accent"
                  />
                </div>

                {regError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg px-3 py-2 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {regError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-edu-accent hover:bg-edu-accent-dark text-white font-semibold h-11"
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-navy-500 dark:text-navy-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-edu-accent hover:text-edu-accent-dark font-semibold underline underline-offset-2 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

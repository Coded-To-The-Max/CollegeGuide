import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { RegisterData, LoginCredentials, RecoveryData, Country } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  onRegister: (data: RegisterData) => Promise<{ success: boolean; recoveryCode?: string; error?: string }>;
  onRecover: (data: RecoveryData) => Promise<boolean>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister, onRecover }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'recover' | 'recovery-success'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryCodeCopied, setRecoveryCodeCopied] = useState(false);

  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    displayName: '',
    country: 'US',
    residence: 'US'
  });

  const [recoveryData, setRecoveryData] = useState<RecoveryData>({
    email: '',
    recoveryCode: '',
    newPassword: ''
  });

  const countries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  ];

  const resetForm = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({ email: '', password: '', displayName: '', country: 'US', residence: 'US' });
    setRecoveryData({ email: '', recoveryCode: '', newPassword: '' });
    setError('');
    setShowPassword(false);
    setRecoveryCode('');
    setRecoveryCodeCopied(false);
  };

  const handleClose = () => {
    resetForm();
    setMode('login');
    onClose();
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(loginData);
      if (success) handleClose();
      else setError('Invalid email or password');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePassword(registerData.password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      setLoading(false);
      return;
    }

    try {
      const result = await onRegister(registerData);
      if (result.success && result.recoveryCode) {
        setRecoveryCode(result.recoveryCode);
        setMode('recovery-success');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePassword(recoveryData.newPassword)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      setLoading(false);
      return;
    }

    try {
      const success = await onRecover(recoveryData);
      if (success) {
        setError('');
        setMode('login');
        resetForm();
      } else setError('Invalid email or recovery code');
    } catch {
      setError('Recovery failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyRecoveryCode = () => {
    navigator.clipboard.writeText(recoveryCode);
    setRecoveryCodeCopied(true);
    setTimeout(() => setRecoveryCodeCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'recover' && 'Recover Password'}
            {mode === 'recovery-success' && 'Account Created!'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 btn-ripple"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>}

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium btn-ripple">
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center space-y-2">
                <button type="button" onClick={() => setMode('recover')} className="text-sm text-blue-600 hover:underline">Forgot your password?</button>
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setMode('register')} className="text-blue-600 hover:underline font-medium">Create one</button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={registerData.displayName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="How should we address you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8+ characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Destination</label>
                  <select
                    value={registerData.country}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                  <select
                    value={registerData.residence}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, residence: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>}

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium btn-ripple">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setMode('login')} className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* RECOVERY FORM */}
          {mode === 'recover' && (
            <form onSubmit={handleRecover} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={recoveryData.email}
                  onChange={(e) => setRecoveryData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recovery Code</label>
                <input
                  type="text"
                  required
                  value={recoveryData.recoveryCode}
                  onChange={(e) => setRecoveryData(prev => ({ ...prev, recoveryCode: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter your recovery code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={recoveryData.newPassword}
                    onChange={(e) => setRecoveryData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Create a new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be 8+ characters with uppercase, lowercase, and numbers</p>
              </div>

              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>}

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium btn-ripple">
                {loading ? 'Recovering...' : 'Reset Password'}
              </button>

              <div className="text-center">
                <button type="button" onClick={() => setMode('login')} className="text-sm text-blue-600 hover:underline">
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* RECOVERY SUCCESS */}
          {mode === 'recovery-success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Created Successfully!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please save your recovery code securely. You'll need it to recover your account if you forget your password.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-800">Recovery Code:</span>
                  <button
                    onClick={copyRecoveryCode}
                    className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800 text-sm"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{recoveryCodeCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-white p-3 rounded border font-mono text-sm text-center">
                  {recoveryCode}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-700">
                  ⚠️ This code will only be shown once. Save it in a secure location.
                </p>
              </div>

              <button
                onClick={() => {
                  setMode('login');
                  resetForm();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium btn-ripple"
              >
                Continue to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

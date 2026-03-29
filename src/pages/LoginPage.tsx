import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-teal-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err: any) {
      const msg =
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try later.'
          : 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '16px',
            padding: '14px 24px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
          },
          success: {
            style: { background: '#e6f7f5', color: '#1f4d4d', border: '1px solid #b3ece5' },
            iconTheme: { primary: '#2dc8b2', secondary: '#fff' },
          },
          error: {
            style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
          },
        }}
      />

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative gradient-dark items-center justify-center p-12">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-teal-400/10 animate-float" />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-mint-400/10 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-10 w-20 h-20 rounded-2xl bg-green-400/10 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-10 left-1/3 w-16 h-16 rounded-xl bg-teal-300/10 animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-20 right-1/3 w-12 h-12 rounded-full bg-mint-400/8 animate-float" style={{ animationDelay: '1.5s' }} />
          
          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} 
            />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Icon */}
          <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-mint-400 to-green-400 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-teal-900/30 animate-float">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Little Millennium
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-mint-400 to-green-400 mx-auto rounded-full mb-6" />
          <p className="text-teal-200 text-lg font-medium leading-relaxed mb-10">
            A modern kindergarten management system to streamline student records, fee tracking, and administration.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Student Records', 'Fee Tracking', 'PDF Reports', 'Analytics'].map((feature, i) => (
              <span
                key={feature}
                className={'px-4 py-2 rounded-full bg-white/10 text-teal-100 text-xs font-bold border border-white/10 backdrop-blur-sm animate-fade-in-up opacity-0'}
                style={{ animationDelay: `${(i + 1) * 150}ms`, animationFillMode: 'forwards' }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-gradient-to-br from-[#f0f9f7] via-white to-[#e8f5f0] relative">
        {/* Mobile background decorations */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-teal-200/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-mint-400/15 blur-3xl" />
        </div>

        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-20 h-20 rounded-2xl gradient-teal flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-500/20 animate-float">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-teal-800">Little Millennium</h1>
            <p className="text-teal-500 font-medium text-sm mt-1">Kindergarten Management</p>
          </div>

          {/* Login Card */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 animate-fade-in-up">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-mint-400" />
                <span className="text-xs font-bold text-mint-400 uppercase tracking-wider">Admin Portal</span>
              </div>
              <h2 className="text-3xl font-extrabold text-teal-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-teal-500 font-medium">
                Sign in to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-teal-700 mb-2.5">
                  Email Address
                </label>
                <div className={`relative rounded-2xl transition-all duration-300 ${
                  focused === 'email' 
                    ? 'ring-4 ring-teal-500/15 shadow-lg shadow-teal-500/10' 
                    : 'shadow-sm'
                }`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Mail className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      focused === 'email' ? 'text-teal-500' : 'text-teal-300'
                    }`} />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className={'w-full pl-[68px] pr-5 py-4 rounded-2xl border-2 border-teal-100 bg-white text-teal-800 placeholder-teal-300 font-semibold text-[15px] transition-all duration-200 hover:border-teal-200 focus:border-teal-400 focus:ring-0 focus:shadow-none focus:outline-none'}
                    placeholder="admin@littlemillennium.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold text-teal-700 mb-2.5">
                  Password
                </label>
                <div className={`relative rounded-2xl transition-all duration-300 ${
                  focused === 'password' 
                    ? 'ring-4 ring-teal-500/15 shadow-lg shadow-teal-500/10' 
                    : 'shadow-sm'
                }`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Lock className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      focused === 'password' ? 'text-teal-500' : 'text-teal-300'
                    }`} />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className={'w-full pl-[68px] pr-14 py-4 rounded-2xl border-2 border-teal-100 bg-white text-teal-800 placeholder-teal-300 font-semibold text-[15px] transition-all duration-200 hover:border-teal-200 focus:border-teal-400 focus:ring-0 focus:shadow-none focus:outline-none'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={'absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-teal-50 transition-colors'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px] text-teal-400" />
                    ) : (
                      <Eye className="w-[18px] h-[18px] text-teal-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit"
                type="submit"
                disabled={submitting}
                className={'w-full py-4 rounded-2xl gradient-teal text-white font-bold text-[15px] shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2.5 mt-3'}
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-teal-100">
              <div className="flex items-center justify-center gap-3 text-xs text-teal-400">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <span className="font-semibold">Secured with Firebase Authentication</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-teal-400 mt-6 font-semibold">
            © {new Date().getFullYear()} Little Millennium • Kindergarten Management System
          </p>
        </div>
      </div>
    </div>
  );
}

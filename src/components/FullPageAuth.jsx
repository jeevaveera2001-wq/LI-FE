import React, { useState, useEffect } from 'react';
import { Lock, Mail, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, User, Phone, ArrowLeft, RefreshCw, Send, Sparkles, Trophy } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { authenticateUser, sendEmailOtp, verifyEmailOtp, registerUser } from '../utils/auth';
import confetti from 'canvas-confetti';

export const FullPageAuth = ({
  onLoginSuccess,
  onBackToPortal,
  initialTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'login'); // 'login' | 'register'

  // Login Form States
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Email OTP States
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    soundFx.playClick();

    try {
      const result = await authenticateUser(loginInput, loginPassword);
      setIsLoading(false);

      if (result.success) {
        soundFx.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0F172A', '#2563EB', '#10B981', '#F59E0B']
        });

        if (result.type === 'team') {
          onLoginSuccess(result.team, 'team-token', 'team');
        } else {
          onLoginSuccess(result.user, result.token, result.user?.role === 'SUPER_ADMIN' ? 'superadmin' : 'user');
        }
      } else {
        soundFx.playClick();
        setErrorMessage(result.message || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      soundFx.playClick();
      setErrorMessage('Authentication error. Please try again.');
    }
  };

  // Step 1: Submit Registration -> Trigger Email OTP
  const handleRegisterInitiate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      soundFx.playClick();
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      soundFx.playClick();
      return;
    }

    setIsLoading(true);
    soundFx.playClick();

    try {
      const otpRes = await sendEmailOtp(regEmail);
      setIsLoading(false);

      if (otpRes.success) {
        setSimulatedOtp(otpRes.otp);
        setOtpStep(true);
        setResendCooldown(30);
        soundFx.playModalOpen();
      } else {
        setErrorMessage('Failed to send verification email. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Error sending email OTP. Please check your network.');
    }
  };

  // Step 2: Confirm Email OTP -> Complete Registration
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    soundFx.playClick();

    const verifyRes = verifyEmailOtp(regEmail, otpCode);

    if (!verifyRes.success) {
      setIsLoading(false);
      soundFx.playClick();
      setErrorMessage(verifyRes.message || 'Invalid OTP code. Please try again.');
      return;
    }

    // Save registered user
    const regRes = await registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });

    setIsLoading(false);

    if (regRes.success) {
      soundFx.playVictory();
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0F172A', '#10B981', '#3B82F6']
      });

      setSuccessMessage('Email verified successfully! You are now logging in...');
      setOtpStep(false);
      
      // Auto login after verification
      setTimeout(async () => {
        const autoLogin = await authenticateUser(regEmail, regPassword);
        if (autoLogin.success) {
          onLoginSuccess(autoLogin.user, autoLogin.token, 'user');
        } else {
          setActiveTab('login');
          setLoginInput(regEmail);
          setLoginPassword(regPassword);
        }
      }, 900);
    } else {
      setErrorMessage(regRes.message || 'Failed to save account.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    soundFx.playClick();
    const res = await sendEmailOtp(regEmail);
    if (res.success) {
      setSimulatedOtp(res.otp);
      setResendCooldown(30);
      setSuccessMessage('A fresh verification code has been dispatched.');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col selection:bg-slate-200">
      
      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#CBD5E1] p-0.5 bg-[#F1F5F9] shadow-xs flex items-center justify-center">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="font-montserrat font-black text-sm sm:text-base text-[#0F172A] tracking-wide uppercase leading-tight">
              LIVE TOURNAMENTS<span className="text-amber-500">.IN</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Esports Arena & Official Match Ops
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onBackToPortal?.();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] transition-all text-xs font-bold cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#475569]" />
          <span>Back to Arena</span>
        </button>
      </header>

      {/* Main Full Display Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
          
          {/* Top Title & Subtitle */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white mx-auto flex items-center justify-center shadow-md mb-3">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="font-montserrat font-extrabold text-2xl text-[#0F172A] tracking-tight">
              {activeTab === 'login' ? 'Competitor Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              {activeTab === 'login'
                ? 'Sign in to access overall tournaments, schedules & scrims'
                : 'Register your competitor profile to enter official tournaments'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#F1F5F9] p-1 rounded-2xl mb-6 border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('login');
                setOtpStep(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('register');
                setOtpStep(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5 uppercase tracking-wider">
                  Username / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Username / Email"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                  <User className="absolute right-3.5 top-3.5 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {showLoginPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show password</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all tracking-wide"
                  />
                  <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In to Arena</span>
                )}
              </button>

              <div className="text-center pt-3 border-t border-[#E2E8F0]">
                <p className="text-xs text-[#64748B]">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('register');
                      setErrorMessage('');
                    }}
                    className="font-bold text-[#0F172A] hover:underline cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTRATION FORM */}
          {activeTab === 'register' && !otpStep && (
            <form onSubmit={handleRegisterInitiate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                  Full Name / IGL Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                  />
                  <User className="absolute right-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                  />
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                  />
                  <Phone className="absolute right-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showRegPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                  />
                  <Lock className="absolute right-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showRegConfirmPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                  />
                  <Lock className="absolute right-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-[#64748B]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('login');
                      setErrorMessage('');
                    }}
                    className="font-bold text-[#0F172A] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2 - STEP 2: EMAIL OTP CONFIRMATION */}
          {activeTab === 'register' && otpStep && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>Verify Email OTP</span>
                </div>
                <p className="text-[#475569] leading-relaxed">
                  We've dispatched a 6-digit confirmation code to{' '}
                  <strong className="text-[#0F172A]">{regEmail}</strong>.
                </p>
                {simulatedOtp && (
                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-amber-300 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">Email Verification Code</span>
                      <span className="font-mono font-black text-base text-[#0F172A] tracking-wider">{simulatedOtp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setOtpCode(simulatedOtp);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0F172A] text-white text-[11px] font-bold hover:bg-black transition-all cursor-pointer"
                    >
                      Auto-Fill Code
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5 uppercase tracking-wider text-center">
                  Enter 6-Digit Email OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center font-mono font-black text-2xl tracking-[0.35em] bg-[#F8FAFC] border-2 border-[#CBD5E1] rounded-xl px-4 py-3 text-[#0F172A] focus:outline-none focus:border-[#0F172A] transition-all"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setOtpStep(false);
                    setErrorMessage('');
                  }}
                  className="text-[#64748B] hover:text-[#0F172A] font-semibold cursor-pointer"
                >
                  ← Edit registration details
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendOtp}
                  className="text-[#0F172A] font-bold disabled:text-[#94A3B8] disabled:cursor-not-allowed cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full py-3.5 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Create Account</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#94A3B8] border-t border-[#E2E8F0] bg-white">
        © {new Date().getFullYear()} Live tournaments.in. Official Competitive BGMI Portal.
      </footer>

    </div>
  );
};

export default FullPageAuth;

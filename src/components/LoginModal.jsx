import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, Key, User, Phone, ArrowLeft, RefreshCw, Send, Check } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { authenticateUser, validateLoginCredentials, completeVerifiedLogin, sendEmailOtp, verifyEmailOtp, registerUser } from '../utils/auth';
import confetti from 'canvas-confetti';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'login'); // 'login' | 'register'
  
  // Login Form States
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login Email OTP States
  const [loginOtpStep, setLoginOtpStep] = useState(false);
  const [loginOtpCode, setLoginOtpCode] = useState('');
  const [simulatedLoginOtp, setSimulatedLoginOtp] = useState('');
  const [pendingLoginUser, setPendingLoginUser] = useState(null);
  const [loginResendCooldown, setLoginResendCooldown] = useState(0);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Registration Email OTP States
  const [otpStep, setOtpStep] = useState(false); // true when awaiting OTP verification
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Resend OTP countdown timers
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    let timer;
    if (loginResendCooldown > 0) {
      timer = setTimeout(() => setLoginResendCooldown(loginResendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [loginResendCooldown]);

  if (!isOpen) return null;

  // Handle Login submission: Validate credentials -> Send Email OTP
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    soundFx.playClick();

    try {
      const valResult = await validateLoginCredentials(loginInput, loginPassword);
      if (!valResult.success) {
        setIsLoading(false);
        soundFx.playClick();
        setErrorMessage(valResult.message || 'Invalid username or password. Please try again.');
        return;
      }

      // Send OTP to account email
      const targetEmail = valResult.email;
      const otpRes = await sendEmailOtp(targetEmail);
      setIsLoading(false);

      if (otpRes.success) {
        soundFx.playModalOpen();
        setPendingLoginUser(valResult);
        setSimulatedLoginOtp(otpRes.otp);
        setLoginOtpStep(true);
        setLoginResendCooldown(30);
        setSuccessMessage(`Security check: 6-digit login OTP sent to ${targetEmail}`);
      } else {
        setErrorMessage('Failed to send login verification code. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      soundFx.playClick();
      setErrorMessage('Authentication error. Please try again.');
    }
  };

  // Handle Login OTP submission: Verify OTP -> Complete Login
  const handleLoginOtpSubmit = async (e) => {
    e.preventDefault();
    if (!pendingLoginUser) return;
    setIsLoading(true);
    setErrorMessage('');
    soundFx.playClick();

    try {
      const result = await completeVerifiedLogin(
        pendingLoginUser.email,
        loginOtpCode,
        pendingLoginUser.user || pendingLoginUser.team,
        pendingLoginUser.type
      );
      setIsLoading(false);

      if (result.success) {
        soundFx.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2DD4BF', '#14B8A6', '#0D9488', '#0F172A']
        });

        if (result.type === 'team') {
          onLoginSuccess(result.team, 'team-token', 'team');
        } else {
          onLoginSuccess(result.user, result.token, result.type);
        }
        onClose();
      } else {
        soundFx.playClick();
        setErrorMessage(result.message || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      soundFx.playClick();
      setErrorMessage('Verification error. Please try again.');
    }
  };

  const handleResendLoginOtp = async () => {
    if (loginResendCooldown > 0 || !pendingLoginUser) return;
    soundFx.playClick();
    const res = await sendEmailOtp(pendingLoginUser.email);
    if (res.success) {
      setSimulatedLoginOtp(res.otp);
      setLoginResendCooldown(30);
      setSuccessMessage('A fresh verification code has been dispatched.');
      setTimeout(() => setSuccessMessage(''), 4000);
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
        colors: ['#FFDE00', '#2DD4BF', '#10B981', '#E5C05B']
      });

      setSuccessMessage('Email verified successfully! You can now log in with your credentials.');
      setOtpStep(false);
      setActiveTab('login');
      setLoginInput(regEmail);
      setLoginPassword(regPassword);
      setOtpCode('');
      setSimulatedOtp('');
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

  const handleCloseModal = () => {
    soundFx.playClick();
    setErrorMessage('');
    setSuccessMessage('');
    setOtpStep(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-md bg-[#EEF2F6] border border-[#DCE2E9] rounded-[28px] p-6 sm:p-7 shadow-[0_25px_60px_rgba(15,23,42,0.2)] text-[#1E293B] max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-[#CBD5E1] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Crest */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-teal-500/40 p-0.5 bg-white mx-auto mb-2 shadow-[0_4px_16px_rgba(20,184,166,0.25)] flex items-center justify-center">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Live tournaments Crest"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-tight">
            LIVE TOURNAMENTS<span className="text-teal-600">.IN</span>
          </h3>
          <p className="text-[11px] text-[#64748B]">
            Official Player & Tournament Management Gateway
          </p>
        </div>

        {/* Tab Switcher: LOGIN and REGISTER ONLY */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-white border border-[#CBD5E1] mb-4 shadow-inner">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('login');
              setOtpStep(false);
              setLoginOtpStep(false);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>LOGIN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('register');
              setOtpStep(false);
              setLoginOtpStep(false);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#E5C05B]" />
            <span>REGISTER</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: LOGIN TAB (Credentials Input)                    */}
        {/* ========================================================= */}
        {activeTab === 'login' && !loginOtpStep && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="username / email"
                  autoComplete="off"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="*******"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none transition-colors shadow-sm tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                  title={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                {isLoading ? (
                  <span>VALIDATING...</span>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>VERIFY EMAIL & LOGIN</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-[#64748B]">Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
              >
                Register here
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* VIEW 1B: LOGIN EMAIL OTP CONFIRMATION                    */}
        {/* ========================================================= */}
        {activeTab === 'login' && loginOtpStep && (
          <form onSubmit={handleLoginOtpSubmit} className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <div className="font-bold text-xs mb-1 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Email Verification Required</span>
              </div>
              <p className="text-[#475569] text-[11px] leading-relaxed">
                We sent a 6-digit confirmation code to{' '}
                <strong className="text-[#0F172A]">{pendingLoginUser?.email}</strong>.
              </p>
              {simulatedLoginOtp && (
                <div className="mt-2.5 p-2 rounded-xl bg-white border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#64748B] block">Login Code</span>
                    <span className="font-mono font-black text-sm text-[#0F172A] tracking-wider">{simulatedLoginOtp}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setLoginOtpCode(simulatedLoginOtp);
                    }}
                    className="px-2.5 py-1 rounded bg-[#0F172A] text-white text-[10px] font-bold hover:bg-black transition-all cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1 text-center">
                Enter 6-Digit Login Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="000000"
                value={loginOtpCode}
                onChange={(e) => setLoginOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center font-mono font-black text-xl tracking-[0.3em] py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setLoginOtpStep(false);
                  setLoginOtpCode('');
                  setErrorMessage('');
                }}
                className="text-[#64748B] hover:text-[#0F172A] font-semibold cursor-pointer"
              >
                ← Edit credentials
              </button>

              <button
                type="button"
                disabled={loginResendCooldown > 0}
                onClick={handleResendLoginOtp}
                className="text-[#0F172A] font-bold disabled:text-[#94A3B8] disabled:cursor-not-allowed cursor-pointer"
              >
                {loginResendCooldown > 0 ? `Resend (${loginResendCooldown}s)` : 'Resend code'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || loginOtpCode.length !== 6}
              className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>VERIFYING...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>CONFIRM OTP & LOGIN</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: REGISTER TAB                                     */}
        {/* ========================================================= */}
        {activeTab === 'register' && (
          <div>
            {!otpStep ? (
              /* Step 2A: Registration Input Form */
              <form onSubmit={handleRegisterInitiate} className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Enter mobile number"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Password with Show/Hide toggle */}
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="*******"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                      title={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with Show/Hide toggle */}
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="*******"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                      title={showRegConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    {isLoading ? (
                      <span>SENDING EMAIL OTP...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-teal-400" />
                        <span>REGISTER & VERIFY EMAIL</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2B: Email OTP Verification Step */
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-600">
                    <Mail className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#0F172A] uppercase">
                    Verify Your Email
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    We sent a 6-digit confirmation code to:
                  </p>
                  <strong className="text-xs text-[#0F172A] font-mono block">
                    {regEmail}
                  </strong>
                </div>

                {/* Instant On-Screen OTP Notification Box for frictionless UX */}
                {simulatedOtp && (
                  <div className="p-3 rounded-2xl bg-teal-50 border border-teal-300 text-teal-900 text-xs flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-teal-600 block font-mono uppercase font-bold">Email Dispatch OTP:</span>
                      <strong className="text-sm font-mono tracking-widest text-teal-900">{simulatedOtp}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setOtpCode(simulatedOtp);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-[11px] font-bold uppercase hover:bg-teal-700 transition-all cursor-pointer"
                    >
                      Fill OTP
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Enter 6-Digit Email OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-lg font-mono font-bold tracking-[0.4em] text-[#0F172A] focus:outline-none shadow-sm"
                    autoFocus
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>CONFIRMING OTP...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>CONFIRM EMAIL & COMPLETE REGISTRATION</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleResendOtp}
                      className={`flex items-center gap-1 cursor-pointer ${
                        resendCooldown > 0 ? 'text-[#94A3B8] cursor-not-allowed' : 'text-teal-700 font-bold hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'text-teal-700'}`} />
                      <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginModal;

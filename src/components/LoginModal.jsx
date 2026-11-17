import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, Key, User, Phone, ArrowLeft, RefreshCw, Send, Check, KeyRound } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { authenticateUser, sendEmailOtp, verifyEmailOtp, registerUser, resetUserPassword, getStoredUsers } from '../utils/auth';
import confetti from 'canvas-confetti';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'login'); // 'login' | 'register' | 'forgot'
  
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

  // Registration Email OTP States (Google verification code format)
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotCooldown, setForgotCooldown] = useState(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Forgot password countdown timer
  useEffect(() => {
    let timer;
    if (forgotCooldown > 0) {
      timer = setTimeout(() => setForgotCooldown(forgotCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [forgotCooldown]);

  // Forgot Password - Step 1: Send Verification Code
  const handleForgotInitiate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.');
      soundFx.playClick();
      return;
    }

    const users = getStoredUsers();
    const userExists = users.some(u => u.email.toLowerCase() === cleanEmail) || 
      cleanEmail === 'admin@livetournaments.in' || 
      cleanEmail === 'lastzetas@gmail.com';

    if (!userExists) {
      setErrorMessage('No registered account found with this email. Please check your email or register.');
      soundFx.playClick();
      return;
    }

    setIsLoading(true);
    soundFx.playClick();

    try {
      const res = await sendEmailOtp(cleanEmail, 'reset');
      setIsLoading(false);

      if (res.success) {
        setForgotStep(2);
        setForgotCooldown(30);
        soundFx.playModalOpen();
        setSuccessMessage('A Google verification code has been dispatched to your email.');
      } else {
        setErrorMessage('Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Error sending verification code. Please check your network.');
    }
  };

  // Forgot Password - Step 2: Verify Code & Update Password
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      soundFx.playClick();
      return;
    }

    if (forgotNewPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      soundFx.playClick();
      return;
    }

    setIsLoading(true);
    soundFx.playClick();

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const result = await resetUserPassword({
      email: cleanEmail,
      newPassword: forgotNewPassword,
      otp: forgotOtpCode
    });

    setIsLoading(false);

    if (result.success) {
      soundFx.playVictory();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2DD4BF', '#14B8A6', '#0F172A']
      });

      setSuccessMessage('Password reset successfully! Logging you in...');
      setTimeout(async () => {
        const autoLogin = await authenticateUser(cleanEmail, forgotNewPassword);
        if (autoLogin.success) {
          if (autoLogin.type === 'team') {
            onLoginSuccess(autoLogin.team, 'team-token', 'team');
          } else {
            onLoginSuccess(autoLogin.user, autoLogin.token, autoLogin.user?.role === 'SUPER_ADMIN' ? 'superadmin' : (autoLogin.user?.role === 'ADMIN' ? 'admin' : 'user'));
          }
          onClose();
        } else {
          setActiveTab('login');
          setLoginInput(cleanEmail);
          setLoginPassword(forgotNewPassword);
          setForgotStep(1);
        }
      }, 900);
    } else {
      soundFx.playClick();
      setErrorMessage(result.message || 'Verification failed. Please check the code.');
    }
  };

  // Resend Forgot Password OTP
  const handleResendForgotOtp = async () => {
    if (forgotCooldown > 0) return;
    soundFx.playClick();
    const cleanEmail = forgotEmail.trim().toLowerCase();
    const res = await sendEmailOtp(cleanEmail, 'reset');
    if (res.success) {
      setForgotCooldown(30);
      setSuccessMessage('A fresh verification code has been dispatched.');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  if (!isOpen) return null;

  // Handle Login submission: Direct credential authentication (NO email verification for login)
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
          colors: ['#2DD4BF', '#14B8A6', '#0D9488', '#0F172A']
        });

        if (result.type === 'team') {
          onLoginSuccess(result.team, 'team-token', 'team');
        } else {
          onLoginSuccess(result.user, result.token, result.user?.role === 'SUPER_ADMIN' ? 'superadmin' : (result.user?.role === 'ADMIN' ? 'admin' : 'user'));
        }
        onClose();
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

        {/* Tab Switcher: LOGIN, REGISTER, and FORGOT */}
        <div className={`grid ${activeTab === 'forgot' ? 'grid-cols-3' : 'grid-cols-2'} p-1 rounded-2xl bg-white border border-[#CBD5E1] mb-4 shadow-inner`}>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('login');
              setOtpStep(false);
              setForgotStep(1);
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
              setForgotStep(1);
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

          {activeTab === 'forgot' && (
            <button
              type="button"
              className="py-2 rounded-xl text-xs font-bold uppercase bg-[#0F172A] text-white shadow-sm flex items-center justify-center gap-1.5 cursor-default"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>RESET</span>
            </button>
          )}
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
        {/* VIEW 1: LOGIN TAB (Direct Credential Login - No OTP)     */}
        {/* ========================================================= */}
        {activeTab === 'login' && (
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
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('forgot');
                    setForgotStep(1);
                    setForgotEmail(loginInput.includes('@') ? loginInput : '');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3 text-teal-600" />
                  <span>Forgot Password?</span>
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
                  <span>LOGGING IN...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-teal-400" />
                    <span>LOGIN TO ARENA</span>
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
                      <span>SENDING CODE...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-teal-400" />
                        <span>REGISTER & SEND GOOGLE CODE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2B: Google Code Verification Step */
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-600">
                    <Shield className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#0F172A] uppercase">
                    Google Email Verification
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    We sent an official Google verification code to:
                  </p>
                  <strong className="text-xs text-[#0F172A] font-mono block">
                    {regEmail}
                  </strong>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1 text-center">
                    Enter Google Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="G-XXXXXX or 6 digits"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.toUpperCase())}
                    className="w-full text-center py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-lg font-mono font-bold tracking-[0.25em] text-[#0F172A] focus:outline-none shadow-sm"
                    autoFocus
                  />
                  <p className="text-[10px] text-[#94A3B8] text-center mt-1">
                    Format: <strong>G-XXXXXX</strong> or 6-digit number
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.trim().length < 6}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>CONFIRMING CODE...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>CONFIRM GOOGLE CODE & CREATE ACCOUNT</span>
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

        {/* ========================================================= */}
        {/* VIEW 3: FORGOT PASSWORD TAB                              */}
        {/* ========================================================= */}
        {activeTab === 'forgot' && (
          <div>
            {forgotStep === 1 ? (
              /* Step 3A: Enter Email for Reset */
              <form onSubmit={handleForgotInitiate} className="space-y-3.5">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Password Recovery</span>
                  </div>
                  <p className="text-[#475569] text-[11px] leading-relaxed">
                    Enter your registered email address. We'll send an official Google verification code to verify your identity.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !forgotEmail.trim()}
                    className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>SENDING CODE...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>SEND GOOGLE VERIFICATION CODE</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Login</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 3B: Verify Code & Set New Password */
              <form onSubmit={handleForgotResetSubmit} className="space-y-3">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-600">
                    <Shield className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A] uppercase">
                    Verify Reset Code
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Google verification code dispatched to:
                  </p>
                  <strong className="text-[11px] text-[#0F172A] font-mono block">
                    {forgotEmail}
                  </strong>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1 text-center">
                    Enter Google Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="G-XXXXXX or 6 digits"
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value.toUpperCase())}
                    className="w-full text-center py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-lg font-mono font-bold tracking-[0.25em] text-[#0F172A] focus:outline-none shadow-sm"
                    autoFocus
                  />
                  <p className="text-[10px] text-[#94A3B8] text-center mt-0.5">
                    Format: <strong>G-XXXXXX</strong> or 6-digit number
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showForgotConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none shadow-sm tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                    >
                      {showForgotConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || forgotOtpCode.trim().length < 6}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>UPDATING PASSWORD...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>CONFIRM & RESET PASSWORD</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Email</span>
                    </button>

                    <button
                      type="button"
                      disabled={forgotCooldown > 0}
                      onClick={handleResendForgotOtp}
                      className={`flex items-center gap-1 cursor-pointer ${
                        forgotCooldown > 0 ? 'text-[#94A3B8] cursor-not-allowed' : 'text-teal-700 font-bold hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${forgotCooldown > 0 ? '' : 'text-teal-700'}`} />
                      <span>{forgotCooldown > 0 ? `Resend in ${forgotCooldown}s` : 'Resend Code'}</span>
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

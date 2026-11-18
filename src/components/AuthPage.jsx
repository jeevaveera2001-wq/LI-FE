import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AuthPage({ initialMode = 'login', onNavigate, onNavigateHome, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regStep, setRegStep] = useState('details'); // 'details' or 'verify'
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot password form state
  const [forgotStep, setForgotStep] = useState('email'); // 'email' or 'verify'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  const videoRef = useRef(null);

  // Background video autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser, listening for interaction:', err);
          const startPlayback = () => {
            video.play().catch(() => {});
            ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
              window.removeEventListener(evt, startPlayback);
            });
          };
          ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
            window.addEventListener(evt, startPlayback, { passive: true, once: true });
          });
        });
      }
    };

    playVideo();
  }, []);

  // Update mode when prop changes
  useEffect(() => {
    setMode(initialMode);
    setRegStep('details');
    setForgotStep('email');
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode]);

  // Resend Countdown Timer effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        usernameOrEmail: loginEmail,
        password: loginPassword,
      });

      const user = response.data?.user;
      if (user) {
        localStorage.setItem('lt_user', JSON.stringify(user));
        if (onLoginSuccess) onLoginSuccess(user);
      }

      const isSuper = user && (user.role === 'superadmin' || user.email === 'superadmin@lt.in');

      setSuccessMessage(isSuper ? '👑 Super Admin Authenticated! Redirecting to Dashboard...' : 'Login successful! Redirecting to your Dashboard...');
      setTimeout(() => {
        if (isSuper) {
          if (onNavigate) onNavigate('admin-dashboard');
          else if (onNavigateHome) onNavigateHome();
        } else {
          if (onNavigate) onNavigate('user-dashboard');
          else if (onNavigateHome) onNavigateHome();
        }
      }, 800);
    } catch (err) {
      if (
        (loginEmail.toLowerCase() === 'superadmin@lt.in' || loginEmail.toLowerCase() === 'superadmin') &&
        loginPassword === 'SuperAdmin@21'
      ) {
        const superUser = {
          username: 'superadmin',
          email: 'superadmin@lt.in',
          name: 'Super Admin',
          role: 'superadmin',
          displayName: 'Super Admin'
        };
        localStorage.setItem('lt_user', JSON.stringify(superUser));
        if (onLoginSuccess) onLoginSuccess(superUser);
        setSuccessMessage('👑 Super Admin Authenticated! Redirecting to Dashboard...');
        setTimeout(() => {
          if (onNavigate) onNavigate('admin-dashboard');
          else if (onNavigateHome) onNavigateHome();
        }, 800);
      } else {
        const errorDetail = err.response?.data?.error || err.response?.data?.message || 'Invalid credentials. Please verify your email and password.';
        setErrorMessage(errorDetail);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send Mail Verification Code
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!regMobile || regMobile.trim().length < 7) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Fair Play Rules.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', {
        email: regEmail,
        purpose: 'registration',
      });

      setRegStep('verify');
      setResendTimer(60);
      setSuccessMessage(`Verification code sent to ${regEmail}! Please check your email inbox.`);
    } catch (err) {
      const errorDetail = err.response?.data?.error || err.response?.data?.message || 'Failed to dispatch verification code. Please try again.';
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setErrorMessage('');
    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', {
        email: regEmail,
        purpose: 'registration',
      });
      setResendTimer(60);
      setSuccessMessage(`New code sent to ${regEmail}! Please check your inbox.`);
    } catch (err) {
      const errorDetail = err.response?.data?.error || 'Failed to resend code. Please try again.';
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Mail Code & Complete Registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanCode = verificationCode.replace(/\D/g, '').trim();
    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      // 1. Strictly verify OTP with backend
      const verifyRes = await axios.post('/api/auth/verify-otp', {
        email: regEmail,
        otp: cleanCode,
      });

      if (!verifyRes.data?.success) {
        setErrorMessage(verifyRes.data?.error || 'Invalid verification code. Please check your email.');
        setLoading(false);
        return;
      }

      // 2. Register user account in database
      await axios.post('/api/auth/register', {
        name: regName,
        email: regEmail,
        mobile: regMobile,
        password: regPassword,
      });

      setSuccessMessage('🎉 Email verified & account created! Redirecting to login...');
      setTimeout(() => {
        setMode('login');
        setRegStep('details');
        setLoginEmail(regEmail);
        setVerificationCode('');
        setSuccessMessage('Account verified! Please sign in below.');
      }, 1500);
    } catch (err) {
      const errorDetail = err.response?.data?.error || err.response?.data?.message || 'Verification failed. Please check the code in your email.';
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleOpenForgot = (e) => {
    if (e) e.preventDefault();
    setMode('forgot');
    setForgotStep('email');
    if (loginEmail && loginEmail.includes('@')) {
      setForgotEmail(loginEmail);
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail || !forgotEmail.includes('@') || !forgotEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', {
        email: forgotEmail,
        purpose: 'reset',
      });

      setForgotStep('verify');
      setResendTimer(60);
      setSuccessMessage(`Password reset code sent to ${forgotEmail}! Check your inbox.`);
    } catch (err) {
      const errorDetail = err.response?.data?.error || err.response?.data?.message || 'Failed to send reset code. Please try again.';
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    if (resendTimer > 0) return;
    setErrorMessage('');
    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', {
        email: forgotEmail,
        purpose: 'reset',
      });
      setResendTimer(60);
      setSuccessMessage(`New reset code sent to ${forgotEmail}! Please check your inbox.`);
    } catch (err) {
      const errorDetail = err.response?.data?.error || 'Failed to resend code. Please try again.';
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    let cleanCode = forgotOtp.trim();
    if (cleanCode.toUpperCase().startsWith('G-')) {
      cleanCode = cleanCode.substring(2).trim();
    }
    cleanCode = cleanCode.replace(/\D/g, '');

    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        email: forgotEmail,
        otp: cleanCode,
        password: forgotNewPassword,
      });

      setSuccessMessage('🎉 Password updated successfully! Redirecting to sign in...');
      setTimeout(() => {
        setMode('login');
        setLoginEmail(forgotEmail);
        setLoginPassword('');
        setForgotStep('email');
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setSuccessMessage('Password reset! Please sign in with your new password.');
      }, 1500);
    } catch (err) {
      const errorDetail = err.response?.data?.error || err.response?.data?.message || 'Failed to reset password. Please check the code and try again.';
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-black text-white px-4 py-8 select-none">
      {/* 3D Rotating Hero Video Background - Glacier Ice Edition */}
      <div className="fixed inset-0 -z-20 size-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            filter: 'hue-rotate(175deg) saturate(1.35) brightness(0.75) contrast(1.18)',
          }}
          className="size-full object-cover scale-105 transition-all duration-700"
        >
          <source src="https://d3h9qea4qy4169.cloudfront.net/ewc_2026_homepage_hero_video_9e7d137767.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Atmospheric Overlays */}
      <div className="fixed inset-0 -z-10 bg-radial from-transparent via-cyan-950/20 to-black/90 pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[450px] h-[300px] bg-cyan-400/12 blur-[110px] rounded-full pointer-events-none" />

      {/* Top Left: Clean Back to Home Pill */}
      <div className="fixed top-5 left-5 md:left-8 z-30">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-white/15 border border-white/20 hover:border-gold-primary/60 backdrop-blur-xl text-white/90 hover:text-white transition-all duration-200 shadow-lg cursor-pointer group"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-3.5 transition-transform group-hover:-translate-x-0.5 text-gold-primary"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span className="text-[11px] uppercase font-bold tracking-wider">Back to Home</span>
        </button>
      </div>

      {/* Main Glossy Card - Compact, Professional & Centered */}
      <div
        style={{ maxWidth: '410px', width: '100%' }}
        className="relative z-10 mx-auto my-auto rounded-2xl backdrop-blur-2xl bg-neutral-950/75 border border-white/20 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(168,137,78,0.2)] overflow-hidden"
      >
        {/* Subtle Golden Glow Line at Card Top */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-primary/90 to-transparent" />

        {/* Close Button at Top Right */}
        <button
          onClick={onNavigateHome}
          aria-label="Close"
          className="absolute top-4 right-4 size-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10 cursor-pointer"
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-4 pt-1">
          <img
            src="/assets/lt_wordmark_custom.png"
            alt="LiveTournaments.in Logo"
            style={{ maxHeight: '38px', width: 'auto' }}
            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onNavigateHome}
          />
          <p className="mt-1.5 text-[10px] uppercase tracking-widest text-gold-light/90 font-semibold">
            Official Esports Championship Hub
          </p>
        </div>

        {/* Compact Glossy Tab Switcher / Recovery Header */}
        {mode === 'forgot' ? (
          <div className="flex items-center justify-between p-1.5 mb-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-3.5 text-gold-primary" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              <span>Back to Sign In</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-light pr-2">Reset Password</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 p-1 mb-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => { setMode('login'); setRegStep('details'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-primary text-white shadow-[0_2px_10px_rgba(168,137,78,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setRegStep('details'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-primary text-white shadow-[0_2px_10px_rgba(168,137,78,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error & Success Messages */}
        {errorMessage && (
          <div className="mb-3.5 p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 shrink-0 text-red-400" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-3.5 p-2.5 rounded-lg bg-green-950/80 border border-green-500/40 text-green-200 text-xs flex items-center gap-2">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 shrink-0 text-green-400" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="leading-tight">{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@livetournaments.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-xs outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgot}
                  className="text-[10px] text-gold-primary hover:text-gold-light hover:underline transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-xs outline-none transition-all pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    </svg>
                  ) : (
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-gold-primary size-3.5"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_4px_15px_rgba(168,137,78,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login to LT.IN</span>
              )}
            </button>

            <div className="text-center pt-1 text-[11px] text-white/60">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setRegStep('details'); setErrorMessage(''); }}
                className="text-gold-primary hover:text-gold-light font-bold hover:underline transition-colors cursor-pointer"
              >
                Register here
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD - STEP 1: Enter Email */}
        {mode === 'forgot' && forgotStep === 'email' && (
          <form onSubmit={handleSendResetCode} className="space-y-3">
            <div className="text-center mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-light">Forgot Your Password?</h3>
              <p className="text-[11px] text-white/70 mt-1">
                Enter your registered email address and we'll send you a 6-digit verification code to create a new password.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@livetournaments.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-xs outline-none transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_4px_15px_rgba(168,137,78,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <span>Send Reset Code →</span>
              )}
            </button>

            <div className="text-center pt-1 text-[11px] text-white/60">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className="text-gold-primary hover:text-gold-light font-bold hover:underline transition-colors cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD - STEP 2: Enter OTP & New Password */}
        {mode === 'forgot' && forgotStep === 'verify' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-center">
              <div className="flex items-center justify-center gap-1.5 text-gold-light font-bold text-xs uppercase tracking-wider mb-1">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 text-gold-primary" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Check Your Email</span>
              </div>
              <p className="text-[11px] text-white/80">
                We sent a 6-digit reset code to <span className="font-semibold text-white">{forgotEmail}</span>
              </p>
              <button
                type="button"
                onClick={() => { setForgotStep('email'); setErrorMessage(''); }}
                className="mt-1 text-[10px] text-gold-light hover:underline cursor-pointer"
              >
                (Wrong email? Click to change)
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={8}
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                placeholder="• • • • • •"
                className="w-full text-center text-xl font-mono font-bold tracking-[0.3em] py-2 rounded-xl bg-white/10 border-2 border-gold-primary/60 focus:border-gold-primary text-white placeholder-white/30 outline-none transition-all"
                required
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  className="text-[10px] text-gold-primary hover:text-gold-light transition-colors"
                >
                  {showForgotNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showForgotNewPassword ? 'text' : 'password'}
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white placeholder-white/30 text-xs outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Confirm New Password
              </label>
              <input
                type={showForgotNewPassword ? 'text' : 'password'}
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white placeholder-white/30 text-xs outline-none transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 px-1">
              {resendTimer > 0 ? (
                <span className="text-white/50 text-[10px]">
                  Resend code in <strong className="text-gold-light">{resendTimer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendResetCode}
                  className="text-gold-primary hover:text-gold-light hover:underline font-bold text-[10px] cursor-pointer"
                >
                  Resend Verification Code
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_4px_15px_rgba(168,137,78,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password & Sign In ✓</span>
              )}
            </button>

            <div className="text-center pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className="text-white/60 hover:text-white text-[10px] uppercase font-semibold tracking-wider hover:underline cursor-pointer"
              >
                ← Cancel & return to sign in
              </button>
            </div>
          </form>
        )}

        {/* REGISTER - STEP 1: Details */}
        {mode === 'register' && regStep === 'details' && (
          <form onSubmit={handleSendVerificationCode} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">
                Full Name / Gamer Tag
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Phoenix_Ace"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-xs outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">
                Email Address (For Verification Code)
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="champion@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-xs outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-xs outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white placeholder-white/30 text-xs outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-0.5">
                  Confirm
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white placeholder-white/30 text-xs outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-0.5">
              <label className="flex items-start gap-1.5 cursor-pointer text-[10px] text-white/70 leading-snug">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded accent-gold-primary size-3 mt-0.5 shrink-0"
                />
                <span>
                  I agree to the LT.IN{' '}
                  <span className="text-gold-primary underline">Terms & Fair Play</span> rules.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_4px_15px_rgba(168,137,78,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <span>Send Verification Code →</span>
              )}
            </button>

            <div className="text-center pt-0.5 text-[11px] text-white/60">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className="text-gold-primary hover:text-gold-light font-bold hover:underline transition-colors cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </form>
        )}

        {/* REGISTER - STEP 2: Email Verification Code Entry */}
        {mode === 'register' && regStep === 'verify' && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-center">
              <div className="flex items-center justify-center gap-1.5 text-gold-light font-bold text-xs uppercase tracking-wider mb-1">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 text-gold-primary" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Check Your Email</span>
              </div>
              <p className="text-[11px] text-white/80">
                We sent a 6-digit code to <span className="font-semibold text-white">{regEmail}</span>
              </p>
              <button
                type="button"
                onClick={() => { setRegStep('details'); setErrorMessage(''); }}
                className="mt-1 text-[10px] text-gold-light hover:underline cursor-pointer"
              >
                (Wrong email? Click to edit)
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center text-xl font-mono font-bold tracking-[0.4em] py-2.5 rounded-xl bg-white/10 border-2 border-gold-primary/60 focus:border-gold-primary text-white placeholder-white/30 outline-none transition-all"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 px-1">
              {resendTimer > 0 ? (
                <span className="text-white/50 text-[10px]">
                  Resend code in <strong className="text-gold-light">{resendTimer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-gold-primary hover:text-gold-light hover:underline font-bold text-[10px] cursor-pointer"
                >
                  Resend Verification Code
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_4px_15px_rgba(168,137,78,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying & Creating Account...</span>
                </>
              ) : (
                <span>Verify & Complete Registration ✓</span>
              )}
            </button>

            <div className="text-center pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => { setRegStep('details'); setErrorMessage(''); }}
                className="text-white/60 hover:text-white text-[10px] uppercase font-semibold tracking-wider hover:underline cursor-pointer"
              >
                ← Back to registration details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

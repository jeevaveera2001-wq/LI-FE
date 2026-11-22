import handleLogin from '../../lib/auth/login.js';
import handleProfile from '../../lib/auth/profile.js';
import handleRegister from '../../lib/auth/register.js';
import handleResetPassword from '../../lib/auth/reset-password.js';
import handleSendOtp from '../../lib/auth/send-otp.js';
import handleVerifyOtp from '../../lib/auth/verify-otp.js';

export default async function handler(req, res) {
  // Support both dynamic route query param action and path matching
  const action = req.query.action || (req.url ? req.url.split('?')[0].split('/').pop() : '');

  switch (action) {
    case 'login':
      return handleLogin(req, res);
    case 'profile':
      return handleProfile(req, res);
    case 'register':
      return handleRegister(req, res);
    case 'reset-password':
      return handleResetPassword(req, res);
    case 'send-otp':
      return handleSendOtp(req, res);
    case 'verify-otp':
      return handleVerifyOtp(req, res);
    default:
      return res.status(404).json({ success: false, error: `Auth action '${action}' not found` });
  }
}

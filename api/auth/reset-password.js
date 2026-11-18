import crypto from 'node:crypto';
import { connectToDatabase } from '../lib/mongodb.js';

const PASSWORD_SALT = 'livetournaments_esports_2026_salt';
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + PASSWORD_SALT).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password, newPassword, otp } = req.body || {};
    const finalPassword = password || newPassword;

    if (!email || !finalPassword || !otp) {
      return res.status(400).json({ success: false, error: 'Email, new password, and verification code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let cleanOtp = String(otp).trim();
    if (cleanOtp.toUpperCase().startsWith('G-')) {
      cleanOtp = cleanOtp.substring(2).trim();
    }
    cleanOtp = cleanOtp.replace(/\D/g, '');

    const { db } = await connectToDatabase();
    const record = await db.collection('otps').findOne({ email: cleanEmail });

    if (!record) {
      return res.status(400).json({ success: false, error: 'No verification code requested for this email' });
    }

    if (Date.now() > record.expiry) {
      await db.collection('otps').deleteOne({ email: cleanEmail });
      return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new code.' });
    }

    if (record.otp !== cleanOtp) {
      return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your email.' });
    }

    // OTP is valid - consume it
    await db.collection('otps').deleteOne({ email: cleanEmail });

    // Hash and update password in users collection
    const passwordHash = hashPassword(finalPassword);
    const updateResult = await db.collection('users').updateOne(
      { email: cleanEmail },
      { $set: { passwordHash, updatedAt: new Date().toISOString() } }
    );

    if (updateResult.matchedCount === 0) {
      // Try matching by username
      await db.collection('users').updateOne(
        { username: cleanEmail.split('@')[0] },
        { $set: { passwordHash, updatedAt: new Date().toISOString() } }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Password has been successfully updated. You can now log in.'
    });
  } catch (error) {
    console.error('[reset-password] Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

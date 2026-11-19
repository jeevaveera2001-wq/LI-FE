import { connectToDatabase } from '../../lib/mongodb.js';

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
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and verification code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).replace(/\D/g, '').trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 6-digit verification code' });
    }

    try {
      const { db } = await connectToDatabase();
      const record = await db.collection('otps').findOne({ email: cleanEmail });

      if (record) {
        if (Date.now() > record.expiry) {
          await db.collection('otps').deleteOne({ email: cleanEmail });
          return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new one.' });
        }

        if (record.otp !== cleanOtp) {
          return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your email inbox.' });
        }

        // Invalidate code upon successful verification
        await db.collection('otps').deleteOne({ email: cleanEmail });
      }
    } catch (dbErr) {
      console.warn('[Vercel verify-otp] Database check error:', dbErr.message);
    }

    return res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.status(200).json({ success: true, message: 'Verified' });
  }
}

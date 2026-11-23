import nodemailer from 'nodemailer';
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
    const { email, purpose } = req.body || {};
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isReset = purpose === 'reset' || purpose === 'forgot';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to MongoDB Atlas
    try {
      const { db } = await connectToDatabase();
      await db.collection('otps').updateOne(
        { email: cleanEmail },
        { $set: { email: cleanEmail, otp, expiry, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`[send-otp] Stored OTP ${otp} for ${cleanEmail} in MongoDB`);
    } catch (dbErr) {
      console.warn('[send-otp] MongoDB write warning:', dbErr.message);
    }

    const user = (process.env.GMAIL_USER || 'livetournaments.in@gmail.com').trim();
    const pass = (process.env.GMAIL_APP_PASSWORD || 'ngdrnjgwbjfglfga').trim().replace(/\s+/g, '');

    const actionLabel = isReset ? 'password reset' : 'registration';
    const subjectLine = isReset 
      ? `${otp} is your Live Tournaments Password Reset Code`
      : `${otp} is your Live Tournaments Verification Code`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a;">
            LIVE TOURNAMENTS<span style="color: #f59e0b;">.IN</span>
          </h2>
        </div>
        
        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
          Hello,
        </p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
          Use the following verification code to complete your <strong>${actionLabel}</strong> on <strong>Live Tournaments</strong>:
        </p>

        <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
          <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
            Verification Code
          </div>
          <div style="font-size: 36px; font-weight: 900; letter-spacing: 6px; font-family: monospace; color: #0f172a; margin: 4px 0;">
            ${otp}
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
            Enter <strong>${otp}</strong> or <strong>G-${otp}</strong> in the portal
          </div>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
          This code expires in <strong>10 minutes</strong>. If you did not initiate this request, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        
        <div style="font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.4;">
          © ${new Date().getFullYear()} Live tournaments.in. Official Competitive BGMI Esports Portal.
        </div>
      </div>
    `;

    let emailSent = false;
    let dispatchError = null;

    // Primary: Port 465 (SSL)
    try {
      const transporter465 = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000
      });

      const info = await transporter465.sendMail({
        from: `"Live Tournaments Verification" <${user}>`,
        to: cleanEmail,
        subject: subjectLine,
        html: htmlContent
      });
      console.log('[send-otp] Sent successfully via Port 465! Msg ID:', info?.messageId);
      emailSent = true;
    } catch (err465) {
      console.warn('[send-otp] Port 465 failed, trying Port 587 fallback:', err465.message);
      // Fallback: Port 587 (STARTTLS)
      try {
        const transporter587 = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: { user, pass },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 10000
        });

        const info = await transporter587.sendMail({
          from: `"Live Tournaments Verification" <${user}>`,
          to: cleanEmail,
          subject: subjectLine,
          html: htmlContent
        });
        console.log('[send-otp] Sent successfully via Port 587! Msg ID:', info?.messageId);
        emailSent = true;
      } catch (err587) {
        console.error('[send-otp] Both Port 465 and Port 587 failed:', err587.message);
        dispatchError = err587.message;
      }
    }

    return res.status(200).json({
      success: true,
      message: emailSent ? 'Verification code sent to your email' : 'Verification code generated',
      email: cleanEmail,
      emailSent,
      error: dispatchError
    });
  } catch (error) {
    console.error('[send-otp] Caught error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while sending verification code'
    });
  }
}

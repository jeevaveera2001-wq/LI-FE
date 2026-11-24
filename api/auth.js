import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../lib/mongodb.js';
import { resolveExactLocation } from '../lib/location.js';

const SUPERADMIN_USERNAME = 'superadmin';
const SUPERADMIN_EMAIL = 'superadmin@lt.in';
const SUPERADMIN_PASS = 'SuperAdmin@21';
const PASSWORD_SALT = 'livetournaments_esports_2026_salt';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + PASSWORD_SALT).digest('hex');
}

// Nodemailer helper with Dual-Port Fallback (Port 465 SSL -> Port 587 STARTTLS)
async function sendEmailWithFallback({ to, subject, html }) {
  const user = (process.env.GMAIL_USER || 'livetournaments.in@gmail.com').trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || 'ngdrnjgwbjfglfga').trim().replace(/\s+/g, '');

  // 1. Try Port 465 (Implicit SSL)
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
      from: `"Live Tournaments" <${user}>`,
      to,
      subject,
      html
    });
    console.log('[sendEmail] Sent successfully via Port 465! Msg ID:', info?.messageId);
    return { success: true, info };
  } catch (err465) {
    console.warn('[sendEmail] Port 465 failed, trying Port 587 fallback:', err465.message);
    // 2. Try Port 587 (Explicit STARTTLS)
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
        from: `"Live Tournaments" <${user}>`,
        to,
        subject,
        html
      });
      console.log('[sendEmail] Sent successfully via Port 587! Msg ID:', info?.messageId);
      return { success: true, info };
    } catch (err587) {
      console.error('[sendEmail] Both Port 465 and Port 587 failed:', err587.message);
      return { success: false, error: err587.message };
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Resolve action from query or URL pathname
  const urlPath = req.url ? req.url.split('?')[0] : '';
  const actionFromPath = urlPath.split('/').filter(Boolean).pop() || '';
  const action = (req.query?.action || (actionFromPath !== 'auth' ? actionFromPath : '') || '').toLowerCase().trim();

  // -------------------------------------------------------------
  // 1. ACTION: send-otp
  // -------------------------------------------------------------
  if (action === 'send-otp') {
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

      // Store OTP in MongoDB Atlas
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

      const result = await sendEmailWithFallback({
        to: cleanEmail,
        subject: subjectLine,
        html: htmlContent
      });

      return res.status(200).json({
        success: true,
        message: result.success ? 'Verification code sent to your email' : 'Verification code generated',
        email: cleanEmail,
        emailSent: result.success,
        error: result.error || null
      });
    } catch (error) {
      console.error('[send-otp] Caught error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error while sending verification code'
      });
    }
  }

  // -------------------------------------------------------------
  // 2. ACTION: verify-otp
  // -------------------------------------------------------------
  if (action === 'verify-otp') {
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
        console.warn('[verify-otp] Database check error:', dbErr.message);
      }

      return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
      return res.status(200).json({ success: true, message: 'Verified' });
    }
  }

  // -------------------------------------------------------------
  // 3. ACTION: register
  // -------------------------------------------------------------
  if (action === 'register') {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
      const { name, email, mobile, password, location, ip: clientIpReq } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Name, email, and password required' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const cleanUsername = cleanEmail.split('@')[0];
      const passwordHash = hashPassword(password);

      // Resolve exact client geographical location and public IP
      const { location: locationStr, ip: clientIp } = await resolveExactLocation(req, location, clientIpReq);

      const userAgent = req.headers['user-agent'] || 'Chrome / Windows';
      const deviceStr = userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop / Windows 11';

      const userId = 'LT-USR-' + Date.now().toString().slice(-4);
      const newUser = {
        id: userId,
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        mobile: (mobile || '').trim(),
        passwordHash,
        role: 'user',
        status: 'ACTIVE',
        location: locationStr,
        ip: clientIp,
        game: 'Battlegrounds Mobile India',
        clan: 'Recruit Division',
        matchesPlayed: 0,
        tournamentsWon: 0,
        fairPlayScore: '100%',
        walletBalance: '₹ 0',
        agreements: 'Terms of Service, Fair Play Policy & Anti-Cheat Agreement Accepted',
        createdAt: new Date().toISOString()
      };

      try {
        const { db } = await connectToDatabase();
        const existing = await db.collection('users').findOne({
          $or: [{ email: cleanEmail }, { username: cleanUsername }]
        });

        if (existing) {
          return res.status(400).json({ success: false, error: 'An account with this email or username already exists' });
        }

        await db.collection('users').insertOne(newUser);

        // Record Activity Log into MongoDB for Super Admin audit ledger
        const regLog = {
          id: 'act_' + Date.now(),
          userId: newUser.id,
          userName: newUser.name,
          userEmail: newUser.email,
          action: 'New Competitor Account Registration (Verified)',
          ip: clientIp,
          location: locationStr,
          agreements: 'Terms of Service & Fair Play Agreement Confirmed',
          device: deviceStr,
          time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
          date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
          timestamp: new Date().toISOString()
        };
        await db.collection('activity_logs').insertOne(regLog);
      } catch (dbErr) {
        console.warn('[register] Database persistence warning:', dbErr.message);
      }

      // Send Welcome & Account Registration Confirmation Email
      try {
        const welcomeHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
            <div style="margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #0f172a;">
                LIVE TOURNAMENTS<span style="color: #f59e0b;">.IN</span>
              </h2>
              <div style="display: inline-block; background-color: #ecfdf5; color: #059669; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; margin-top: 8px;">
                ✓ ACCOUNT REGISTERED & VERIFIED
              </div>
            </div>
            
            <p style="font-size: 15px; color: #334155; line-height: 1.6;">
              Welcome to Live Tournaments, <strong>${newUser.name}</strong>!
            </p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Your competitive esports account has been successfully registered and verified. You are now officially cleared to participate in daily scrims, custom tournaments, and championship events.
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Player ID:</td>
                  <td style="font-weight: 700; color: #0f172a; text-align: right;">${newUser.id}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Gamer Tag / IGN:</td>
                  <td style="font-weight: 700; color: #0f172a; text-align: right;">${newUser.username}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Email:</td>
                  <td style="font-weight: 600; color: #0f172a; text-align: right;">${newUser.email}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Division:</td>
                  <td style="font-weight: 600; color: #d97706; text-align: right;">${newUser.clan}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Fair Play Score:</td>
                  <td style="font-weight: 700; color: #059669; text-align: right;">100% Verified</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="https://dist-five-phi-17.vercel.app/dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; border: 1px solid #334155;">
                Open Player Dashboard →
              </a>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
              If you have any questions or need match moderation, reach out to our official support team at <a href="mailto:livetournaments.in@gmail.com" style="color: #d97706;">livetournaments.in@gmail.com</a>.
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            
            <div style="font-size: 11px; color: #94a3b8; text-align: center;">
              © ${new Date().getFullYear()} Live tournaments.in. Official Competitive BGMI Esports Portal.
            </div>
          </div>
        `;

        sendEmailWithFallback({
          to: cleanEmail,
          subject: `🎉 Welcome to Live Tournaments, ${newUser.name}! Your Account is Ready`,
          html: welcomeHtml
        }).catch(e => console.warn('[register] Welcome email background warning:', e.message));
      } catch (welcomeErr) {
        console.warn('[register] Welcome email delivery warning:', welcomeErr.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          mobile: newUser.mobile,
          role: newUser.role,
          status: newUser.status,
          location: newUser.location
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // -------------------------------------------------------------
  // 4. ACTION: login
  // -------------------------------------------------------------
  if (action === 'login') {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
      const { usernameOrEmail, password, location, ip: clientIpReq } = req.body || {};
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ success: false, error: 'Username/email and password required' });
      }

      const cleanInput = usernameOrEmail.toLowerCase().trim();
      const { location: locationStr, ip: clientIp } = await resolveExactLocation(req, location, clientIpReq);
      const userAgent = req.headers['user-agent'] || 'Chrome / Windows';
      const deviceStr = userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop / Windows 11';

      // Super Admin Direct Auth Check
      if ((cleanInput === SUPERADMIN_USERNAME || cleanInput === SUPERADMIN_EMAIL) && password === SUPERADMIN_PASS) {
        const superUser = {
          id: 'LT-USR-1001',
          username: SUPERADMIN_USERNAME,
          email: SUPERADMIN_EMAIL,
          name: 'Super Admin',
          role: 'superadmin',
          displayName: 'Super Admin',
          status: 'ACTIVE',
          location: locationStr
        };

        try {
          const { db } = await connectToDatabase();
          await db.collection('activity_logs').insertOne({
            id: 'act_' + Date.now(),
            userId: 'LT-USR-1001',
            userName: 'Super Admin',
            userEmail: SUPERADMIN_EMAIL,
            action: 'Super Admin Portal Authentication',
            ip: clientIp,
            location: locationStr,
            agreements: 'Super Administrator Master Security Protocol Verified',
            device: deviceStr,
            time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
            date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
            timestamp: new Date().toISOString()
          });
        } catch (e) {}

        return res.status(200).json({ success: true, user: superUser });
      }

      // MongoDB check for registered users
      try {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({
          $or: [{ username: cleanInput }, { email: cleanInput }]
        });

        if (user && user.passwordHash === hashPassword(password)) {
          if (user.status === 'BLOCKED') {
            return res.status(403).json({ success: false, error: 'Your account has been suspended for anti-cheat/fair-play violations.' });
          }

          const userRole = (user.role === 'superadmin' || user.email === SUPERADMIN_EMAIL) ? 'superadmin' : 'user';

          // Log user login in background
          try {
            await db.collection('activity_logs').insertOne({
              id: 'act_' + Date.now(),
              userId: user.id || 'LT-USR-USER',
              userName: user.name || user.username,
              userEmail: user.email,
              action: 'Competitor Session Login',
              ip: clientIp,
              location: locationStr,
              agreements: 'Session Token & Fair Play Compliance Confirmed',
              device: deviceStr,
              time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
              date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
              timestamp: new Date().toISOString()
            });
          } catch (e) {}

          return res.status(200).json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              name: user.name,
              role: userRole,
              status: user.status || 'ACTIVE',
              location: locationStr
            }
          });
        }
      } catch (e) {
        console.warn('[login] DB lookup error:', e.message);
      }

      return res.status(401).json({ success: false, error: 'Invalid username/email or password' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // -------------------------------------------------------------
  // 5. ACTION: reset-password
  // -------------------------------------------------------------
  if (action === 'reset-password') {
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
      const mongoRecord = await db.collection('otps').findOne({ email: cleanEmail });

      if (!mongoRecord) {
        return res.status(400).json({ success: false, error: 'Invalid or expired verification code. Please check your email.' });
      }

      if (Date.now() > mongoRecord.expiry) {
        await db.collection('otps').deleteOne({ email: cleanEmail });
        return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new one.' });
      }

      if (mongoRecord.otp !== cleanOtp) {
        return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your email.' });
      }

      await db.collection('otps').deleteOne({ email: cleanEmail });
      const passwordHash = hashPassword(finalPassword);

      await db.collection('users').updateOne(
        { email: cleanEmail },
        { $set: { passwordHash, updatedAt: new Date().toISOString() } }
      );

      return res.status(200).json({
        success: true,
        message: 'Password has been successfully updated'
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // -------------------------------------------------------------
  // 6. ACTION: profile
  // -------------------------------------------------------------
  if (action === 'profile') {
    return res.status(200).json({ success: true, message: 'Profile endpoint active' });
  }

  return res.status(404).json({ success: false, error: `Auth action '${action}' not found` });
}

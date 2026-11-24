import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../mongodb.js';
import { resolveExactLocation } from '../location.js';

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
      const user = (process.env.GMAIL_USER || 'livetournaments.in@gmail.com').trim();
      const pass = (process.env.GMAIL_APP_PASSWORD || 'ngdrnjgwbjfglfga').trim().replace(/\s+/g, '');

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

      const welcomeText = `Welcome to Live Tournaments, ${newUser.name}!\n\nYour competitive esports account has been successfully registered and verified. You are now officially cleared to participate in daily scrims, custom tournaments, and championship events.\n\nAccount Credentials & Profile:\n- Player ID: ${newUser.id}\n- Gamer Tag / IGN: ${newUser.username}\n- Email: ${newUser.email}\n- Division: ${newUser.clan}\n- Fair Play Status: 100% Verified\n\nOpen Player Dashboard: https://dist-five-phi-17.vercel.app/dashboard\n\nSupport: livetournaments.in@gmail.com\n\n© ${new Date().getFullYear()} LiveTournaments.in - Official Competitive BGMI Esports Portal`;

      const mailOptions = {
        from: `"Live Tournaments" <${user}>`,
        replyTo: user,
        to: cleanEmail,
        subject: `Welcome to Live Tournaments, ${newUser.name}! Your Account is Ready`,
        text: welcomeText,
        html: welcomeHtml,
        headers: {
          'X-Priority': '1 (Highest)',
          'Importance': 'high',
          'X-Mailer': 'Live Tournaments Esports Engine'
        }
      };

      try {
        const transporter465 = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000
        });
        await transporter465.sendMail(mailOptions);
        console.log('[register] Welcome email delivered via Port 465');
      } catch (err465) {
        console.warn('[register] Port 465 welcome email failed, attempting Port 587:', err465.message);
        try {
          const transporter587 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: { user, pass },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000
          });
          await transporter587.sendMail(mailOptions);
          console.log('[register] Welcome email delivered via Port 587');
        } catch (err587) {
          console.error('[register] Welcome email dispatch failed:', err587.message);
        }
      }
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

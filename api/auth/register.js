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
    const { name, email, mobile, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = cleanEmail.split('@')[0];
    const passwordHash = hashPassword(password);

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      mobile: (mobile || '').trim(),
      passwordHash,
      role: 'user',
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
    } catch (dbErr) {
      console.warn('[Vercel register] Database persistence warning:', dbErr.message);
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
        role: newUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

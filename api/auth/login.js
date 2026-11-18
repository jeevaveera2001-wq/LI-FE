import crypto from 'node:crypto';
import { connectToDatabase } from '../lib/mongodb.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@livetournaments.in';
const ADMIN_HASH = 'ce028ff1dd39e85c4a6334d2a88bca9de49938790b38cced55a619c1ea6fc3bd';
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
    const { usernameOrEmail, password } = req.body || {};
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, error: 'Username/email and password required' });
    }

    const cleanInput = usernameOrEmail.toLowerCase().trim();
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');

    // Admin match check
    if ((cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL) && inputHash === ADMIN_HASH) {
      return res.status(200).json({
        success: true,
        user: {
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          role: 'ADMIN',
          displayName: 'Match Ops Admin'
        }
      });
    }

    // Database check
    try {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({
        $or: [{ username: cleanInput }, { email: cleanInput }]
      });

      if (user && user.passwordHash === hashPassword(password)) {
        return res.status(200).json({
          success: true,
          user: {
            username: user.username,
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            role: user.role || 'PLAYER'
          }
        });
      }
    } catch (e) {
      console.warn('DB lookup warning:', e.message);
    }

    return res.status(401).json({ success: false, error: 'Invalid username/email or password' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

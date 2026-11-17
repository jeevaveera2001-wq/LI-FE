// Cryptographic Salt & Secure Hash for Super Admin & Match Ops Admin
const PASSWORD_SALT = 'madan_conqueror_esports_2026_salt';

export const SUPER_ADMIN_USERNAME = 'lastzetas';
export const SUPER_ADMIN_EMAIL = 'lastzetas@gmail.com';
export const SUPER_ADMIN_HASH = '6f5cb341731e3eb276f896e23d4bc9cefc2e2f920b3c03cdae662ebfe9f52c0f'; // Hacker@21

export const ADMIN_USERNAME = 'admin';
export const ADMIN_EMAIL = 'admin@livetournaments.in';
export const ADMIN_HASH = 'ce028ff1dd39e85c4a6334d2a88bca9de49938790b38cced55a619c1ea6fc3bd'; // Admin@2026

const JWT_SECRET_SALT = 'madan_jwt_secret_key_9fc8e5d1_2026';
const TOKEN_STORAGE_KEY = 'livetournaments_auth_jwt';
const USERS_STORAGE_KEY = 'livetournaments_registered_users_v10';
const OTP_STORAGE_KEY = 'livetournaments_active_email_otps_v10';

export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const sendEmailOtp = async (email) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + (10 * 60 * 1000); // 10 minutes expiry

  try {
    const otps = JSON.parse(localStorage.getItem(OTP_STORAGE_KEY) || '{}');
    otps[cleanEmail] = { otp, expiry };
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
  } catch (e) {
    console.warn('Failed to store OTP:', e);
  }

  // Attempt remote dispatch / server trigger if available
  try {
    fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, otp })
    }).catch(() => {});
  } catch (e) {}

  return { success: true, email: cleanEmail, otp };
};

export const verifyEmailOtp = (email, inputOtp) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanOtp = (inputOtp || '').toString().trim();

  try {
    const otps = JSON.parse(localStorage.getItem(OTP_STORAGE_KEY) || '{}');
    const record = otps[cleanEmail];
    if (!record) {
      return { success: false, message: 'No verification code found for this email. Please request a new code.' };
    }
    if (Date.now() > record.expiry) {
      return { success: false, message: 'Verification code has expired. Please request a new code.' };
    }
    if (record.otp !== cleanOtp) {
      return { success: false, message: 'Invalid OTP code. Please check your verification code.' };
    }

    // Clear verified OTP
    delete otps[cleanEmail];
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Verification failed. Please try again.' };
  }
};

export const registerUser = async ({ name, email, phone, password }) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (name || '').trim();
  const cleanPhone = (phone || '').trim();

  const users = getStoredUsers();
  if (users.some(u => u.email === cleanEmail)) {
    return { success: false, message: 'An account with this email address already exists. Please log in.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    username: cleanName.toLowerCase().replace(/\s+/g, '_'),
    email: cleanEmail,
    phone: cleanPhone,
    passwordHash,
    role: 'PLAYER',
    badge: 'Verified Player',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save user:', e);
  }

  return { success: true, user: newUser };
};

// Helper: Convert ArrayBuffer to Hex String
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Helper: Base64Url encode/decode
const base64UrlEncode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
};

// Cryptographic Password Hasher using Web Crypto API (SHA-256)
export const hashPassword = async (password, salt = PASSWORD_SALT) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const cryptoObj = (typeof window !== 'undefined' && window.crypto) || (typeof crypto !== 'undefined' ? crypto : null);
  if (cryptoObj && cryptoObj.subtle) {
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
  }
  return '';
};

// Create Signed JWT (JSON Web Token)
export const createSignedJwt = async (payload) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadWithClaims = {
    ...payload,
    iss: 'livetournaments-portal',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours validity
  };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payloadWithClaims));

  // Sign with secret
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const signatureHash = await hashPassword(signatureInput, JWT_SECRET_SALT);
  const signatureEncoded = base64UrlEncode(signatureHash);

  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
};

// Verify and Decode JWT Token
export const verifyJwtToken = async (token) => {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

    // Verify signature
    const signatureInput = `${headerEncoded}.${payloadEncoded}`;
    const expectedSignatureHash = await hashPassword(signatureInput, JWT_SECRET_SALT);
    const expectedSignatureEncoded = base64UrlEncode(expectedSignatureHash);

    if (signatureEncoded !== expectedSignatureEncoded) {
      console.warn('JWT Verification Failed: Invalid Token Signature');
      return null;
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(payloadEncoded));

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn('JWT Verification Failed: Token Expired');
      return null;
    }

    return payload;
  } catch (err) {
    console.error('JWT Token Verification Error:', err);
    return null;
  }
};

// Validate Credentials before dispatching login OTP
export const validateLoginCredentials = async (usernameOrEmail, password) => {
  const cleanInput = (usernameOrEmail || '').trim().toLowerCase();
  const inputHash = await hashPassword(password);

  // 1. Super Admin Check
  if ((cleanInput === SUPER_ADMIN_USERNAME || cleanInput === SUPER_ADMIN_EMAIL) && inputHash === SUPER_ADMIN_HASH) {
    const userPayload = {
      sub: SUPER_ADMIN_USERNAME,
      username: 'lastzetas',
      email: SUPER_ADMIN_EMAIL,
      name: 'Last Zetas',
      role: 'SUPER_ADMIN',
      badge: 'Super Admin Level 10',
      permissions: ['ALL_ACCESS', 'ADMIN_MANAGE', 'TOURNAMENT_MANAGE', 'PAYOUT_DISPATCH', 'BROADCAST_ROOMS', 'AUDIT_LOGS']
    };
    return {
      success: true,
      email: SUPER_ADMIN_EMAIL,
      user: userPayload,
      type: 'superadmin'
    };
  }

  // 2. Match Ops Admin Check
  if ((cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL || cleanInput === 'admin@livetournaments.in') && inputHash === ADMIN_HASH) {
    const userPayload = {
      sub: ADMIN_USERNAME,
      username: 'admin',
      email: ADMIN_EMAIL,
      name: 'Match Ops Lead',
      role: 'ADMIN',
      badge: 'Match Operations Admin',
      permissions: ['TOURNAMENT_MANAGE', 'ROSTER_WHITELIST', 'ROOM_DISPATCH']
    };
    return {
      success: true,
      email: ADMIN_EMAIL,
      user: userPayload,
      type: 'admin'
    };
  }

  // 3. Registered User Accounts Check
  const users = getStoredUsers();
  const matchedUser = users.find(u => 
    u.email.toLowerCase() === cleanInput || 
    (u.username && u.username.toLowerCase() === cleanInput) ||
    (u.name && u.name.toLowerCase() === cleanInput) ||
    (u.phone && u.phone === cleanInput)
  );

  if (matchedUser && matchedUser.passwordHash === inputHash) {
    const userPayload = {
      sub: matchedUser.id,
      username: matchedUser.username || matchedUser.name,
      email: matchedUser.email,
      name: matchedUser.name,
      phone: matchedUser.phone,
      role: matchedUser.role || 'PLAYER',
      badge: matchedUser.badge || 'Verified Player',
      permissions: ['VIEW_TOURNAMENTS', 'SUBMIT_ROSTER']
    };
    return {
      success: true,
      email: matchedUser.email,
      user: userPayload,
      type: 'user'
    };
  }

  // 4. Team / Squad Passcode Check
  try {
    const teamsRaw = localStorage.getItem('livetournaments_portal_registrations_mongo_v10');
    if (teamsRaw) {
      const teams = JSON.parse(teamsRaw);
      const matchedTeam = teams.find(t => 
        (t.ticketId && t.ticketId.toLowerCase() === cleanInput) ||
        (t.teamName && t.teamName.toLowerCase() === cleanInput) ||
        (t.name && t.name.toLowerCase() === cleanInput)
      );
      if (matchedTeam && (matchedTeam.passcode === password || matchedTeam.passcode === cleanInput)) {
        return {
          success: true,
          email: matchedTeam.email || matchedTeam.iglEmail || 'admin@livetournaments.in',
          team: matchedTeam,
          type: 'team'
        };
      }
    }
  } catch (e) {}

  return {
    success: false,
    message: 'Invalid username or password. Please check your credentials.'
  };
};

// Complete Login after email OTP confirmation
export const completeVerifiedLogin = async (email, otp, userOrTeam, type = 'user') => {
  const verifyRes = verifyEmailOtp(email, otp);
  if (!verifyRes.success) {
    return verifyRes;
  }

  if (type === 'team') {
    return {
      success: true,
      type: 'team',
      team: userOrTeam,
      token: 'team-session-token'
    };
  }

  const token = await createSignedJwt(userOrTeam);
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (e) {
    console.warn('LocalStorage unavailable:', e);
  }

  return {
    success: true,
    token,
    user: userOrTeam,
    type: userOrTeam?.role === 'SUPER_ADMIN' ? 'superadmin' : (userOrTeam?.role === 'ADMIN' ? 'admin' : 'user')
  };
};

// Main Authenticate function with Secured Password Hashing & JWT Generation
export const authenticateUser = async (usernameOrEmail, password) => {
  const cleanInput = (usernameOrEmail || '').trim().toLowerCase();

  // Hash input password securely with salt
  const inputHash = await hashPassword(password);

  // 1. Super Admin Check (Accepts username 'lastzetas' or email 'lastzetas@gmail.com')
  if ((cleanInput === SUPER_ADMIN_USERNAME || cleanInput === SUPER_ADMIN_EMAIL) && inputHash === SUPER_ADMIN_HASH) {
    const userPayload = {
      sub: SUPER_ADMIN_USERNAME,
      username: 'lastzetas',
      email: SUPER_ADMIN_EMAIL,
      name: 'Last Zetas',
      role: 'SUPER_ADMIN',
      badge: 'Super Admin Level 10',
      permissions: ['ALL_ACCESS', 'ADMIN_MANAGE', 'TOURNAMENT_MANAGE', 'PAYOUT_DISPATCH', 'BROADCAST_ROOMS', 'AUDIT_LOGS']
    };

    const token = await createSignedJwt(userPayload);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }

    return {
      success: true,
      token,
      user: userPayload
    };
  }

  // 2. Match Ops Admin Check (Accepts username 'admin' or email 'admin@livetournaments.in')
  if ((cleanInput === ADMIN_USERNAME || cleanInput === ADMIN_EMAIL || cleanInput === 'admin@livetournaments.in') && inputHash === ADMIN_HASH) {
    const userPayload = {
      sub: ADMIN_USERNAME,
      username: 'admin',
      email: ADMIN_EMAIL,
      name: 'Match Ops Lead',
      role: 'ADMIN',
      badge: 'Match Operations Admin',
      permissions: ['TOURNAMENT_MANAGE', 'ROSTER_WHITELIST', 'ROOM_DISPATCH']
    };

    const token = await createSignedJwt(userPayload);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }

    return {
      success: true,
      token,
      user: userPayload
    };
  }

  // 3. Registered User Accounts Check
  const users = getStoredUsers();
  const matchedUser = users.find(u => 
    u.email.toLowerCase() === cleanInput || 
    (u.username && u.username.toLowerCase() === cleanInput) ||
    (u.name && u.name.toLowerCase() === cleanInput) ||
    (u.phone && u.phone === cleanInput)
  );

  if (matchedUser && matchedUser.passwordHash === inputHash) {
    const userPayload = {
      sub: matchedUser.id,
      username: matchedUser.username || matchedUser.name,
      email: matchedUser.email,
      name: matchedUser.name,
      phone: matchedUser.phone,
      role: matchedUser.role || 'PLAYER',
      badge: matchedUser.badge || 'Verified Player',
      permissions: ['VIEW_TOURNAMENTS', 'SUBMIT_ROSTER']
    };

    const token = await createSignedJwt(userPayload);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }

    return {
      success: true,
      token,
      user: userPayload
    };
  }

  // 4. Team / Squad Passcode Check
  try {
    const teamsRaw = localStorage.getItem('livetournaments_portal_registrations_mongo_v10');
    if (teamsRaw) {
      const teams = JSON.parse(teamsRaw);
      const matchedTeam = teams.find(t => 
        (t.ticketId && t.ticketId.toLowerCase() === cleanInput) ||
        (t.teamName && t.teamName.toLowerCase() === cleanInput) ||
        (t.name && t.name.toLowerCase() === cleanInput)
      );
      if (matchedTeam && (matchedTeam.passcode === password || matchedTeam.passcode === cleanInput)) {
        return {
          success: true,
          type: 'team',
          team: matchedTeam,
          token: 'team-session-token'
        };
      }
    }
  } catch (e) {}

  return {
    success: false,
    message: 'Invalid username or password. Please check your credentials.'
  };
};

// Get active session from stored JWT
export const getActiveSession = async () => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;

    const payload = await verifyJwtToken(token);
    if (!payload) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }

    return {
      token,
      user: payload
    };
  } catch (err) {
    console.error('Session retrieval error:', err);
    return null;
  }
};

// Logout User
export const logoutUser = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    console.error('Error logging out:', e);
  }
};

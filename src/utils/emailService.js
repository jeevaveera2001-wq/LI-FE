// LiveTournaments.in Official Automated Email Notification System
// Handles: Payment receipts, Tournament registration, 24h reminders, Room conducting, Results & Points tables, and VIP invites

export const getDispatchedEmails = () => {
  try {
    const raw = localStorage.getItem('lt_email_dispatches');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const recordEmailDispatch = (emailRecord) => {
  try {
    const existing = getDispatchedEmails();
    const updated = [emailRecord, ...existing];
    localStorage.setItem('lt_email_dispatches', JSON.stringify(updated.slice(0, 100)));
  } catch (e) {}
};

// 1. Payment Receipt & Confirmation Email
export const sendPaymentReceiptEmail = async ({ email, name, service, amount, paymentId, date }) => {
  const cleanEmail = email || 'player@livetournaments.in';
  const cleanName = name || 'Competitor';
  const timestamp = date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    id: 'MAIL_PAY_' + Date.now(),
    type: 'PAYMENT_RECEIPT',
    to: cleanEmail,
    recipientName: cleanName,
    subject: `LiveTournaments.in Payment Receipt - ₹${amount} Confirmed [${paymentId}]`,
    timestamp,
    status: 'DELIVERED',
    details: {
      service,
      amount,
      paymentId,
      gateway: 'Razorpay Test Mode',
      gstInvoice: 'LT-INV-' + Math.floor(100000 + Math.random() * 900000)
    },
    bodyHtml: `
      <h2>Payment Received & Verified</h2>
      <p>Hello ${cleanName},</p>
      <p>Your payment of <strong>₹${amount} INR</strong> for <strong>${service}</strong> has been successfully processed.</p>
      <p><strong>Razorpay Payment Ref:</strong> ${paymentId}</p>
      <p><strong>Invoice ID:</strong> LT-INV-${Math.floor(100000 + Math.random() * 900000)}</p>
      <p><strong>Date & Time:</strong> ${timestamp}</p>
      <p>Thank you for choosing LiveTournaments.in!</p>
    `
  };

  recordEmailDispatch(record);
  return record;
};

// 2. Tournament Registration Confirmation Email
export const sendRegistrationConfirmationEmail = async ({ email, name, teamName, tournamentTitle, matchTiming, slotNumber }) => {
  const cleanEmail = email || 'player@livetournaments.in';
  const cleanName = name || 'Competitor';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    id: 'MAIL_REG_' + Date.now(),
    type: 'TOURNAMENT_REGISTRATION',
    to: cleanEmail,
    recipientName: cleanName,
    subject: `Registration Confirmed: ${tournamentTitle} [Slot #${slotNumber || 'Confirmed'}]`,
    timestamp,
    status: 'DELIVERED',
    details: {
      tournamentTitle,
      teamName: teamName || cleanName,
      slotNumber: slotNumber || 'Verified Slot',
      matchTiming: matchTiming || 'As Scheduled'
    },
    bodyHtml: `
      <h2>Tournament Registration Confirmed</h2>
      <p>Hello ${cleanName},</p>
      <p>Your clan/team <strong>${teamName || cleanName}</strong> has been confirmed for <strong>${tournamentTitle}</strong>.</p>
      <p><strong>Assigned Slot:</strong> #${slotNumber || 'Confirmed'}</p>
      <p><strong>Match Schedule:</strong> ${matchTiming || 'Schedule available in Player Dashboard'}</p>
      <p>Room ID and Password will be dispatched 15 minutes before the match start time.</p>
    `
  };

  recordEmailDispatch(record);
  return record;
};

// 3. Pre-Match 24-Hour Reminder Email
export const sendTournamentReminderEmail = async ({ email, name, tournamentTitle, matchTiming, roomCode, roomPass }) => {
  const cleanEmail = email || 'player@livetournaments.in';
  const cleanName = name || 'Competitor';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    id: 'MAIL_REMIND_' + Date.now(),
    type: 'MATCH_REMINDER',
    to: cleanEmail,
    recipientName: cleanName,
    subject: `Reminder: ${tournamentTitle} takes place tomorrow at ${matchTiming}`,
    timestamp,
    status: 'DELIVERED',
    details: {
      tournamentTitle,
      matchTiming,
      roomCode: roomCode || 'Revealing 15m prior',
      roomPass: roomPass || 'Revealing 15m prior'
    },
    bodyHtml: `
      <h2>Match Reminder - 24 Hours to Go!</h2>
      <p>Hello ${cleanName},</p>
      <p>This is your reminder that <strong>${tournamentTitle}</strong> takes place tomorrow.</p>
      <p><strong>Match Timing:</strong> ${matchTiming}</p>
      <p>Please ensure all clan members are in lobby 15 minutes prior. Check-in is mandatory.</p>
    `
  };

  recordEmailDispatch(record);
  return record;
};

// 4. Room Conducting / Launch Email
export const sendRoomConductedEmail = async ({ email, name, title, type, game, roomCode, roomPass, channelLink, amountPaid, paymentId }) => {
  const cleanEmail = email || 'player@livetournaments.in';
  const cleanName = name || 'Organizer';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    id: 'MAIL_ROOM_' + Date.now(),
    type: 'ROOM_CONDUCTED',
    to: cleanEmail,
    recipientName: cleanName,
    subject: `Room Created & Submitted for Approval: ${title} (${type})`,
    timestamp,
    status: 'DELIVERED',
    details: {
      title,
      type,
      game,
      roomCode,
      roomPass,
      channelLink,
      amountPaid,
      paymentId
    },
    bodyHtml: `
      <h2>${type} Room Created Successfully</h2>
      <p>Hello ${cleanName},</p>
      <p>Your ${type === 'SCRIM' ? 'Daily Scrim' : 'Tournament Room'} <strong>${title}</strong> has been created and submitted to Admin for broadcast clearance.</p>
      <p><strong>Assigned Room Code:</strong> ${roomCode}</p>
      <p><strong>Passcode:</strong> ${roomPass}</p>
      <p><strong>Live Stream URL:</strong> ${channelLink || 'Not configured'}</p>
      <p><strong>Capacity:</strong> 25 Squads standard cap (100 players)</p>
    `
  };

  recordEmailDispatch(record);
  return record;
};

// 5. Post-Match Completion & Points Table Email
export const sendTournamentResultsEmail = async ({ email, name, tournamentTitle, pointsTable, posterUrl, winnerClan }) => {
  const cleanEmail = email || 'player@livetournaments.in';
  const cleanName = name || 'Competitor';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    id: 'MAIL_RESULTS_' + Date.now(),
    type: 'MATCH_RESULTS_POINTS',
    to: cleanEmail,
    recipientName: cleanName,
    subject: `Official Points Table & Results: ${tournamentTitle}`,
    timestamp,
    status: 'DELIVERED',
    details: {
      tournamentTitle,
      winnerClan: winnerClan || 'Team Soul',
      posterUrl: posterUrl || '/assets/tournament_bgmi_showdown_4k.jpg',
      pointsTable: pointsTable || [
        { rank: 1, team: winnerClan || 'Team Soul', kills: 14, pts: 29 },
        { rank: 2, team: 'GodLike Esports', kills: 11, pts: 21 },
        { rank: 3, team: 'Blind eSports', kills: 9, pts: 17 }
      ]
    },
    bodyHtml: `
      <h2>Official Match Results & Standings</h2>
      <p>Hello ${cleanName},</p>
      <p>The official match results and slot-wise points table for <strong>${tournamentTitle}</strong> have been finalized.</p>
      <p><strong>Champion:</strong> ${winnerClan || 'Team Soul'}</p>
      <p>View the complete points table and download your clan performance card in your Player Dashboard.</p>
    `
  };

  recordEmailDispatch(record);
  return record;
};

// 7. Tournament & Scrim Official Approval Email to Organizer
export const sendTournamentApprovalEmail = async ({ email, organizer, title, type = 'Tournament', schedule, game }) => {
  const cleanEmail = email || 'organizer@livetournaments.in';
  const cleanName = organizer || 'Tournament Organizer';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    id: 'MAIL_APPROVAL_' + Date.now(),
    type: 'TOURNAMENT_APPROVED',
    to: cleanEmail,
    recipientName: cleanName,
    subject: `✅ Approved: Your ${type} "${title}" is Now Live on LiveTournaments!`,
    timestamp,
    status: 'DELIVERED',
    details: {
      title,
      type,
      game: game || 'Battlegrounds Mobile India',
      schedule: schedule || 'Scheduled Match Time'
    },
    bodyHtml: `
      <h2>🎉 Congratulations! Your ${type} has been Officially Approved</h2>
      <p>Hello ${cleanName},</p>
      <p>Great news! Your ${type} submission <strong>${title}</strong> (${game || 'Battlegrounds Mobile India'}) has been thoroughly reviewed and approved by platform administration.</p>
      <p><strong>Visibility Status:</strong> LIVE on Platform Arena & Tournaments Directory</p>
      <p><strong>Scheduled Match Time:</strong> ${schedule || 'Scheduled Match Time'}</p>
      <div style="background:#111; color:#fff; padding:15px; border-radius:8px; margin:16px 0; border-left:4px solid #C5A059;">
        <h4 style="margin:0 0 8px 0; color:#C5A059;">Match Day Room ID & Password Sharing</h4>
        <p style="margin:0; font-size:13px; line-height:1.5;">You can now independently set and publish your custom Room ID & Password directly from your Organizer Dashboard at match time. Registered players will instantly receive access without requiring any secondary approval.</p>
      </div>
      <p>Need assistance or live moderation? Contact superadmin@lt.in or reach our community Discord/WhatsApp hotline.</p>
    `
  };

  recordEmailDispatch(record);
  return record;
};

// 6. Super Admin Direct VIP Access Invitation Email
export const sendSuperAdminVipInviteEmail = async ({ email, name, privilege, note }) => {
  const cleanEmail = email || 'partner@livetournaments.in';
  const cleanName = name || 'VIP Partner';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    id: 'MAIL_VIP_' + Date.now(),
    type: 'VIP_INVITATION',
    to: cleanEmail,
    recipientName: cleanName,
    subject: `Exclusive VIP Invitation: Direct Access Granted for ${privilege}`,
    timestamp,
    status: 'DELIVERED',
    details: {
      privilege,
      note: note || 'Granted directly by LiveTournaments Admin (Zero Payment Required)',
      activatedBy: 'Admin HQ'
    },
    bodyHtml: `
      <h2>VIP Direct Access Granted</h2>
      <p>Hello ${cleanName},</p>
      <p>You have been granted exclusive direct access to <strong>${privilege}</strong> on LiveTournaments.in without payment.</p>
      <p><strong>Admin Note:</strong> ${note || 'Official Partner Clearance'}</p>
      <p>Log in to your Player Dashboard to access your hosting and broadcast suite immediately.</p>
    `
  };

  recordEmailDispatch(record);
  return record;
};

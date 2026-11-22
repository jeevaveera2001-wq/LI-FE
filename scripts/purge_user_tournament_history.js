import { connectToDatabase } from '../lib/mongodb.js';

async function purgeUserTournamentHistory(targetEmail) {
  const { db } = await connectToDatabase();
  console.log(`Starting tournament history purge for: ${targetEmail}`);

  // 1. Delete from hosting_requests
  const hostingDel = await db.collection('hosting_requests').deleteMany({
    $or: [
      { email: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
      { contact: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
      { hostUser: /jeeva/i },
      { organizer: /jeeva/i }
    ]
  });
  console.log(`Deleted from hosting_requests: ${hostingDel.deletedCount}`);

  // 2. Delete from registrations
  const regDel = await db.collection('registrations').deleteMany({
    $or: [
      { email: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
      { userEmail: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
      { playerName: /jeeva/i },
      { organizer: /jeeva/i }
    ]
  });
  console.log(`Deleted from registrations: ${regDel.deletedCount}`);

  // 3. Delete from broadcast_requests
  const bcastDel = await db.collection('broadcast_requests').deleteMany({
    $or: [
      { email: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
      { creator: /jeeva/i },
      { organizerName: /jeeva/i }
    ]
  });
  console.log(`Deleted from broadcast_requests: ${bcastDel.deletedCount}`);

  // 4. Reset card_slots occupied by this user
  const DEFAULT_SLOTS = [
    { id: 'slot-1', slotNumber: 1, title: 'Live Broadcast Channel Slot 1', url: null, game: 'BGMI', isUnavailable: true, isDefault: true },
    { id: 'slot-2', slotNumber: 2, title: 'Live Broadcast Channel Slot 2', url: null, game: 'PUBG Mobile', isUnavailable: true, isDefault: true },
    { id: 'slot-3', slotNumber: 3, title: 'Live Broadcast Channel Slot 3', url: null, game: 'Free Fire MAX', isUnavailable: true, isDefault: true },
    { id: 'slot-4', slotNumber: 4, title: 'Live Broadcast Channel Slot 4', url: null, game: 'Valorant', isUnavailable: true, isDefault: true }
  ];

  for (const defSlot of DEFAULT_SLOTS) {
    await db.collection('card_slots').updateOne(
      { slotNumber: defSlot.slotNumber },
      {
        $set: {
          ...defSlot,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
  }
  console.log(`Reset all 4 card_slots to default offline standby`);

  // 5. Reset tournament stats in users collection
  const userUpdate = await db.collection('users').updateMany(
    { email: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
    {
      $set: {
        matchesPlayed: 0,
        tournamentsWon: 0,
        walletBalance: '₹ 0',
        joinedTournaments: [],
        hostedTournaments: [],
        tournamentHistory: [],
        updatedAt: new Date().toISOString()
      }
    }
  );
  console.log(`Updated user record in users collection: ${userUpdate.modifiedCount}`);

  // 6. Delete tournament activity logs
  const actDel = await db.collection('activity_logs').deleteMany({
    $and: [
      {
        $or: [
          { userEmail: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
          { userName: /jeeva/i }
        ]
      },
      {
        $or: [
          { action: /tournament/i },
          { action: /room/i },
          { action: /hosting/i },
          { action: /broadcast/i }
        ]
      }
    ]
  });
  console.log(`Deleted tournament activity logs: ${actDel.deletedCount}`);

  console.log('✓ Purge completed successfully for', targetEmail);
  process.exit(0);
}

purgeUserTournamentHistory('jeevaveera2001@gmail.com').catch(err => {
  console.error('Purge error:', err);
  process.exit(1);
});

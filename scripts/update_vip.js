import { connectToDatabase } from '../lib/mongodb.js';

async function updateVip() {
  const { db } = await connectToDatabase();
  const updateResult = await db.collection('users').updateOne(
    { email: 'jeevaveera2001@gmail.com' },
    {
      $set: {
        role: 'VIP',
        isVip: true,
        hasBroadcastVip: true,
        hasFeaturedApproval: true,
        hasScrimsApproval: true,
        hasTourneyApproval: true,
        tier: 'VIP_DIRECT',
        updatedAt: new Date().toISOString()
      }
    }
  );
  console.log('Update result:', updateResult);
  const user = await db.collection('users').findOne({ email: 'jeevaveera2001@gmail.com' });
  console.log('User record in MongoDB:', {
    email: user.email,
    role: user.role,
    isVip: user.isVip,
    hasBroadcastVip: user.hasBroadcastVip,
    hasFeaturedApproval: user.hasFeaturedApproval,
    hasScrimsApproval: user.hasScrimsApproval,
    hasTourneyApproval: user.hasTourneyApproval,
    tier: user.tier
  });
  process.exit(0);
}

updateVip().catch(err => {
  console.error(err);
  process.exit(1);
});

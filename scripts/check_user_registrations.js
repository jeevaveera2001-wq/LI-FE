import { connectToDatabase } from '../lib/mongodb.js';

async function main() {
  const { db } = await connectToDatabase();
  const regs = await db.collection('registrations').find({
    $or: [
      { email: /jeevaveera2001/i },
      { contact: /jeevaveera2001/i },
      { userEmail: /jeevaveera2001/i },
      { name: /jeeva/i },
      { captain: /jeeva/i },
      { player: /jeeva/i },
      { ign: /jeeva/i }
    ]
  }).toArray();
  console.log('Registrations found:', regs.length);
  console.log(JSON.stringify(regs, null, 2));

  // Also check hosting_requests
  const hosts = await db.collection('hosting_requests').find({
    $or: [
      { email: /jeevaveera2001/i },
      { organizer: /jeeva/i },
      { hostUser: /jeeva/i }
    ]
  }).toArray();
  console.log('\nHosting requests found:', hosts.length);
  console.log(JSON.stringify(hosts, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

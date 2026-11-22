import { connectToDatabase } from '../lib/mongodb.js';

async function main() {
  const { db } = await connectToDatabase();
  const collections = ['users', 'broadcast_requests', 'contact_messages', 'activity_logs', 'registrations', 'card_slots', 'otps'];
  for (const c of collections) {
    const docs = await db.collection(c).find({}).sort({ _id: -1 }).limit(5).toArray();
    console.log(`\n=== COLLECTION: ${c} (${docs.length}) ===`);
    for (const d of docs) {
      console.log(JSON.stringify(d));
    }
  }
  process.exit(0);
}

main().catch(console.error);

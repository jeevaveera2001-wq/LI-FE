import { connectToDatabase } from '../lib/mongodb.js';

async function checkUserHistory() {
  const { db } = await connectToDatabase();
  const collections = await db.listCollections().toArray();
  console.log('Collections in database:');
  for (const col of collections) {
    const cName = col.name;
    const count = await db.collection(cName).countDocuments();
    const matches = await db.collection(cName).find({
      $or: [
        { email: /jeevaveera2001/i },
        { contact: /jeevaveera2001/i },
        { hostUser: /jeeva/i },
        { organizer: /jeeva/i },
        { userEmail: /jeevaveera2001/i },
        { name: /jeeva/i },
        { username: /jeeva/i }
      ]
    }).toArray();
    if (matches.length > 0) {
      console.log(`\n=== Collection [${cName}] (Matches: ${matches.length} / Total: ${count}) ===`);
      matches.forEach((m, idx) => {
        console.log(`Item #${idx + 1}:`, JSON.stringify(m, null, 2));
      });
    }
  }
  process.exit(0);
}

checkUserHistory().catch(err => {
  console.error(err);
  process.exit(1);
});

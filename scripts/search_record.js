import { connectToDatabase } from '../lib/mongodb.js';

async function main() {
  const { db } = await connectToDatabase();
  const collections = await db.listCollections().toArray();
  console.log('Collections in database:', collections.map(c => c.name));

  const regexes = [/kk/i, /123/i];

  for (const c of collections) {
    const allDocs = await db.collection(c.name).find({}).sort({ _id: -1 }).limit(50).toArray();
    for (const doc of allDocs) {
      const str = JSON.stringify(doc);
      if (/kk/i.test(str) || /123/i.test(str)) {
        console.log(`[Collection: ${c.name}] Match found:`, JSON.stringify(doc, null, 2));
      }
    }
  }
}

main().catch(console.error);

import { connectToDatabase } from '../lib/mongodb.js';

async function main() {
  const { db } = await connectToDatabase();
  const regs = await db.collection('registrations').find({}).sort({ _id: -1 }).limit(20).toArray();
  console.log('--- REGISTRATIONS (' + regs.length + ') ---');
  console.log(JSON.stringify(regs, null, 2));

  const users = await db.collection('users').find({}).sort({ _id: -1 }).limit(10).toArray();
  console.log('--- RECENT USERS (' + users.length + ') ---');
  console.log(users.map(u => ({ email: u.email, name: u.name, clan: u.clan, username: u.username })));

  process.exit(0);
}

main().catch(console.error);

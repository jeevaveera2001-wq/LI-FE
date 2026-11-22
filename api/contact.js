import { connectToDatabase } from '../lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('contact_messages');

    // GET /api/contact - Retrieve all contact messages for Super Admin
    if (req.method === 'GET') {
      const messages = await collection
        .find({ status: { $ne: 'DELETED' } })
        .sort({ submittedAt: -1 })
        .toArray();

      const clean = messages.map(m => ({
        ...m,
        id: m.id || String(m._id)
      }));

      return res.status(200).json({ success: true, messages: clean });
    }

    // POST /api/contact - Submit new contact message from user
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.email && !body.mobile) {
        return res.status(400).json({ success: false, error: 'Email or Mobile is required' });
      }

      const ticketId = body.id || ('TICK-' + Date.now().toString().slice(-6));
      const newTicket = {
        id: ticketId,
        name: body.name || 'Anonymous Competitor',
        email: (body.email || '').toLowerCase().trim(),
        mobile: body.mobile || '',
        category: body.category || 'General Inquiry',
        priority: body.priority || 'Normal',
        message: body.message || '',
        status: 'PENDING',
        submittedAt: body.submittedAt || new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await collection.updateOne(
        { id: ticketId },
        { $set: newTicket },
        { upsert: true }
      );

      return res.status(200).json({ success: true, ticket: newTicket });
    }

    // PATCH /api/contact - Update ticket status (e.g. RESOLVED)
    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (!id) return res.status(400).json({ success: false, error: 'id is required' });

      await collection.updateOne(
        { id },
        { $set: { status: status || 'RESOLVED', updatedAt: new Date().toISOString() } }
      );

      return res.status(200).json({ success: true, message: 'Ticket status updated' });
    }

    // DELETE /api/contact - Delete / dismiss ticket
    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ success: false, error: 'id is required' });

      await collection.deleteOne({ id });

      return res.status(200).json({ success: true, message: 'Ticket removed' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API contact error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

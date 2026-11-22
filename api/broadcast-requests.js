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
    const collection = db.collection('broadcast_requests');

    // GET /api/broadcast-requests
    if (req.method === 'GET') {
      const requests = await collection
        .find({ status: { $ne: 'DECLINED' } })
        .sort({ submittedAt: -1 })
        .toArray();

      // Ensure _id doesn't collide with id
      const clean = requests.map(r => ({
        id: r.id || String(r._id),
        title: r.title || 'Live Broadcast Stream',
        tournament: r.tournament || r.title || 'Esports Match',
        streamUrl: r.streamUrl,
        organizerName: r.organizerName || r.creator || 'Competitor',
        creator: r.creator || r.organizerName || 'Competitor',
        channel: r.channel || 'Official Stream Feed',
        requestedSlot: r.requestedSlot || 'Prime Live Stream Feed (Slot 1-4)',
        language: r.language || 'Hindi / English',
        organizerClan: r.organizerClan || r.clan || 'OFFICIAL',
        clan: r.clan || r.organizerClan || 'OFFICIAL',
        game: r.game || 'BGMI',
        email: r.email,
        status: r.status || 'PENDING',
        submittedAt: r.submittedAt || new Date().toISOString(),
        isUserSubmitted: true,
        isLive: !!r.isLive,
        slotNumber: r.slotNumber || null
      }));

      return res.status(200).json({ success: true, requests: clean });
    }

    // POST /api/broadcast-requests (Submit or Upsert Request)
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.streamUrl) {
        return res.status(400).json({ success: false, error: 'streamUrl is required' });
      }

      const reqId = body.id || ('bcast_' + Date.now());
      const newRequest = {
        id: reqId,
        title: body.title || 'Competitive Live Stream',
        tournament: body.tournament || body.title || 'Competitive Live Stream',
        streamUrl: body.streamUrl,
        organizerName: body.organizerName || body.creator || 'Competitor',
        creator: body.creator || body.organizerName || 'Competitor',
        channel: body.channel || `${body.creator || 'Competitor'} Official Live`,
        requestedSlot: body.requestedSlot || 'Prime Live Stream Feed (Slot 1-4)',
        language: body.language || 'Hindi / English',
        organizerClan: body.organizerClan || body.clan || 'CLAN',
        clan: body.clan || body.organizerClan || 'CLAN',
        game: body.game || 'BATTLEGROUNDS MOBILE INDIA',
        email: body.email || 'caster@livetournaments.in',
        status: body.status || 'PENDING',
        submittedAt: body.submittedAt || new Date().toISOString(),
        isUserSubmitted: true,
        isLive: body.isLive !== false,
        updatedAt: new Date().toISOString()
      };

      await collection.updateOne(
        { $or: [{ id: reqId }, { streamUrl: body.streamUrl }] },
        { $set: newRequest },
        { upsert: true }
      );

      return res.status(200).json({ success: true, request: newRequest });
    }

    // PATCH /api/broadcast-requests (Assign to Slot / Update Status)
    if (req.method === 'PATCH') {
      const { id, status, slotNumber } = req.body || {};
      if (!id) {
        return res.status(400).json({ success: false, error: 'id is required' });
      }

      const updateFields = { updatedAt: new Date().toISOString() };
      if (status) updateFields.status = status;
      if (slotNumber) updateFields.slotNumber = Number(slotNumber);

      const result = await collection.updateOne({ id }, { $set: updateFields });
      return res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    }

    // DELETE /api/broadcast-requests (Decline Request)
    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'id is required' });
      }

      await collection.updateOne({ id }, { $set: { status: 'DECLINED', updatedAt: new Date().toISOString() } });
      return res.status(200).json({ success: true, message: 'Request declined' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API broadcast-requests error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

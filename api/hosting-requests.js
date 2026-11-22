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
    const collection = db.collection('hosting_requests');

    // GET /api/hosting-requests
    if (req.method === 'GET') {
      const type = req.query.type;
      const filter = { status: { $nin: ['REJECTED', 'DELETED'] } };
      if (type) filter.type = type.toUpperCase();

      const requests = await collection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      const clean = requests.map(r => ({
        ...r,
        id: r.id || String(r._id)
      }));

      return res.status(200).json({ success: true, requests: clean });
    }

    // POST /api/hosting-requests
    if (req.method === 'POST') {
      const body = req.body || {};
      const reqId = body.id || ('host_' + Date.now());
      const newRequest = {
        id: reqId,
        ...body,
        status: body.status || 'PENDING',
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await collection.updateOne(
        { id: reqId },
        { $set: newRequest },
        { upsert: true }
      );

      return res.status(200).json({ success: true, request: newRequest });
    }

    // PATCH /api/hosting-requests (Approve/Reject)
    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (!id) return res.status(400).json({ success: false, error: 'id is required' });

      await collection.updateOne(
        { id },
        { $set: { status: status || 'APPROVED', updatedAt: new Date().toISOString() } }
      );

      return res.status(200).json({ success: true, message: 'Status updated' });
    }

    // DELETE /api/hosting-requests
    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ success: false, error: 'id is required' });

      await collection.deleteOne({ id });

      return res.status(200).json({ success: true, message: 'Request deleted permanently' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API hosting-requests error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

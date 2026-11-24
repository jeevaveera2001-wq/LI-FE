import { connectToDatabase } from '../lib/mongodb.js';
import { verifyAdminToken, sanitizeNoSql, sanitizeText, enforceNonNegativeNumber } from '../lib/security.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-token, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vector 14: Sanitize against NoSQL injection
  req.body = sanitizeNoSql(req.body);
  req.query = sanitizeNoSql(req.query);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('hosting_requests');

    // GET /api/hosting-requests
    if (req.method === 'GET') {
      const type = req.query.type;
      const filter = { status: { $nin: ['REJECTED', 'DELETED'] } };
      if (type) filter.type = String(type).toUpperCase();

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

    // POST /api/hosting-requests (Vectors 4, 5, 6: Price tampering, negative quantities, fake payments)
    if (req.method === 'POST') {
      const body = req.body || {};
      const auth = verifyAdminToken(req);

      // Enforce mathematical bounds on pricing & quantities
      const rawEntryFee = body.entryFee !== undefined ? Number(body.entryFee) : (body.fee !== undefined ? Number(body.fee) : 0);
      const rawPrize = body.prizePool !== undefined ? Number(body.prizePool) : 0;
      const rawSlots = body.slots !== undefined ? Number(body.slots) : 100;

      if (rawEntryFee < 0 || rawPrize < 0 || rawSlots < 0) {
        return res.status(400).json({
          success: false,
          error: 'Negative entry fees, prize pools, or slot counts are strictly prohibited.'
        });
      }

      const entryFee = enforceNonNegativeNumber(rawEntryFee, 0);
      const prizePool = enforceNonNegativeNumber(rawPrize, 0);
      const slots = Math.min(100, Math.max(1, parseInt(rawSlots, 10) || 100));

      const reqId = body.id || ('host_' + Date.now());

      // Non-admin callers cannot self-approve or spoof payment status
      const resolvedStatus = auth ? (body.status || 'APPROVED') : 'PENDING';
      const resolvedPaymentStatus = (entryFee === 0 || auth) ? (body.paymentStatus || 'FREE') : 'PENDING';

      const newRequest = {
        id: reqId,
        ...body,
        title: sanitizeText(body.title || 'Tournament Room'),
        organizer: sanitizeText(body.organizer || body.hostUser || 'Competitor'),
        description: sanitizeText(body.description || ''),
        entryFee,
        fee: entryFee,
        prizePool,
        slots,
        status: resolvedStatus,
        paymentStatus: resolvedPaymentStatus,
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

    // PATCH /api/hosting-requests (Approve/Reject - Administrative Only)
    if (req.method === 'PATCH') {
      const auth = verifyAdminToken(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin privileges required to update tournament status' });
      }

      const { id, status } = req.body || {};
      if (!id) return res.status(400).json({ success: false, error: 'id is required' });

      await collection.updateOne(
        { id },
        { $set: { status: status || 'APPROVED', updatedAt: new Date().toISOString() } }
      );

      return res.status(200).json({ success: true, message: 'Status updated' });
    }

    // DELETE /api/hosting-requests (Administrative or Owner Only)
    if (req.method === 'DELETE') {
      const auth = verifyAdminToken(req);
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ success: false, error: 'id is required' });

      if (!auth) {
        // If not superadmin, verify requester email matches host email
        const userEmail = typeof req.headers['x-user-email'] === 'string' ? req.headers['x-user-email'].trim().toLowerCase() : '';
        const existing = await collection.findOne({ id });
        if (!existing || !userEmail || existing.email?.toLowerCase() !== userEmail) {
          return res.status(403).json({ success: false, error: 'Unauthorized: You can only delete your own hosting requests' });
        }
      }

      await collection.deleteOne({ id });

      return res.status(200).json({ success: true, message: 'Request deleted permanently' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API hosting-requests error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

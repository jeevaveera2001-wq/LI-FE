import { connectToDatabase } from '../lib/mongodb.js';
import { verifyAdminToken, sanitizeNoSql, sanitizeText } from '../lib/security.js';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vector 14: Sanitize against NoSQL injection
  req.body = sanitizeNoSql(req.body);
  req.query = sanitizeNoSql(req.query);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('suspicious_reports');

    // GET /api/reports (Admin Only)
    if (req.method === 'GET') {
      const auth = verifyAdminToken(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin privileges required to view reports' });
      }

      const reports = await collection.find({}).sort({ createdAt: -1 }).limit(100).toArray();
      return res.status(200).json({ success: true, reports });
    }

    if (req.method === 'POST') {
      const {
        targetType, // 'TOURNAMENT' | 'SCRIM' | 'STREAM' | 'CHAMPIONSHIP' | 'USER'
        targetId,
        targetTitle,
        category, // 'CHEATING' | 'FAKE_CREDENTIALS' | 'TOXICITY' | 'IMPERSONATION' | 'PAYMENT_FRAUD' | 'OTHER'
        details,
        reporterName,
        reporterEmail,
        reporterClan
      } = req.body || {};

      if (!targetTitle || !details) {
        return res.status(400).json({ success: false, message: 'Target title and incident details are required' });
      }

      const reportEntry = {
        id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        targetType: sanitizeText(String(targetType || 'TOURNAMENT')),
        targetId: sanitizeText(String(targetId || ('target_' + Date.now()))),
        targetTitle: sanitizeText(String(targetTitle)).trim(),
        category: sanitizeText(String(category || 'CHEATING')),
        details: sanitizeText(String(details)).trim().slice(0, 1000),
        reporterName: sanitizeText(String(reporterName || 'Anonymous Competitor')),
        reporterEmail: String(reporterEmail || '').toLowerCase().trim(),
        reporterClan: sanitizeText(String(reporterClan || 'Unassigned')),
        status: 'UNDER_REVIEW', // 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' | 'ACTION_TAKEN'
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        reviewNotes: ''
      };

      await collection.insertOne(reportEntry);

      return res.status(201).json({
        success: true,
        message: 'Suspicious activity report logged securely for Admin and Super Admin review.',
        report: reportEntry
      });
    }

    // PATCH /api/reports (Admin Only)
    if (req.method === 'PATCH') {
      const auth = verifyAdminToken(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin privileges required to update reports' });
      }

      const { id, status, reviewNotes } = req.body || {};
      if (!id) return res.status(400).json({ success: false, message: 'Report ID required' });

      await collection.updateOne(
        { id },
        {
          $set: {
            status: status || 'RESOLVED',
            reviewNotes: sanitizeText(String(reviewNotes || '')),
            reviewedAt: new Date().toISOString()
          }
        }
      );

      return res.status(200).json({ success: true, message: 'Report status updated' });
    }

    // DELETE /api/reports (Admin Only)
    if (req.method === 'DELETE') {
      const auth = verifyAdminToken(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin privileges required to delete reports' });
      }

      const { id } = req.query;
      if (id) {
        await collection.deleteOne({ id });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Reports API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

import { connectToDatabase } from '../lib/mongodb.js';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('suspicious_reports');

    if (req.method === 'GET') {
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
        targetType: targetType || 'TOURNAMENT',
        targetId: targetId || 'target_' + Date.now(),
        targetTitle: String(targetTitle).trim(),
        category: category || 'CHEATING',
        details: String(details).trim().slice(0, 1000),
        reporterName: reporterName || 'Anonymous Competitor',
        reporterEmail: reporterEmail || 'anonymous@livetournaments.in',
        reporterClan: reporterClan || 'Unassigned',
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

    if (req.method === 'PATCH') {
      const { id, status, reviewNotes } = req.body || {};
      if (!id) return res.status(400).json({ success: false, message: 'Report ID required' });

      await collection.updateOne(
        { id },
        {
          $set: {
            status: status || 'RESOLVED',
            reviewNotes: reviewNotes || '',
            reviewedAt: new Date().toISOString()
          }
        }
      );

      return res.status(200).json({ success: true, message: 'Report status updated' });
    }

    if (req.method === 'DELETE') {
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

import { connectToDatabase } from '../lib/mongodb.js';

export const config = {
  runtime: 'nodejs'
};

const DEFAULT_SETTINGS = {
  heroTitle: 'LIVE TOURNAMENTS INDIA',
  heroSubtitle: "INDIA'S PREMIER COMPETITIVE ESPORTS ARENA",
  tagline: 'Join us from now to participate and host your tournaments via LT.IN.',
  marqueeText: '🔥 BGMI PRO TOURNAMENT REGISTRATIONS OPEN • ₹50,000 PRIZE POOL • DAILY SCRIMS AT 8 PM • 4K YOUTUBE LIVE PRODUCTION',
  featuredStreamUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  pricing: {
    tournamentRoomFee: 10,
    dailyScrimsFee: 50,
    broadcastPassWeekly: 249,
    broadcastPassPro: 549,
    broadcastPassMonthly: 999,
    featuredTournamentFee: 49
  },
  games: [
    { name: 'Counter-Strike 2', genre: 'Tactical FPS', logo: 'https://d3h9qea4qy4169.cloudfront.net/cs2_00be38ddd1.png', active: true },
    { name: 'Valorant', genre: 'Hero Shooter', logo: 'https://d3h9qea4qy4169.cloudfront.net/Valorant_1710f7c511.png', active: true },
    { name: 'BGMI Pro League', genre: 'Battle Royale', logo: '/assets/tournament_bgmi_showdown_4k.jpg', active: true },
    { name: 'Fatal Fury: CotW', genre: 'Fighting', logo: 'https://d3h9qea4qy4169.cloudfront.net/Fatal_Fury_5779ac62be.png', active: true },
    { name: 'Chess.com Masters', genre: 'Strategy', logo: 'https://d3h9qea4qy4169.cloudfront.net/chess_logo_v1_8b2f61713b.png', active: true },
    { name: 'Dota 2', genre: 'MOBA', logo: 'https://d3h9qea4qy4169.cloudfront.net/dota2_logo_v1_c810ca7889.png', active: true }
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('platform_settings');

    if (req.method === 'GET') {
      const doc = await collection.findOne({ key: 'main_settings' });
      if (!doc) {
        return res.status(200).json({ success: true, settings: DEFAULT_SETTINGS });
      }
      return res.status(200).json({
        success: true,
        settings: {
          ...DEFAULT_SETTINGS,
          ...doc.settings,
          pricing: {
            ...DEFAULT_SETTINGS.pricing,
            ...(doc.settings?.pricing || {})
          }
        }
      });
    }

    if (req.method === 'POST') {
      const newSettings = req.body;
      if (!newSettings || typeof newSettings !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid payload' });
      }

      await collection.updateOne(
        { key: 'main_settings' },
        {
          $set: {
            key: 'main_settings',
            settings: newSettings,
            updatedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Platform settings and pricing updated successfully',
        settings: newSettings
      });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Platform settings API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

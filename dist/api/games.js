export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const games = [
    { _id: 'g1', name: 'Counter Strike 2', slug: 'cs2', logo: '/assets/games/cs2.png', status: 'confirmed' },
    { _id: 'g2', name: 'Valorant', slug: 'valorant', logo: '/assets/games/valorant.png', status: 'confirmed' },
    { _id: 'g3', name: 'Fatal Fury: City of the Wolves', slug: 'fatal-fury', logo: '/assets/games/fatal_fury.png', status: 'confirmed' },
    { _id: 'g4', name: 'Chess', slug: 'chess', logo: '/assets/games/chess.png', status: 'confirmed' },
    { _id: 'g5', name: 'Dota 2', slug: 'dota2', logo: '/assets/games/dota2.png', status: 'confirmed' },
    { _id: 'g6', name: 'Upcoming Title', slug: 'upcoming-title', logo: '?', status: 'revealing_soon', note: "We'll update soon" },
  ];

  res.status(200).json(games);
}

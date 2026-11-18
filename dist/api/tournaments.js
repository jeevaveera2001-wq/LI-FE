export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tournaments = [
    {
      _id: 't1',
      title: 'BGMI SHOWDOWN TOURNAMENT',
      game: 'BGMI',
      tag: 'BGMI',
      year: '2027',
      description: 'The biggest battle royale event in India returns with top squads fighting for glory.',
      image: '/assets/tournament_bgmi_showdown_4k.jpg',
      prizePool: '$250,000',
      status: 'upcoming',
      featured: true,
    },
    {
      _id: 't2',
      title: 'PUBG MOBILE GLOBAL CHAMPIONSHIP',
      game: 'PUBG Mobile',
      tag: 'PUBG',
      year: '2027',
      description: 'The ultimate global clash brings the finest teams together to compete on the world stage.',
      image: '/assets/tournament_pubg_mobile_4k.jpg',
      prizePool: '$1,000,000',
      status: 'upcoming',
      featured: true,
    },
    {
      _id: 't3',
      title: 'BGMI LAN WARRIORS CHALLENGE',
      game: 'BGMI',
      tag: 'BGMI',
      year: '2027',
      description: 'Top-tier Indian teams prepare to clash in the most anticipated offline tournament of the season.',
      image: '/assets/tournament_bgmi_lan_warriors_4k.jpg',
      prizePool: '$300,000',
      status: 'upcoming',
      featured: true,
    },
    {
      _id: 't4',
      title: 'PUBG ULTIMATE SQUAD SERIES',
      game: 'PUBG Mobile',
      tag: 'PUBG',
      year: '2027',
      description: 'An action-packed tournament featuring intense battle royale matches and massive prizes.',
      image: '/assets/tournament_pubg_ultimate_squad_4k.jpg',
      prizePool: '$500,000',
      status: 'upcoming',
      featured: true,
    },
  ];

  res.status(200).json(tournaments);
}

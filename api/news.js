export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const news = [
    {
      _id: 'n1',
      title: 'The race for the Club Championship is over! - LiveTournaments.in',
      category: 'WEEKLY RECAP',
      summary: 'A thrilling culmination to the grand championship race.',
      image: '/assets/recap_1.jpg',
      publishedAt: new Date('2026-11-15'),
    },
    {
      _id: 'n2',
      title: 'Team Spirit Wins CS2 At LT.IN | LiveTournaments.in',
      category: 'DAILY RECAP',
      summary: 'Team Spirit clinches the trophy in a dramatic five-map thriller.',
      image: '/assets/recap_2.jpg',
      publishedAt: new Date('2026-11-16'),
    },
    {
      _id: 'n3',
      title: 'AG.AL Have Secured The Club Championship | LiveTournaments.in',
      category: 'DAILY RECAP',
      summary: 'Dominant consistency across all titles secures AG.AL the #1 spot.',
      image: '/assets/recap_3.jpg',
      publishedAt: new Date('2026-11-17'),
    },
  ];

  res.status(200).json(news);
}

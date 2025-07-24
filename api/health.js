export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'healthy',
      message: 'OWL Payment System API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
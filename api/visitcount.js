import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Connection cache for serverless
const cached = globalThis._mongooseCache || (globalThis._mongooseCache = { conn: null, promise: null });

async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const visitSchema = new mongoose.Schema({
  _id: { type: String, default: 'portfolio_visits' },
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

function getVisitModel() {
  return mongoose.models.Visit || mongoose.model('Visit', visitSchema, 'portfolio');
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

export default async function handler(req, res) {
  if (!MONGO_URI) {
    // allow read-only operation even without DB
    if (req.method === 'GET') return res.status(200).json({ count: 0, warning: 'no mongo uri configured' });
    return res.status(500).json({ error: 'MONGO_URI not configured' });
  }

  await connect();
  const Visit = getVisitModel();

  try {
    if (req.method === 'GET') {
      let visit = await Visit.findById('portfolio_visits');
      if (!visit) visit = await Visit.create({ _id: 'portfolio_visits', count: 0 });
      return res.status(200).json({ count: visit.count, updatedAt: visit.updatedAt });
    }

    if (req.method === 'POST') {
      const body = parseBody(req);
      const incBy = Number(body.by ?? 1);
      if (Number.isNaN(incBy) || !Number.isFinite(incBy)) return res.status(400).json({ error: '`by` must be a finite number' });
      const visit = await Visit.findByIdAndUpdate(
        'portfolio_visits',
        { $inc: { count: incBy }, $set: { updatedAt: new Date() } },
        { upsert: true, new: true }
      );
      return res.status(200).json({ count: visit.count, updatedAt: visit.updatedAt });
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req);
      const numeric = Number(body.count);
      if (typeof body.count === 'undefined' || Number.isNaN(numeric) || !Number.isFinite(numeric)) {
        return res.status(400).json({ error: '`count` is required and must be a finite number' });
      }
      const visit = await Visit.findByIdAndUpdate(
        'portfolio_visits',
        { count: Math.max(0, Math.trunc(numeric)), updatedAt: new Date() },
        { upsert: true, new: true }
      );
      return res.status(200).json({ count: visit.count, updatedAt: visit.updatedAt });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error('api/visitcount error:', err);
    return res.status(500).json({ error: err.message });
  }
}

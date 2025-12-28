import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import visitsRouter from './routes/visits.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic root
app.get('/', async (req, res) => {
  const mongoose = (await import('mongoose')).default;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const mongoState = mongoose.connection.readyState;

  let visitCount = 'N/A';
  let updatedAt = 'N/A';

  try {
    const Visit = (await import('./models/Visit.js')).default;
    const doc = await Visit.findById('portfolio_visits');
    if (doc) {
      visitCount = doc.count;
      updatedAt = doc.updatedAt
        ? new Date(doc.updatedAt).toLocaleString('en-IN')
        : 'N/A';
    }
  } catch {}

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Portfolio API Status</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: #e5e7eb;
            padding: 40px;
          }
          .card {
            background: #020617;
            padding: 20px;
            border-radius: 12px;
            max-width: 420px;
            box-shadow: 0 10px 30px rgba(0,0,0,.4);
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
          }
          .ok { color: #22c55e; }
          .bad { color: #ef4444; }
          a {
            color: #38bdf8;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Portfolio API</h2>
          <div class="row">
            <span>Server</span>
            <span class="ok">Running</span>
          </div>
          <div class="row">
            <span>MongoDB</span>
            <span class="${mongoState === 1 ? 'ok' : 'bad'}">
              ${states[mongoState]}
            </span>
          </div>
          <div class="row">
            <span>Visit Count</span>
            <span>${visitCount}</span>
          </div>
          <div class="row">
            <span>Last Updated</span>
            <span>${updatedAt}</span>
          </div>
          <hr />
          <div class="row"><a href="/health">/health</a></div>
          <div class="row"><a href="/visitcount">/visitcount</a></div>
          <div class="row"><a href="/status">/status</a></div>
        </div>
      </body>
    </html>
  `);
});

// health
app.get('/health', async (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const state = (await import('mongoose')).default.connection.readyState;
  res.json({ mongoState: state, mongoStateText: states[state] || 'unknown' });
});

app.get('/status', async (req, res) => {
  const mongoose = (await import('mongoose')).default;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const mongoState = mongoose.connection.readyState;

  let visits = null;
  try {
    const Visit = (await import('./models/Visit.js')).default;
    const doc = await Visit.findById('portfolio_visits');
    visits = doc
      ? {
          count: doc.count,
          updatedAt: doc.updatedAt
            ? new Date(doc.updatedAt).toLocaleString('en-IN')
            : null,
        }
      : null;
  } catch {
    visits = 'not available';
  }

  res.json({
    server: 'running',
    mongo: {
      state: mongoState,
      text: states[mongoState] || 'unknown',
    },
    visits,
  });
});

app.use('/visitcount', visitsRouter);

const start = async () => {
  if (process.env.MONGO_URI) {
    await connectDB(process.env.MONGO_URI);
  } else {
    console.warn('⚠️  No MongoDB URI provided - running without database');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();

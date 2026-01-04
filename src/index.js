import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import contactRouter from './routes/contactform.js';
import { getContacts, submitContact } from './controllers/contactFormController.js';

dotenv.config();

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());

// ---------------- MongoDB (safe for Vercel + local) ----------------
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.log('✅ MongoDB connected');
}

connectDB();

// ---------------- Schema & Model ----------------
const visitSchema = new mongoose.Schema({
  _id: { type: String, default: 'portfolio_visits' },
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const Visit =
  mongoose.models.Visit ||
  mongoose.model('Visit', visitSchema, 'portfolio');

// ---------------- Routes ----------------
app.get('/', (req, res) => {
  res.send('Portfolio API running');
});

app.get('/health', (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    mongoState: mongoose.connection.readyState,
    mongoStateText: states[mongoose.connection.readyState],
  });
});

app.get('/visitcount', async (req, res) => {
  let visit = await Visit.findById('portfolio_visits');

  if (!visit) {
    visit = await Visit.create({
      _id: 'portfolio_visits',
      count: 0,
    });
  }

  res.json({
    count: visit.count,
    updatedAt: visit.updatedAt,
  });
});

// expose contact endpoints at top-level paths
app.get('/getContacts', getContacts);
app.post('/submitContact', submitContact);

// mount contactform router (still available under /contactform)
app.use('/contactform', contactRouter);
app.post('/visitcount', async (req, res) => {
  const visit = await Visit.findByIdAndUpdate(
    'portfolio_visits',
    {
      $inc: { count: 1 },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, new: true }
  );

  res.json({
    count: visit.count,
    updatedAt: visit.updatedAt,
  });
});

// ---------------- Local vs Vercel switch ----------------
const PORT = process.env.PORT || 5000;

// Local / Railway
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}

// Vercel needs this
export default app;
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
app.get('/', (req, res) => {
  res.send('Hello from Simple Server');
});

// health
app.get('/health', async (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const state = (await import('mongoose')).default.connection.readyState;
  res.json({ mongoState: state, mongoStateText: states[state] || 'unknown' });
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

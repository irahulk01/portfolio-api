import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  
const visitSchema = new mongoose.Schema({
  _id: { type: String, default: 'portfolio_visits' },
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const Visit = mongoose.model('Visit', visitSchema, 'portfolio');

app.get('/', (req, res) => {
  res.send('Hello from Simple Server');
});
// Health endpoint to check MongoDB connection
app.get('/health', async (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const state = mongoose.connection.readyState;
  const result = { mongoState: state, mongoStateText: states[state] || 'unknown' };

  if (state === 1 && mongoose.connection.db) {
    try {
      // try a lightweight ping to the server
      // eslint-disable-next-line no-undef
      await mongoose.connection.db.admin().ping();
      result.ping = 'ok';
    } catch (err) {
      result.ping = 'error';
      result.pingError = err.message;
    }
  }

  res.json(result);
});

app.get('/visitcount', async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/visitcount', async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

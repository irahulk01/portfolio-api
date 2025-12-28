import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

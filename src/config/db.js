import mongoose from 'mongoose';

export const connectDB = async (uri, opts = {}) => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      ...opts,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

export default mongoose;

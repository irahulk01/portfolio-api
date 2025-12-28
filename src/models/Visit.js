import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  _id: { type: String, default: 'portfolio_visits' },
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const Visit = mongoose.model('Visit', visitSchema, 'portfolio');

export default Visit;

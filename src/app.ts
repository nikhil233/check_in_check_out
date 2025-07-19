import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';

const app = express();

app.use(express.json());

// MongoDB connection placeholder
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel', {
  // useNewUrlParser: true, // Not needed in Mongoose 6+
  // useUnifiedTopology: true, // Not needed in Mongoose 6+
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/api', routes);

export default app; 
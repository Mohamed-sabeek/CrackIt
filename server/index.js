import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import seedAdmin from './config/seed.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import paperRoutes from './routes/paperRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import testRoutes from './routes/testRoutes.js';
import testAttemptRoutes from './routes/testAttemptRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Startup validation for critical configuration variables
if (!process.env.MONGO_URI) {
  console.error('\n❌ CRITICAL STARTUP ERROR: MONGO_URI environment variable is missing.');
  console.error('Please configure MONGO_URI in your server/.env file or production host settings.');
  console.error('Server startup aborted.\n');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('\n❌ CRITICAL STARTUP ERROR: JWT_SECRET environment variable is missing.');
  console.error('Please configure JWT_SECRET in your server/.env file or production host settings.');
  console.error('Server startup aborted.\n');
  process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
  console.error('\n❌ CRITICAL STARTUP ERROR: GROQ_API_KEY environment variable is missing.');
  console.error('Please configure GROQ_API_KEY in your server/.env file or production host settings.');
  console.error('Server startup aborted.\n');
  process.exit(1);
}

if (!process.env.GROQ_MODEL) {
  console.error('\n❌ CRITICAL STARTUP ERROR: GROQ_MODEL environment variable is missing.');
  console.error('Please configure GROQ_MODEL in your server/.env file or production host settings.');
  console.error('Server startup aborted.\n');
  process.exit(1);
}

const app = express();

// Secure Dynamic CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://crack-it-two.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB & Seed Admin
const initDB = async () => {
  await connectDB();
  await seedAdmin();
};
initDB();

import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-attempts', testAttemptRoutes);
app.use('/api/ai', aiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Crackit API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import seedAdmin from './config/seed.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import paperRoutes from './routes/paperRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import testRoutes from './routes/testRoutes.js';
import testAttemptRoutes from './routes/testAttemptRoutes.js';

dotenv.config();

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

const app = express();

// Secure Dynamic CORS configuration
const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS Warning: Request from blocked origin: ${origin}`);
      callback(new Error('Access blocked by CORS policy. Specified origin is not allowed.'));
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-attempts', testAttemptRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Crackit API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

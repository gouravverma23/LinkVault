const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust first proxy (required for Render, Railway, etc.)
// Without this, all requests appear from the same IP, breaking rate limiting
app.set('trust proxy', 1);

// --- Security Middleware ---

// Helmet: sets secure HTTP headers (removes X-Powered-By, adds XSS filters, etc.)
app.use(helmet());

// CORS
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? (process.env.CLIENT_URL || '').replace(/\/+$/, '') // strip trailing slash
  : 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mongo Sanitize: strips out any keys starting with '$' or '.' to prevent NoSQL injection
app.use(mongoSanitize());

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' },
});

// Apply general limiter to all API routes
app.use('/api', generalLimiter);

// Apply strict limiter to auth routes (login/register)
app.use('/api/auth', authLimiter);

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/preview', require('./routes/previewRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 CORS origin: ${allowedOrigin || '⚠️  NOT SET — check CLIENT_URL env var'}`);
});


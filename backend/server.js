const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS — allow requests from frontend (set FRONTEND_URL in production .env)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,  // e.g. https://your-app.vercel.app
].filter(Boolean); // remove undefined if FRONTEND_URL not set

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    
    const isAllowedCustom = allowedOrigins.includes(origin);
    const isNetlify = origin.endsWith('.netlify.app');
    
    if (isAllowedCustom || isNetlify) {
      return callback(null, true);
    }
    
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', method: req.method, url: req.url });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

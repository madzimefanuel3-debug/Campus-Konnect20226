require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Hardening: Helmet sets secure HTTP headers
app.use(helmet());

// Security Hardening: CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://campus-konnect-pwa.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Express Rate Limiter: Prevent Brute Force / DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
// Apply the rate limiting middleware to API calls only
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' })); // Limit body size to 10mb for profile picture base64
app.use(express.urlencoded({ extended: true }));

// --- API ENDPOINTS ---

// GET: Fetch all businesses
app.get('/api/businesses', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM businesses ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Create a new business profile
app.post('/api/businesses', 
  [
    // Security Hardening: Input Validation & Sanitization
    body('name').trim().notEmpty().withMessage('Business name is required').escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('category').trim().notEmpty().withMessage('Category is required').escape(),
    body('description').trim().notEmpty().withMessage('Description is required').escape(),
    body('contact_phone').trim().notEmpty().withMessage('Contact phone is required').escape(),
    body('profile_picture_url').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, category, description, contact_phone, profile_picture_url } = req.body;

    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO businesses (name, email, password_hash, category, description, contact_phone, profile_picture_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, category, description
      `;
      const values = [name, email, password_hash, category, description, contact_phone, profile_picture_url];
      
      const { rows } = await db.query(query, values);
      
      // Generate initial token
      const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      
      res.status(201).json({ business: rows[0], token });
    } catch (error) {
      console.error('Error creating business profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST: Business Login
app.post('/api/businesses/login', [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM businesses WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const business = rows[0];
    const isMatch = await bcrypt.compare(password, business.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: business.id, email: business.email }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );

    res.json({ token, business: { id: business.id, name: business.name, email: business.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// START SERVER
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running securely on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;

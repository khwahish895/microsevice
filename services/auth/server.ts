import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Mock DB
const users = [
  { id: '1', email: 'demo@example.com', password: '$2a$10$YourHashedPasswordHere' }
];

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  // For demo purposes, we accept any login if password is 'password'
  if (password === 'password' || (user && await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user?.id || 'demo-user', email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, userId: user?.id || 'demo-user' });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/auth/validate', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3002;

// Mock DB
const profiles: Record<string, any> = {
  'demo-user': { 
    name: 'Demo User', 
    title: 'Senior Developer', 
    bio: 'Looking for a role in system architecture.',
    skills: ['Node.js', 'React', 'Kubernetes']
  }
};

app.get('/api/users/:id', (req, res) => {
  const profile = profiles[req.params.id] || profiles['demo-user'];
  res.json(profile);
});

app.put('/api/users/:id', (req, res) => {
  profiles[req.params.id] = { ...profiles[req.params.id], ...req.body };
  res.json(profiles[req.params.id]);
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

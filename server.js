const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const rootDir = __dirname;

const projects = [
  {
    id: 'neural-commerce',
    title: 'Neural Commerce',
    description: 'AI-powered e-commerce platform with predictive recommendations and immersive product visualization.',
    year: 2024,
    tags: ['UI/UX', 'React', 'Animation'],
  },
  {
    id: 'luminance-studio',
    title: 'Luminance Studio',
    description: 'Interactive 3D portfolio showcasing architectural visualization with real-time lighting and material exploration.',
    year: 2024,
    tags: ['Branding', '3D', 'WebGL'],
  },
  {
    id: 'zenith-health',
    title: 'Zenith Health',
    description: 'Holistic wellness tracking app with biometric integration and personalized meditation experiences.',
    year: 2023,
    tags: ['Mobile', 'Flutter', 'IoT'],
  },
  {
    id: 'pulse-analytics',
    title: 'Pulse Analytics',
    description: 'Real-time data visualization platform for enterprise metrics with custom interactive charts and insights.',
    year: 2023,
    tags: ['Dashboard', 'D3.js', 'Analytics'],
  },
];

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(
  express.static(rootDir, {
    extensions: ['html'],
    setHeaders(res, filePath) {
      if (path.extname(filePath) === '.js') {
        res.type('application/javascript; charset=utf-8');
      }
    },
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/projects', (_req, res) => {
  res.json(projects);
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({
      message: 'Name, email, and message are required.',
    });
  }

  console.log('Message received:', {
    name,
    email,
    messageLength: String(message).length,
    receivedAt: new Date().toISOString(),
  });

  return res.status(201).json({
    message: 'Message received successfully!',
  });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Базовый маршрут
app.get('/', (req, res) => {
  res.send('Melodic Linker API is running');
});

// Пользователи
app.get('/api/auth/users', (req, res) => {
  res.json({ users: [] });
});

// Треки
app.get('/api/tracks', (req, res) => {
  res.json({ 
    tracks: [],
    page: 1,
    pages: 0,
    total: 0
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
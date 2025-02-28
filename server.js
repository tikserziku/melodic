const express = require('express');
const path = require('path');
const cors = require('cors');
const app = require('./backend/src/app-simple');

// Статические файлы
app.use(express.static(path.join(__dirname, 'test-frontend')));

// Маршрут для всех остальных запросов - отдаем index.html
app.get('*', (req, res) => {
  // Проверяем, не API ли это запрос
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'test-frontend', 'index.html'));
  }
});

// Порт приложения определяется Heroku или используется 5000 по умолчанию
const PORT = process.env.PORT || 5000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
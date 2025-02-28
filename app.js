const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Создаем приложение Express
const app = express();

// Настраиваем базовые middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем express если его нет в app-simple-direct
if (!app.use) {
  const express = require('express');
}

// Настройка для API (бэкенд)
try {
  require('./backend/src/app-simple-direct')(app);
  console.log('API успешно настроено');
} catch (error) {
  console.error('Ошибка при настройке API:', error);
}

// Настраиваем статические файлы
app.use(express.static(path.join(__dirname, 'test-frontend')));

// Любой другой маршрут отдает index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'test-frontend', 'index.html'));
  }
});

// Получаем порт из переменных окружения или используем 5000
const PORT = process.env.PORT || 5000;

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
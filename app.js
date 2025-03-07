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

// Настройка для API (бэкенд)
try {
  console.log('Попытка настройки API...');
  
  // Не добавляем примеры треков, чтобы сохранять пользовательские данные
  const apiConfig = {
    // Пустая конфигурация без демо-треков
  };
  
  require('./backend/src/app-simple-direct')(app, apiConfig);
  console.log('API успешно настроено');
} catch (error) {
  console.error('Ошибка при настройке API:', error.stack);
}

// Настраиваем статические файлы
app.use(express.static(path.join(__dirname, 'test-frontend')));

// Любой другой маршрут отдает index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'test-frontend', 'index.html'));
  }
});

// Получаем порт из переменных окружения или используем 5001
const PORT = process.env.PORT || 5001;

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
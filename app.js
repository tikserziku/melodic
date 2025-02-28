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
  
  // Установка тестовых треков для примеров
  const exampleTracks = [
    {
      id: '1001',
      title: 'Лунная соната',
      artist: 'Людвиг ван Бетховен',
      description: 'Одно из самых известных произведений классической музыки',
      genre: 'Классическая',
      coverImage: 'https://source.unsplash.com/random/200x200?piano',
      audioFile: 'https://actions.google.com/sounds/v1/ambiences/forest_night.ogg',
      duration: 318,
      plays: 1245,
      createdAt: new Date().toISOString()
    },
    {
      id: '1002',
      title: 'Времена года: Весна',
      artist: 'Антонио Вивальди',
      description: 'Часть знаменитого цикла "Времена года"',
      genre: 'Классическая',
      coverImage: 'https://source.unsplash.com/random/200x200?spring',
      audioFile: 'https://actions.google.com/sounds/v1/ambiences/mountain_wind.ogg',
      duration: 258,
      plays: 876,
      createdAt: new Date().toISOString()
    }
  ];
  
  // Передаем примеры треков в модуль API
  const apiConfig = {
    exampleTracks: exampleTracks
  };
  
  require('./backend/src/app-simple-direct')(app, apiConfig);
  console.log('API успешно настроено с примерами треков');
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
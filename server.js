const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

// Создаем Express приложение
const app = express();

// Базовые middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Импортируем бэкенд API
require('./backend/src/app-simple');

// Настраиваем статические файлы - сначала проверяем наличие директории
const staticDir = path.join(__dirname, 'test-frontend');
if (fs.existsSync(staticDir)) {
  console.log(`Статические файлы будут обслуживаться из ${staticDir}`);
  app.use(express.static(staticDir));
} else {
  console.log(`Директория ${staticDir} не существует!`);
}

// Корневой маршрут
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'test-frontend', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Melodic Linker - Frontend not found. Please check the deployment.');
  }
});

// Порт приложения определяется Heroku или используется 5000 по умолчанию
const PORT = process.env.PORT || 5000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
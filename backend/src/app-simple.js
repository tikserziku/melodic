const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Создаем директорию для хранения загруженных файлов
// В Heroku у нас нет постоянной файловой системы, но для демо будем использовать tmp
const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction 
  ? path.join('/tmp', 'melodic-linker-uploads')
  : path.join(__dirname, '../uploads');
const coverDir = path.join(uploadDir, 'covers');
const audioDir = path.join(uploadDir, 'audio');

// Убедимся, что директории существуют
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(coverDir)) {
  fs.mkdirSync(coverDir, { recursive: true });
}
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'coverImage') {
      cb(null, coverDir);
    } else {
      cb(null, audioDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Настройка фильтра для multer
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audioFile') {
    // Только аудио файлы
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Неверный формат файла. Разрешены только аудио файлы.'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    // Только изображения
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Неверный формат файла. Разрешены только изображения.'), false);
    }
  } else {
    cb(new Error('Неожиданное поле формы'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Добавляем CORS заголовки для работы с фронтендом на другом домене
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// Служебные переменные для хранения данных
let tracks = [
  {
    id: '1',
    title: 'Лунная соната',
    artist: 'Людвиг ван Бетховен',
    description: 'Одно из самых известных произведений классической музыки',
    genre: 'Классическая',
    coverImage: 'https://source.unsplash.com/random/200x200?piano',
    audioFile: 'https://example.com/moonlight-sonata.mp3',
    duration: 318,
    plays: 1245,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Времена года: Весна',
    artist: 'Антонио Вивальди',
    description: 'Часть знаменитого цикла "Времена года"',
    genre: 'Классическая',
    coverImage: 'https://source.unsplash.com/random/200x200?spring',
    audioFile: 'https://example.com/spring.mp3',
    duration: 258,
    plays: 876,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Полет шмеля',
    artist: 'Николай Римский-Корсаков',
    description: 'Виртуозная оркестровая интерлюдия',
    genre: 'Классическая',
    coverImage: 'https://source.unsplash.com/random/200x200?bee',
    audioFile: 'https://example.com/flight-of-bumblebee.mp3',
    duration: 192,
    plays: 657,
    createdAt: new Date().toISOString()
  }
];

// Базовый маршрут
app.get('/', (req, res) => {
  res.send('Melodic Linker API is running');
});

// Получение всех треков
app.get('/api/tracks', (req, res) => {
  res.json({
    tracks,
    page: 1,
    pages: 1,
    total: tracks.length
  });
});

// Получение трека по ID
app.get('/api/tracks/:id', (req, res) => {
  const track = tracks.find(t => t.id === req.params.id);
  
  if (!track) {
    return res.status(404).json({ message: 'Трек не найден' });
  }
  
  res.json(track);
});

// Загрузка трека
app.post('/api/tracks', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), (req, res) => {
  try {
    const { title, artist, genre, description } = req.body;
    
    if (!title || !artist) {
      return res.status(400).json({ message: 'Название и исполнитель обязательны' });
    }
    
    if (!req.files.audioFile) {
      return res.status(400).json({ message: 'Аудио файл обязателен' });
    }
    
    const audioFile = req.files.audioFile[0];
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
    
    const newTrack = {
      id: Date.now().toString(),
      title,
      artist,
      description: description || '',
      genre: genre || 'Другое',
      audioFile: `/uploads/audio/${audioFile.filename}`,
      coverImage: coverImage ? `/uploads/covers/${coverImage.filename}` : null,
      duration: 180, // Заглушка для длительности
      plays: 0,
      createdAt: new Date().toISOString()
    };
    
    tracks.push(newTrack);
    
    res.status(201).json(newTrack);
  } catch (error) {
    console.error('Ошибка при загрузке трека:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке трека' });
  }
});

// Обработка ошибок для multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'Файл слишком большой. Максимальный размер 50MB' 
      });
    }
    return res.status(400).json({ message: err.message });
  }
  
  if (err) {
    return res.status(500).json({ message: err.message });
  }
  
  next();
});

// Получаем экземпляр приложения express из родительского скрипта
const parentApp = require('express')();

// Монтируем все маршруты на родительское приложение с префиксом /api
parentApp.use('/api', app);

// Отладочная информация
console.log(`API настроено. Каталог загрузок: ${uploadDir}`);

// Не экспортируем, т.к. мы уже монтировали маршруты
// module.exports = app;
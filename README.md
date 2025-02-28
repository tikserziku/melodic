# Melodic Linker

Облачная платформа для обмена и прослушивания музыкальных треков. Приложение позволяет пользователям загружать, находить и воспроизводить музыку прямо в браузере, с оптимизацией для мобильных устройств.

## Технологический стек

### Frontend
- React с TypeScript
- Tailwind CSS с компонентами shadcn/ui
- React Query для работы с API
- Web Audio API для визуализации звука

### Backend
- Node.js с Express и TypeScript
- MongoDB для хранения метаданных треков
- JWT для аутентификации
- AWS S3 для хранения файлов
- Swagger для документации API

## Запуск проекта локально

### Backend
```bash
cd backend
npm install
# Создайте .env файл с необходимыми переменными окружения
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Запуск с использованием Docker

```bash
# Сборка и запуск через Docker
docker build -t melodic-linker-backend ./backend
docker run -p 5000:8080 -d melodic-linker-backend
```

## Деплой на Heroku

```bash
# Установка CLI Heroku
# https://devcenter.heroku.com/articles/heroku-cli

# Авторизация в Heroku
heroku login

# Вход в Container Registry
heroku container:login

# Сборка и отправка Docker-образа
heroku container:push web -a your-app-name

# Выпуск приложения
heroku container:release web -a your-app-name
```

## Структура проекта

### Backend
- `/src/models` - Модели данных (User, Track, Playlist)
- `/src/controllers` - Обработчики запросов
- `/src/routes` - API маршруты
- `/src/middleware` - Промежуточное ПО (аутентификация, обработка ошибок)
- `/src/services` - Сервисы (S3 для хранения файлов)

### Frontend (в процессе разработки)
- `/src/components` - Переиспользуемые компоненты
- `/src/pages` - Страницы приложения
- `/src/hooks` - Кастомные React-хуки
- `/src/services` - Сервисы для работы с API
- `/src/context` - Контексты для управления состоянием

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получение данных текущего пользователя

### Треки
- `GET /api/tracks` - Получение списка треков с пагинацией и фильтрацией
- `GET /api/tracks/:id` - Получение трека по ID
- `POST /api/tracks` - Загрузка нового трека
- `PUT /api/tracks/:id` - Обновление информации о треке
- `DELETE /api/tracks/:id` - Удаление трека
- `POST /api/tracks/:id/cover` - Загрузка обложки для трека
- `GET /api/tracks/user/:userId` - Получение треков пользователя

## Лицензия

MIT
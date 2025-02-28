FROM node:18-alpine

WORKDIR /app

# Копируем корневые файлы проекта
COPY package*.json ./
COPY app.js ./
COPY Procfile ./

# Копируем файлы фронтенда
COPY test-frontend/ ./test-frontend/

# Создаем директорию для бэкенда
RUN mkdir -p backend/src

# Копируем файлы бэкенда
COPY backend/package*.json ./backend/
COPY backend/src/ ./backend/src/

# Установка зависимостей в корне
RUN npm install

# Установка зависимостей для бэкенда
WORKDIR /app/backend
RUN npm install
WORKDIR /app

# Переменные окружения
ENV PORT=8080
ENV NODE_ENV=production

# Создаем директории для загрузок
RUN mkdir -p /tmp/melodic-linker-uploads
RUN mkdir -p /tmp/melodic-linker-uploads/covers
RUN mkdir -p /tmp/melodic-linker-uploads/audio

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["node", "app.js"]
FROM node:18-alpine

WORKDIR /app

# Копируем файлы проекта
COPY . .

# Установка зависимостей
RUN npm install
RUN cd backend && npm install

# Переменные окружения
ENV PORT=8080
ENV NODE_ENV=production

# Создаем директории для загрузок
RUN mkdir -p /tmp/melodic-linker-uploads/covers
RUN mkdir -p /tmp/melodic-linker-uploads/audio

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["node", "app.js"]
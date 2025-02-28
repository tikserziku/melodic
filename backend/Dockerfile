FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копируем исходный код
COPY . .

# Переменные окружения
ENV PORT=8080
ENV NODE_ENV=production

# Открываем порт
EXPOSE 8080

# Запускаем приложение с ts-node (без предварительной компиляции)
CMD ["npm", "start"]
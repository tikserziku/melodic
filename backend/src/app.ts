import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Импорт маршрутов
import authRoutes from './routes/authRoutes';
import trackRoutes from './routes/trackRoutes';

// Импорт обработчиков ошибок
import { notFound, errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Swagger опции
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Melodic Linker API',
      version: '1.0.0',
      description: 'API для музыкальной платформы Melodic Linker',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Локальный сервер',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', trackRoutes);

// Базовый маршрут
app.get('/', (req, res) => {
  res.send('Melodic Linker API is running');
});

// Middleware для обработки ошибок
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger документация доступна по адресу http://localhost:${PORT}/api-docs`);
});

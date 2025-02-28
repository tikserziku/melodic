import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Регистрация нового пользователя - POST /api/auth/register
router.post('/register', register);

// Авторизация пользователя - POST /api/auth/login
router.post('/login', login);

// Получение данных текущего пользователя - GET /api/auth/me
router.get('/me', auth, getCurrentUser);

export default router;
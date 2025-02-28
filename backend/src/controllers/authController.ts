import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Генерация JWT токена
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// Регистрация пользователя
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Проверяем, существует ли уже пользователь с таким email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Проверяем, существует ли уже пользователь с таким username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    // Создаем нового пользователя
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Некорректные данные пользователя' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Авторизация пользователя
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя по email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь с таким email не найден' });
    }

    // Проверяем пароль
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Получение данных текущего пользователя
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
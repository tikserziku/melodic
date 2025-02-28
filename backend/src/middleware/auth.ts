import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

// Расширяем интерфейс Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Отсутствует токен авторизации' });
    }

    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, secret) as TokenPayload;

    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный токен авторизации' });
  }
};

// Middleware для проверки роли администратора
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Доступ запрещен: требуются права администратора' });
  }
};
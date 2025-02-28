import express from 'express';
import {
  createTrack,
  deleteTrack,
  getTrackById,
  getTracks,
  getUserTracks,
  setTrackCover,
  updateTrack
} from '../controllers/trackController';
import { auth } from '../middleware/auth';
import { audioUpload, imageUpload } from '../services/s3Service';

const router = express.Router();

// Получение всех треков с фильтрацией и пагинацией - GET /api/tracks
router.get('/', getTracks);

// Получение трека по ID - GET /api/tracks/:id
router.get('/:id', getTrackById);

// Создание нового трека - POST /api/tracks
router.post('/', auth, audioUpload.single('audioFile'), createTrack);

// Обновление трека - PUT /api/tracks/:id
router.put('/:id', auth, updateTrack);

// Удаление трека - DELETE /api/tracks/:id
router.delete('/:id', auth, deleteTrack);

// Установка обложки для трека - POST /api/tracks/:id/cover
router.post('/:id/cover', auth, imageUpload.single('coverImage'), setTrackCover);

// Получение треков пользователя - GET /api/tracks/user/:userId
router.get('/user/:userId?', auth, getUserTracks);

export default router;
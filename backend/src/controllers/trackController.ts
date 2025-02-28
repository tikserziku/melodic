import { Request, Response } from 'express';
import Track from '../models/Track';
import { deleteFileFromS3 } from '../services/s3Service';

// Создание нового трека
export const createTrack = async (req: Request, res: Response) => {
  try {
    const { title, artist, description, genre, tags } = req.body;
    const audioFile = (req.file as any)?.location;
    
    if (!audioFile) {
      return res.status(400).json({ message: 'Необходимо загрузить аудиофайл' });
    }
    
    // Временно заглушка для длительности (в реальном приложении нужно вычислять)
    const duration = 180; // 3 минуты
    
    const track = await Track.create({
      title,
      artist,
      description,
      genre,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      audioFile,
      duration,
      user: req.user._id,
    });
    
    res.status(201).json(track);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Получение всех треков с пагинацией
export const getTracks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { artist: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};
    
    const genre = req.query.genre ? { genre: req.query.genre } : {};
    
    const count = await Track.countDocuments({ ...keyword, ...genre });
    const tracks = await Track.find({ ...keyword, ...genre })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      tracks,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Получение трека по ID
export const getTrackById = async (req: Request, res: Response) => {
  try {
    const track = await Track.findById(req.params.id).populate('user', 'username profileImage');
    
    if (!track) {
      return res.status(404).json({ message: 'Трек не найден' });
    }
    
    // Увеличиваем счетчик воспроизведений
    track.plays += 1;
    await track.save();
    
    res.json(track);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление трека
export const updateTrack = async (req: Request, res: Response) => {
  try {
    const { title, artist, description, genre, tags } = req.body;
    
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ message: 'Трек не найден' });
    }
    
    // Проверяем, что пользователь является владельцем трека
    if (track.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'У вас нет прав для редактирования этого трека' });
    }
    
    // Обновляем данные трека
    track.title = title || track.title;
    track.artist = artist || track.artist;
    track.description = description || track.description;
    track.genre = genre || track.genre;
    
    if (tags) {
      track.tags = tags.split(',').map((tag: string) => tag.trim());
    }
    
    const updatedTrack = await track.save();
    
    res.json(updatedTrack);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Удаление трека
export const deleteTrack = async (req: Request, res: Response) => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ message: 'Трек не найден' });
    }
    
    // Проверяем, что пользователь является владельцем трека или админом
    if (track.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'У вас нет прав для удаления этого трека' });
    }
    
    // Удаляем файл из S3
    if (track.audioFile) {
      await deleteFileFromS3(track.audioFile);
    }
    
    // Удаляем обложку из S3, если она есть
    if (track.coverImage) {
      await deleteFileFromS3(track.coverImage);
    }
    
    await track.deleteOne();
    
    res.json({ message: 'Трек успешно удален' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Установка обложки для трека
export const setTrackCover = async (req: Request, res: Response) => {
  try {
    const coverImage = (req.file as any)?.location;
    
    if (!coverImage) {
      return res.status(400).json({ message: 'Необходимо загрузить изображение обложки' });
    }
    
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ message: 'Трек не найден' });
    }
    
    // Проверяем, что пользователь является владельцем трека
    if (track.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'У вас нет прав для редактирования этого трека' });
    }
    
    // Удаляем старую обложку из S3, если она есть
    if (track.coverImage) {
      await deleteFileFromS3(track.coverImage);
    }
    
    track.coverImage = coverImage;
    const updatedTrack = await track.save();
    
    res.json(updatedTrack);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Получение треков пользователя
export const getUserTracks = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const tracks = await Track.find({ user: userId })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    
    res.json(tracks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { Request } from 'express';

// Настраиваем AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Функция для проверки типа файла
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Разрешенные типы аудиофайлов
  const audioFileTypes = /mp3|wav|ogg|aac|flac/;
  // Разрешенные типы изображений
  const imageFileTypes = /jpeg|jpg|png|gif|webp/;
  
  const mimeType = file.mimetype.toLowerCase();
  const fieldname = file.fieldname;
  
  if (fieldname === 'audioFile' && audioFileTypes.test(path.extname(file.originalname).toLowerCase())) {
    return cb(null, true);
  } else if ((fieldname === 'coverImage' || fieldname === 'profileImage') && 
             imageFileTypes.test(path.extname(file.originalname).toLowerCase())) {
    return cb(null, true);
  }
  
  cb(new Error('Недопустимый формат файла'));
};

// Конфигурация для аудиофайлов
export const audioUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET || 'melodic-linker',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const userId = req.user?._id || 'anonymous';
      const fileName = `tracks/${userId}/${Date.now()}-${path.basename(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter,
});

// Конфигурация для изображений
export const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET || 'melodic-linker',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const userId = req.user?._id || 'anonymous';
      const imageType = file.fieldname === 'profileImage' ? 'profiles' : 'covers';
      const fileName = `${imageType}/${userId}/${Date.now()}-${path.basename(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
});

// Функция для удаления файла из S3
export const deleteFileFromS3 = async (fileUrl: string): Promise<boolean> => {
  try {
    // Извлекаем ключ из URL
    const fileKey = fileUrl.split('.com/')[1];
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET || 'melodic-linker',
      Key: fileKey,
    };
    
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('Ошибка при удалении файла из S3:', error);
    return false;
  }
};
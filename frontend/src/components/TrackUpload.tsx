import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface TrackFormData {
  title: string;
  artist: string;
  genre: string;
  description: string;
}

export const TrackUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [formData, setFormData] = useState<TrackFormData>({
    title: '',
    artist: '',
    genre: '',
    description: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCover(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Пожалуйста, выберите аудио файл для загрузки');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('audioFile', selectedFile);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('artist', formData.artist);
    formDataToSend.append('genre', formData.genre);
    formDataToSend.append('description', formData.description);

    if (selectedCover) {
      formDataToSend.append('coverImage', selectedCover);
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      // Отправляем запрос на сервер
      const response = await axios.post(`${API_URL}/tracks`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });

      setUploadSuccess('Трек успешно загружен!');
      
      // Сброс формы после успешной загрузки
      setFormData({
        title: '',
        artist: '',
        genre: '',
        description: '',
      });
      setSelectedFile(null);
      setSelectedCover(null);
      
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      setUploadError('Произошла ошибка при загрузке трека');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Загрузить новый трек</h2>
      
      {uploadError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {uploadError}
        </div>
      )}
      
      {uploadSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {uploadSuccess}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Аудио файл*</label>
          <Input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {selectedFile && (
            <p className="mt-1 text-sm text-gray-500">
              Выбран файл: {selectedFile.name}
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Обложка</label>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleCoverChange}
            className="cursor-pointer"
          />
          {selectedCover && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Выбрана обложка: {selectedCover.name}</p>
              <img 
                src={URL.createObjectURL(selectedCover)} 
                alt="Cover preview" 
                className="mt-2 w-20 h-20 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Название*</label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Введите название трека"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Исполнитель*</label>
          <Input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            required
            placeholder="Введите имя исполнителя"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Жанр</label>
          <Input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            placeholder="Например: Рок, Джаз, Электронная музыка"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Опишите ваш трек..."
          />
        </div>
        
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-1 text-sm">{uploadProgress}%</p>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? 'Загрузка...' : 'Загрузить трек'}
        </Button>
      </form>
    </div>
  );
};
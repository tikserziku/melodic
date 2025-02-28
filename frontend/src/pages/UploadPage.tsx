import React from 'react';
import { Navbar } from '../components/Navbar';
import { TrackUpload } from '../components/TrackUpload';

export const UploadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Загрузить музыку</h1>
          
          <TrackUpload />
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Советы по загрузке</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Поддерживаемые форматы: MP3, WAV</li>
              <li>Максимальный размер файла: 50MB</li>
              <li>Рекомендуемый битрейт: 320kbps</li>
              <li>Добавьте обложку для привлечения внимания</li>
              <li>Заполните метаданные трека для лучшего отображения в поиске</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© 2025 Melodic Linker. Все права защищены.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">О нас</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Условия использования</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Конфиденциальность</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
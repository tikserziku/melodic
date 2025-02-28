import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TrackList } from '../components/TrackList';
import { Input } from '../components/ui/Input';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const genres = [
    'Все жанры', 'Рок', 'Поп', 'Электронная', 'Классическая', 
    'Джаз', 'Рэп', 'Фолк', 'Инди', 'Металл'
  ];
  const [selectedGenre, setSelectedGenre] = useState('Все жанры');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении отправляли бы запрос на сервер для поиска
    console.log('Поиск:', searchQuery, 'Жанр:', selectedGenre);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Исследуйте музыку</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Поиск</label>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Введите название трека или исполнителя"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Жанр</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedGenre === genre
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Поиск
              </button>
            </form>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Результаты</h2>
            <TrackList />
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
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
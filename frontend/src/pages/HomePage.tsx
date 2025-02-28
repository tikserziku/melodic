import React from 'react';
import { Navbar } from '../components/Navbar';
import { TrackList } from '../components/TrackList';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Melodic Linker - ваша музыка, ваше пространство</h1>
              <p className="text-xl mb-6">Загружайте, делитесь и открывайте новую музыку в одном месте</p>
              <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition">
                Начать сейчас
              </button>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <TrackList />
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Загрузите музыку</h3>
              <p className="text-gray-600">Загрузите ваши треки в форматах MP3 и WAV прямо с вашего устройства.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Организуйте плейлисты</h3>
              <p className="text-gray-600">Создавайте коллекции и плейлисты из любимых композиций.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Делитесь с миром</h3>
              <p className="text-gray-600">Поделитесь вашей музыкой в социальных сетях одним кликом.</p>
            </div>
          </div>
        </section>
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
import React, { useState } from 'react';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useState(false);

  return (
    <nav className="bg-white shadow-sm px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center text-xl font-bold text-blue-600">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </span>
            Melodic Linker
          </a>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="/" className="py-2 px-3 rounded-md hover:bg-gray-100">Главная</a>
          <a href="/explore" className="py-2 px-3 rounded-md hover:bg-gray-100">Обзор</a>
          <a href="/upload" className="py-2 px-3 rounded-md hover:bg-gray-100">Загрузить</a>
          
          {isLoggedIn ? (
            <div className="relative ml-3">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://source.unsplash.com/random/100x100?face"
                  alt="User avatar"
                />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Профиль</a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Настройки</a>
                  <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Выйти</a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="font-medium">Войти</Button>
              <Button size="sm" className="bg-blue-600 text-white font-medium">Регистрация</Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 py-2 space-y-1">
          <a href="/" className="block py-2 px-3 rounded-md hover:bg-gray-100">Главная</a>
          <a href="/explore" className="block py-2 px-3 rounded-md hover:bg-gray-100">Обзор</a>
          <a href="/upload" className="block py-2 px-3 rounded-md hover:bg-gray-100">Загрузить</a>
          
          {isLoggedIn ? (
            <>
              <a href="/profile" className="block py-2 px-3 rounded-md hover:bg-gray-100">Профиль</a>
              <a href="/settings" className="block py-2 px-3 rounded-md hover:bg-gray-100">Настройки</a>
              <a href="/logout" className="block py-2 px-3 rounded-md hover:bg-gray-100">Выйти</a>
            </>
          ) : (
            <div className="flex flex-col space-y-2 p-3">
              <Button variant="outline" className="w-full">Войти</Button>
              <Button className="w-full bg-blue-600">Регистрация</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
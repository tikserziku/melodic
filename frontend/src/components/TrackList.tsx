import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDuration } from '../lib/utils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
  audioFile: string;
  duration: number;
  plays: number;
}

export const TrackList: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${API_URL}/tracks`);
        setTracks(response.data.tracks);
      } catch (err) {
        console.error('Ошибка при загрузке треков:', err);
        setError('Не удалось загрузить треки. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTracks();
  }, []);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTrack = (trackId: string) => {
    if (currentTrack === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const handleShare = (track: Track) => {
    // В реальном приложении здесь было бы API для поделиться в соц. сетях
    if (navigator.share) {
      navigator.share({
        title: `${track.title} - ${track.artist}`,
        text: `Послушайте трек "${track.title}" от ${track.artist} на Melodic Linker`,
        url: `${window.location.origin}/track/${track.id}`,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      alert(`Ссылка на трек: ${window.location.origin}/track/${track.id}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Популярные треки</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <svg className="inline animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Загрузка треков...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          Треки не найдены. Попробуйте загрузить собственную музыку!
        </div>
      ) : (
        <div className="space-y-4">
          {tracks.map((track) => (
            <div 
              key={track.id} 
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative flex-shrink-0 w-14 h-14 mr-4 cursor-pointer" onClick={() => handlePlayTrack(track.id)}>
                <img 
                  src={track.coverImage || `https://source.unsplash.com/random/200x200?music`} 
                  alt={track.title}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
                  <button className="text-white">
                    {currentTrack === track.id && isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-lg truncate">{track.title}</h3>
                <p className="text-sm text-gray-600 truncate">{track.artist}</p>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-sm text-gray-500">
                  {formatDuration(track.duration)}
                </div>
                
                <div className="text-sm text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {track.plays}
                </div>
                
                <button 
                  onClick={() => handleShare(track)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  title="Поделиться"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
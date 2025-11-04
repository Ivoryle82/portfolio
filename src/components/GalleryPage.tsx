import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GalleryPageProps {
  galleryName: string;
  onClose: () => void;
  photos: string[];
}

export function GalleryPage({ galleryName, onClose, photos }: GalleryPageProps) {
  const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Debug: Log photos received
  console.log('GalleryPage photos:', photos.length, photos);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMaskPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      {/* Cursor Image Mask Effect - Hero Section */}
      <div 
        className="relative w-full h-screen overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background - Greyscale */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <h1 
              className="text-[12rem] font-bold text-white/5 leading-none mb-4 select-none"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              {galleryName}
            </h1>
            <p className="text-white/20 text-2xl" style={{ fontFamily: 'Space Grotesk' }}>
              Move your cursor to reveal the photos
            </p>
          </div>
        </div>

        {/* Colored version with circular mask following cursor */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: isHovering 
              ? `circle(200px at ${maskPosition.x}px ${maskPosition.y}px)` 
              : 'circle(0px at 50% 50%)',
            transition: isHovering ? 'none' : 'clip-path 0.5s ease-out'
          }}
        >
          <div className="text-center px-8">
            <h1 
              className="text-[12rem] font-bold text-white leading-none mb-4 select-none"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              {galleryName}
            </h1>
            <p className="text-white text-2xl" style={{ fontFamily: 'Space Grotesk' }}>
              A collection of moments captured
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-8 left-8 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg px-4 py-2 transition-all duration-300 flex items-center gap-2"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Portfolio
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-sm animate-bounce">
          <p style={{ fontFamily: 'Space Grotesk' }}>Scroll down to view gallery</p>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto mt-4 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Photo Gallery - Masonry Layout */}
      <div className="relative min-h-screen bg-black px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-5xl font-bold text-white mb-16 text-center"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Gallery
          </h2>

          {/* Masonry Grid */}
          {photos.length === 0 ? (
            <div className="text-center text-white/60 py-20">
              <p style={{ fontFamily: 'Space Grotesk' }}>No photos found</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <div 
                key={index}
                className="break-inside-avoid mb-6 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/20">
                  <ImageWithFallback
                    src={photo}
                    alt={`${galleryName} photo ${index + 1}`}
                    className="w-full h-auto object-cover transition-all duration-500 group-hover:brightness-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm" style={{ fontFamily: 'Space Grotesk' }}>
                      Photo {index + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Footer */}
          <div className="text-center mt-20 pb-12">
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold transition-all duration-300 border border-white/20"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Return to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

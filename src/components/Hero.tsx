'use client';

import { useState, useEffect } from 'react';

const images = [
  {
    url: "/img1.jpg",
    alt: "Professional Services Marketplace"
  },
  {
    url: "/img2.jpg",
    alt: "Home Services"
  },
  {
    url: "/img3.jpg",
    alt: "Professional Services"
  },
  {
    url: "/img4.jpg",
    alt: "Servio"
  }
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[350px] w-full overflow-hidden">
      {/* Image Slider */}
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: currentImage === index ? 1 : 0,
          }}
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("${image.url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.9)',
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <div className="text-center z-10" style={{ filter: 'brightness(1.1)' }}>
          <h1 className="text-6xl font-bold">
            <span className="text-white">Connect with </span>
            <span className="text-yellow-400">local Talent</span>
          </h1>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImage === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero; 
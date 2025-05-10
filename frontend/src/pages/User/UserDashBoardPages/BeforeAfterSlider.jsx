import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BeforeAfterSlider = ({ transformationData }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Handle case when transformationData is undefined or null
  if (!transformationData) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900 text-white">
        <p>Loading transformation data...</p>
      </div>
    );
  }
  
  // Safely destructure after confirming transformationData exists
  const {
    title = "Transformation",
    caption = "",
    beforeImage = "",
    afterImage = "",
    weightBefore = 0,
    weightAfter = 0,
    timePeriod = "unknown",
  } = transformationData;

  const slides = [
    {
      image: beforeImage,
      weight: weightBefore,
      label: 'Before'
    },
    {
      image: afterImage,
      weight: weightAfter,
      label: 'After'
    }
  ];
  
  const goToSlide = (index) => {
    setActiveSlide(index);
  };
  
  const goToPrevSlide = () => {
    setActiveSlide(activeSlide === 0 ? slides.length - 1 : activeSlide - 1);
  };
  
  const goToNextSlide = () => {
    setActiveSlide(activeSlide === slides.length - 1 ? 0 : activeSlide + 1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Main slider container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            {slide.image ? (
              <img 
                src={slide.image} 
                alt={`${slide.label} transformation`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center">
                <p className="text-white text-lg">No image available</p>
              </div>
            )}
            
            {/* Overlay with information */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex flex-col justify-end p-6 text-white">
              <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">{slide.label}</span>
                  <div className="flex items-center bg-black/50 px-4 py-2 rounded-full">
                    <span className="text-2xl font-bold">{slide.weight} kg</span>
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
                <p className="text-lg opacity-90 mb-2">{caption}</p>
                <p className="text-sm opacity-80">Time period: {timePeriod}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeSlide === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Swipe indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center text-white bg-black/40 px-4 py-2 rounded-full text-sm">
        <span>Swipe to compare</span>
        <div className="ml-2 flex items-center">
          <ChevronLeft size={16} />
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
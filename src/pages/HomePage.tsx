import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Gift } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';
import FloatingHearts from '../components/FloatingHearts';
import ArabicPoem from '../components/ArabicPoem';

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <FloatingHearts />
      
      {/* 3D Parallax Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 opacity-50"
          style={{
            transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px, 0)`,
          }}
        />
        
        {/* Floating Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate3d(${mousePosition.x * (0.02 + i * 0.001)}px, ${mousePosition.y * (0.02 + i * 0.001)}px, 0)`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 opacity-60" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-clip-text text-transparent"
            style={{ fontFamily: 'Dancing Script, cursive' }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Happy Birthday Hajar!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8"
          >
            A special website created with love by Bilal, filled with your favorite characters and sweet memories ♥
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex justify-center space-x-4 mb-12"
          >
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              <span className="text-gray-700 font-medium">Tom & Jerry</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <Gift className="w-6 h-6 text-purple-500" />
              <span className="text-gray-700 font-medium">Mickey Mouse</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Image Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-16"
        >
          <ImageSlider />
        </motion.div>

        {/* Arabic Poem */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <ArabicPoem />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
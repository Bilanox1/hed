import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const ArabicPoem = () => {
  const poemLines = [
    "ياهاجر، يا نور العين والقلب",
    "أنت أجمل من القمر في الليل",
    "مثل توم وجيري، نحن نلعب ونضحك",
    "وكميكي ماوس، تملئين حياتي بالسحر",
    "في عيد ميلادك، أهديك كل الحب",
    "وأتمنى لك السعادة في كل يوم",
    "أنت الوردة في بستان حياتي",
    "وأنت النجمة التي تضيء دربي",
    "كل عام وأنت بألف خير حبيبتي",
    "من قلب بلال المحب إلى الأبد"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-2xl border border-pink-200"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-4"
          >
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-gray-700 font-medium">From Bilal with Love</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>
            قصيدة هاجر الحبيبة
          </h2>
          <p className="text-gray-600">A Romantic Poem for Beloved Hajar</p>
        </div>

        <div className="space-y-4 text-center">
          {poemLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium" dir="rtl">
                {line}
              </p>
              
              {index < poemLines.length - 1 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mt-4"
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-8 pt-8 border-t border-pink-200"
        >
          <p className="text-gray-600 italic">
            "Just like Tom and Jerry chase each other, Mickey Mouse spreads magic, <br />
            my love for you grows stronger every day. Happy Birthday, my darling Hajar!"
          </p>
          <div className="flex justify-center space-x-4 mt-4 text-2xl">
            <span>🐱</span>
            <span>🐭</span>
            <span>✨</span>
            <span>💕</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ArabicPoem;
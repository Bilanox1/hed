import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  const slides = [
    {
      title: "Tom & Jerry Adventures",
      description: "Just like Tom and Jerry, we have our playful moments and endless adventures together!",
      image: "https://images.pexels.com/photos/1666032/pexels-photo-1666032.jpeg?auto=compress&cs=tinysrgb&w=800",
      character: "🐱🐭"
    },
    {
      title: "Mickey Mouse Magic",
      description: "You bring the same joy and magic to my life that Mickey Mouse brings to the world!",
      image: "https://images.pexels.com/photos/1772973/pexels-photo-1772973.jpeg?auto=compress&cs=tinysrgb&w=800",
      character: "🐭✨"
    },
    {
      title: "Our Love Story",
      description: "Every day with you is like a beautiful cartoon filled with love, laughter, and endless happiness!",
      image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
      character: "💕"
    },
    {
      title: "Birthday Wishes",
      description: "May your special day be as wonderful and magical as your favorite cartoon characters!",
      image: "https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800",
      character: "🎂🎉"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
      >
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <div className="relative h-64 md:h-80 lg:h-96">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{slide.character}</span>
                      <h3 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'Dancing Script, cursive' }}>
                        {slide.title}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-200 max-w-2xl">
                      {slide.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </motion.div>
      
      <style jsx global>{`
        .slick-dots {
          bottom: -50px;
        }
        .slick-dots li button:before {
          color: #ec4899;
          font-size: 12px;
        }
        .slick-dots li.slick-active button:before {
          color: #be185d;
        }
        .slick-prev:before,
        .slick-next:before {
          color: #ec4899;
          font-size: 20px;
        }
        .slick-prev {
          left: -40px;
        }
        .slick-next {
          right: -40px;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;
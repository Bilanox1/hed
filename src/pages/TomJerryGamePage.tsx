import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home, Play, Pause, RotateCcw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Position {
  x: number;
  y: number;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
}

const TomJerryGamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const animationRef = useRef<number>();

  const [jerry, setJerry] = useState<GameObject>({
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    vx: 0,
    vy: 0
  });

  const [tom, setTom] = useState<GameObject>({
    x: 200,
    y: 300,
    width: 40,
    height: 40,
    vx: 1,
    vy: 0
  });

  const [cheese, setCheese] = useState<Position[]>([
    { x: 150, y: 280 },
    { x: 400, y: 200 },
    { x: 300, y: 350 }
  ]);

  const [mickey, setMickey] = useState<Position>({ x: 500, y: 150 });
  const [platforms] = useState<GameObject[]>([
    { x: 0, y: 380, width: 800, height: 20, vx: 0, vy: 0 },
    { x: 150, y: 300, width: 100, height: 20, vx: 0, vy: 0 },
    { x: 350, y: 220, width: 100, height: 20, vx: 0, vy: 0 },
    { x: 500, y: 170, width: 100, height: 20, vx: 0, vy: 0 }
  ]);

  const resetGame = useCallback(() => {
    setJerry({ x: 50, y: 300, width: 30, height: 30, vx: 0, vy: 0 });
    setTom({ x: 200, y: 300, width: 40, height: 40, vx: 1, vy: 0 });
    setCheese([
      { x: 150, y: 280 },
      { x: 400, y: 200 },
      { x: 300, y: 350 }
    ]);
    setMickey({ x: 500, y: 150 });
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setGameRunning(false);
  }, []);

  const checkCollision = useCallback((rect1: GameObject, rect2: GameObject | Position) => {
    return rect1.x < rect2.x + (rect2.width || 20) &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + (rect2.height || 20) &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with cartoon sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    const time = Date.now() * 0.001;
    for (let i = 0; i < 3; i++) {
      const x = (100 + i * 200 + time * 10) % (canvas.width + 100);
      const y = 50 + Math.sin(time + i) * 10;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
      ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw platforms
    platforms.forEach(platform => {
      const platformGradient = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.height);
      platformGradient.addColorStop(0, '#8B4513');
      platformGradient.addColorStop(1, '#A0522D');
      ctx.fillStyle = platformGradient;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add grass on top
      ctx.fillStyle = '#228B22';
      ctx.fillRect(platform.x, platform.y - 5, platform.width, 5);
    });

    // Draw Jerry (mouse)
    ctx.save();
    ctx.translate(jerry.x + jerry.width/2, jerry.y + jerry.height/2);
    
    // Jerry's body
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Jerry's ears
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(-8, -8, 6, 0, Math.PI * 2);
    ctx.arc(8, -8, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Jerry's eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-4, -2, 2, 0, Math.PI * 2);
    ctx.arc(4, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Jerry's whiskers
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-8, 0);
    ctx.moveTo(8, 0);
    ctx.lineTo(15, 0);
    ctx.stroke();
    
    ctx.restore();

    // Draw Tom (cat)
    ctx.save();
    ctx.translate(tom.x + tom.width/2, tom.y + tom.height/2);
    
    // Tom's body
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Tom's ears
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.lineTo(-5, -25);
    ctx.lineTo(0, -15);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(5, -25);
    ctx.lineTo(10, -15);
    ctx.fill();
    
    // Tom's eyes
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(-6, -5, 3, 0, Math.PI * 2);
    ctx.arc(6, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Tom's pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-6, -5, 1, 0, Math.PI * 2);
    ctx.arc(6, -5, 1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();

    // Draw cheese
    cheese.forEach(c => {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(c.x, c.y, 20, 20);
      
      // Cheese holes
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(c.x + 5, c.y + 5, 2, 0, Math.PI * 2);
      ctx.arc(c.x + 15, c.y + 12, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Sparkle effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(c.x + 10, c.y + 10, 1, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Mickey Mouse (bonus)
    ctx.save();
    ctx.translate(mickey.x, mickey.y);
    
    // Mickey's head
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Mickey's ears
    ctx.beginPath();
    ctx.arc(-12, -12, 8, 0, Math.PI * 2);
    ctx.arc(12, -12, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Mickey's face
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Mickey's eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-4, -2, 2, 0, Math.PI * 2);
    ctx.arc(4, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Mickey's smile
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 2, 6, 0, Math.PI);
    ctx.stroke();
    
    // Magical sparkles around Mickey
    const sparkleTime = Date.now() * 0.005;
    for (let i = 0; i < 6; i++) {
      const angle = (sparkleTime + i * 60) * Math.PI / 180;
      const radius = 25 + Math.sin(sparkleTime + i) * 5;
      const sparkleX = Math.cos(angle) * radius;
      const sparkleY = Math.sin(angle) * radius;
      
      ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(sparkleTime + i) * 0.3})`;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }, [jerry, tom, cheese, mickey, platforms]);

  const updateGame = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setJerry(currentJerry => {
      let newJerry = { ...currentJerry };
      
      // Apply gravity
      newJerry.vy += 0.5;
      
      // Update position
      newJerry.x += newJerry.vx;
      newJerry.y += newJerry.vy;
      
      // Platform collision
      platforms.forEach(platform => {
        if (checkCollision(newJerry, platform) && newJerry.vy > 0) {
          newJerry.y = platform.y - newJerry.height;
          newJerry.vy = 0;
        }
      });
      
      // Boundary collision
      if (newJerry.x < 0) newJerry.x = 0;
      if (newJerry.x + newJerry.width > 800) newJerry.x = 800 - newJerry.width;
      if (newJerry.y > 400) {
        setGameOver(true);
        setGameRunning(false);
      }
      
      return newJerry;
    });

    setTom(currentTom => {
      let newTom = { ...currentTom };
      
      // Simple AI: move towards Jerry
      if (jerry.x < newTom.x) newTom.vx = -1;
      else if (jerry.x > newTom.x) newTom.vx = 1;
      
      newTom.x += newTom.vx;
      
      // Boundary collision
      if (newTom.x < 0) newTom.x = 0;
      if (newTom.x + newTom.width > 800) newTom.x = 800 - newTom.width;
      
      // Check if Tom catches Jerry
      if (checkCollision(newTom, jerry)) {
        setGameOver(true);
        setGameRunning(false);
      }
      
      return newTom;
    });

    // Check cheese collection
    setCheese(currentCheese => {
      return currentCheese.filter(c => {
        if (checkCollision(jerry, c)) {
          setScore(prev => prev + 100);
          return false;
        }
        return true;
      });
    });

    // Check Mickey bonus
    if (checkCollision(jerry, mickey)) {
      setScore(prev => prev + 500);
      setMickey({ x: Math.random() * 700, y: 100 + Math.random() * 200 });
    }
  }, [gameRunning, gameOver, jerry, tom, platforms, checkCollision]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      setJerry(currentJerry => {
        let newJerry = { ...currentJerry };
        
        switch (e.key) {
          case 'ArrowLeft':
            newJerry.vx = -3;
            break;
          case 'ArrowRight':
            newJerry.vx = 3;
            break;
          case 'ArrowUp':
          case ' ':
            if (newJerry.vy === 0) {
              newJerry.vy = -12;
            }
            break;
        }
        
        return newJerry;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      setJerry(currentJerry => {
        let newJerry = { ...currentJerry };
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          newJerry.vx = 0;
        }
        
        return newJerry;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameRunning]);

  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      drawGame();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameRunning) {
      gameLoop();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameRunning, updateGame, drawGame]);

  const startGame = () => {
    if (gameOver) resetGame();
    setGameRunning(true);
  };

  const pauseGame = () => {
    setGameRunning(false);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Tom & Jerry Adventure
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Help Jerry collect cheese while avoiding Tom! Watch out for Mickey's magical bonuses! 🐭🧀✨
          </p>
          
          <div className="flex justify-center items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-gray-700">Score: {score}</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-700">Level: {level}</span>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={gameRunning ? pauseGame : startGame}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {gameRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{gameRunning ? 'Pause' : 'Start'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-blue-200"
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border border-blue-200 rounded-lg mx-auto block"
          />
          
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Dancing Script, cursive' }}>
                Game Over! 🎮
              </h3>
              <p className="text-gray-600 mb-4">
                Jerry collected {score} points for Hajar!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 mb-4">
            Use arrow keys to move Jerry and SPACE to jump! Collect cheese (100 pts) and find Mickey for bonus points (500 pts)! 🎯
          </p>
          
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all mx-auto"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TomJerryGamePage;
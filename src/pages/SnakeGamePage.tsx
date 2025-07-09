import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Home, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Position {
  x: number;
  y: number;
}

const SnakeGamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number>();

  const gridSize = 20;
  const tileCount = 20;

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
  }, []);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with romantic gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fdf6ff');
    gradient.addColorStop(1, '#fce7f3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }

    // Draw snake with romantic colors
    snake.forEach((segment, index) => {
      const gradient = ctx.createRadialGradient(
        segment.x * gridSize + gridSize/2,
        segment.y * gridSize + gridSize/2,
        0,
        segment.x * gridSize + gridSize/2,
        segment.y * gridSize + gridSize/2,
        gridSize/2
      );
      
      if (index === 0) {
        gradient.addColorStop(0, '#ec4899');
        gradient.addColorStop(1, '#be185d');
      } else {
        gradient.addColorStop(0, '#f9a8d4');
        gradient.addColorStop(1, '#ec4899');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      
      // Add sparkle effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, 4, 4);
    });

    // Draw food as a heart
    ctx.save();
    ctx.translate(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2);
    ctx.fillStyle = '#ef4444';
    ctx.font = `${gridSize-4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♥', 0, 0);
    ctx.restore();

    // Add floating hearts around food
    const time = Date.now() * 0.002;
    for (let i = 0; i < 3; i++) {
      const angle = (time + i * 120) * Math.PI / 180;
      const radius = 15 + Math.sin(time + i) * 5;
      const x = food.x * gridSize + gridSize/2 + Math.cos(angle) * radius;
      const y = food.y * gridSize + gridSize/2 + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(244, 63, 94, ${0.3 + Math.sin(time + i) * 0.2})`;
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♥', 0, 0);
      ctx.restore();
    }
  }, [snake, food]);

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(current => current + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, gameRunning, gameOver, food, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      switch (e.key) {
        case 'ArrowUp':
          setDirection(current => current.y !== 1 ? { x: 0, y: -1 } : current);
          break;
        case 'ArrowDown':
          setDirection(current => current.y !== -1 ? { x: 0, y: 1 } : current);
          break;
        case 'ArrowLeft':
          setDirection(current => current.x !== 1 ? { x: -1, y: 0 } : current);
          break;
        case 'ArrowRight':
          setDirection(current => current.x !== -1 ? { x: 1, y: 0 } : current);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning]);

  useEffect(() => {
    if (gameRunning) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameRunning, moveSnake]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  const startGame = () => {
    if (gameOver) resetGame();
    setGameRunning(true);
    setDirection({ x: 1, y: 0 });
  };

  const pauseGame = () => {
    setGameRunning(false);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Hearts Game for Hajar
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Collect hearts and grow your love snake! 🐍💕
          </p>
          
          <div className="flex justify-center items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="font-bold text-gray-700">Score: {score}</span>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={gameRunning ? pauseGame : startGame}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
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
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-pink-200"
        >
          <canvas
            ref={canvasRef}
            width={tileCount * gridSize}
            height={tileCount * gridSize}
            className="border border-pink-200 rounded-lg mx-auto block"
          />
          
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-6 p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border border-pink-200"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Dancing Script, cursive' }}>
                Game Over! 💔
              </h3>
              <p className="text-gray-600 mb-4">
                You collected {score} hearts for Hajar!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
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
            Use arrow keys to move. Collect hearts to grow your snake! 🎮
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

export default SnakeGamePage;
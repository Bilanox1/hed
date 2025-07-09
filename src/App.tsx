import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import SnakeGamePage from './pages/SnakeGamePage';
import TomJerryGamePage from './pages/TomJerryGamePage';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <Navigation />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/snake-game" element={<SnakeGamePage />} />
            <Route path="/tom-jerry-game" element={<TomJerryGamePage />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
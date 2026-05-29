import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Leaderboard } from './components/Leaderboard';
import closedChest from './assets/treasure_closed.png';
import treasureChest from './assets/treasure_opened.png';
import skeletonChest from './assets/treasure_opened_skeleton.png';
import keyImage from './assets/key.png';
import chestOpenSound from './audios/chest_open.mp3';
import evilLaughSound from './audios/chest_open_with_evil_laugh.mp3';

interface Box {
  id: number;
  isOpen: boolean;
  hasTreasure: boolean;
  scoreAwarded?: number;
}

export default function App() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  const startTimeRef = useRef<number | null>(null);

  const initializeGame = () => {
    const treasureBoxIndex = Math.floor(Math.random() * 3);
    const newBoxes: Box[] = Array.from({ length: 3 }, (_, index) => ({
      id: index,
      isOpen: false,
      hasTreasure: index === treasureBoxIndex,
    }));
    setBoxes(newBoxes);
    setScore(0);
    setGameEnded(false);
    setPlayerName('');
    setNameSaved(false);
    startTimeRef.current = null;
  };

  useEffect(() => { initializeGame(); }, []);

  const saveScore = () => {
    const name = playerName.trim() || '匿名玩家';
    const existing: { username: string; score: number; date: string }[] = JSON.parse(
      localStorage.getItem('leaderboard') ?? '[]'
    );
    existing.push({ username: name, score, date: new Date().toLocaleDateString('zh-TW') });
    existing.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(existing.slice(0, 20)));
    setNameSaved(true);
  };

  const openBox = (boxId: number) => {
    if (gameEnded) return;
    const clickedBox = boxes.find((b) => b.id === boxId);
    if (!clickedBox || clickedBox.isOpen) return;

    if (startTimeRef.current === null) startTimeRef.current = Date.now();
    new Audio(clickedBox.hasTreasure ? chestOpenSound : evilLaughSound).play();

    const TREASURE_SCORES = [150, 80, 45];
    const SKELETON_SCORE = -50;

    setBoxes((prevBoxes) => {
      const attempt = prevBoxes.filter((b) => b.isOpen).length;
      const updatedBoxes = prevBoxes.map((box) => {
        if (box.id === boxId && !box.isOpen) {
          const scoreAwarded = box.hasTreasure ? TREASURE_SCORES[attempt] : SKELETON_SCORE;
          setScore((prev) => prev + scoreAwarded);
          return { ...box, isOpen: true, scoreAwarded };
        }
        return box;
      });
      const treasureFound = updatedBoxes.some((box) => box.isOpen && box.hasTreasure);
      const allOpened = updatedBoxes.every((box) => box.isOpen);
      if (treasureFound || allOpened) setGameEnded(true);
      return updatedBoxes;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">

      {/* Header */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          className="border-amber-400 text-amber-800 hover:bg-amber-100"
          onClick={() => setShowLeaderboard(true)}
        >
          🏆 排行榜
        </Button>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-4 text-amber-900">🏴‍☠️ Treasure Hunt Game 🏴‍☠️</h1>
        <p className="text-amber-800 mb-4">Click on the treasure chests to discover what's inside!</p>
        <p className="text-amber-700 text-sm">💰 1st: +$150 &nbsp;|&nbsp; 2nd: +$80 &nbsp;|&nbsp; 3rd: +$45 &nbsp;|&nbsp; 💀 Skeleton: -$50</p>
      </div>

      {/* Score */}
      <div className="mb-8 flex items-center gap-6">
        <div className="text-2xl text-center p-4 bg-amber-200/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-400">
          <span className="text-amber-900">Current Score: </span>
          <span className={score >= 0 ? 'text-green-600' : 'text-red-600'}>${score}</span>
        </div>
        {gameEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className={`text-3xl font-bold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-amber-600'}`}
          >
            {score > 0 ? '贏！' : score < 0 ? '輸！' : '平手！'}
          </motion.div>
        )}
      </div>

      {/* Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {boxes.map((box) => (
          <motion.div
            key={box.id}
            className="flex flex-col items-center"
            style={{ cursor: box.isOpen ? 'default' : `url(${keyImage}) 8 40, pointer` }}
            whileHover={{ scale: box.isOpen ? 1 : 1.05 }}
            whileTap={{ scale: box.isOpen ? 1 : 0.95 }}
            onClick={() => openBox(box.id)}
          >
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: box.isOpen ? 180 : 0, scale: box.isOpen ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative"
            >
              <img
                src={box.isOpen ? (box.hasTreasure ? treasureChest : skeletonChest) : closedChest}
                alt={box.isOpen ? (box.hasTreasure ? 'Treasure!' : 'Skeleton!') : 'Treasure Chest'}
                className="w-48 h-48 object-contain drop-shadow-lg"
              />
              {box.isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                >
                  {box.hasTreasure ? (
                    <div className="text-2xl animate-bounce">✨💰✨</div>
                  ) : (
                    <div className="text-2xl animate-pulse">💀👻💀</div>
                  )}
                </motion.div>
              )}
            </motion.div>
            <div className="mt-4 text-center">
              {box.isOpen ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className={`text-lg p-2 rounded-lg ${
                    box.hasTreasure
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {box.scoreAwarded !== undefined
                    ? `${box.scoreAwarded > 0 ? '+' : ''}$${box.scoreAwarded}`
                    : ''}
                </motion.div>
              ) : (
                <div className="text-amber-700 p-2">Click to open!</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Over */}
      {gameEnded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 p-6 bg-amber-200/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-amber-400">
            <h2 className="text-2xl mb-2 text-amber-900">Game Over!</h2>
            <p className="text-lg text-amber-800">
              Final Score:{' '}
              <span className={score >= 0 ? 'text-green-600' : 'text-red-600'}>${score}</span>
            </p>
            <p className="text-sm text-amber-600 mt-2">
              {boxes.some((box) => box.isOpen && box.hasTreasure)
                ? 'Treasure found! Well done, treasure hunter! 🎉'
                : 'No treasure found this time! Better luck next time! 💀'}
            </p>

            {!nameSaved ? (
              <div className="mt-4 flex items-center gap-2 justify-center">
                <Input
                  className="max-w-[160px] border-amber-400 text-sm"
                  placeholder="輸入名字（可選）"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveScore()}
                  maxLength={20}
                />
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={saveScore}
                >
                  儲存分數
                </Button>
              </div>
            ) : (
              <p className="text-xs text-green-600 mt-3">✓ 分數已儲存至排行榜</p>
            )}
          </div>
          <Button
            onClick={initializeGame}
            className="text-lg px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white"
          >
            Play Again
          </Button>
        </motion.div>
      )}

      <Leaderboard open={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
}

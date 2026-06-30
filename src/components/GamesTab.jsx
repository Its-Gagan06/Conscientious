import React, { useState, useEffect } from 'react';
import { Loader2, Gamepad2, Trophy, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GamesTab({ user, setUser }) {
  const [activeGame, setActiveGame] = useState(null); // 'daily' | 'trivia' | null
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Trivia progress
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Daily status
  const [dailyCompleted, setDailyCompleted] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const completed = localStorage.getItem(`daily_quiz_${user.id}_${today}`);
    if (completed) {
      setDailyCompleted(true);
    }
  }, [user.id]);

  const addPoints = (points) => {
    const updatedUser = { ...user, points: (user.points || 0) + points };
    setUser(updatedUser);
    localStorage.setItem('community_user', JSON.stringify(updatedUser));
  };

  const startDailyQuiz = async () => {
    setLoading(true);
    setActiveGame('daily');
    try {
      const response = await fetch('/api/trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'hard', count: 1 })
      });
      const data = await response.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowResult(false);
      }
    } catch (e) {
      console.error(e);
      setActiveGame(null);
    } finally {
      setLoading(false);
    }
  };

  const startTrivia = async () => {
    setLoading(true);
    setActiveGame('trivia');
    setAttemptedCount(0);
    setCorrectCount(0);
    fetchMoreTrivia();
  };

  const fetchMoreTrivia = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'general', count: 5 })
      });
      const data = await response.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowResult(false);
      }
    } catch (e) {
      console.error(e);
      setActiveGame(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);

    const isCorrect = option === questions[currentIndex].answer;
    
    if (activeGame === 'daily') {
      const today = new Date().toDateString();
      localStorage.setItem(`daily_quiz_${user.id}_${today}`, 'true');
      setDailyCompleted(true);
      if (isCorrect) {
        addPoints(5);
        setScore(5);
      } else {
        setScore(0);
      }
    } else if (activeGame === 'trivia') {
      const newAttempted = attemptedCount + 1;
      const newCorrect = correctCount + (isCorrect ? 1 : 0);
      setAttemptedCount(newAttempted);
      setCorrectCount(newCorrect);

      if (newAttempted % 20 === 0) {
        if (newCorrect === 20) {
          addPoints(2);
        } else {
          addPoints(1);
        }
        setCorrectCount(0); // reset correct count for next 20
      }
    }
  };

  const handleNext = () => {
    if (activeGame === 'daily') {
      setActiveGame(null);
    } else {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        fetchMoreTrivia();
      }
    }
  };

  if (activeGame) {
    if (loading && questions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 h-64">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
          <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
        </div>
      );
    }

    const q = questions[currentIndex];
    if (!q) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {activeGame === 'daily' ? 'Daily Hard Quiz' : `Question ${attemptedCount + 1}`}
          </span>
          <button onClick={() => setActiveGame(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium">Exit Game</button>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
          {q.question}
        </h3>

        <div className="space-y-3 mb-6">
          {q.options.map((opt, i) => {
            let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
            if (showResult) {
              if (opt === q.answer) {
                btnClass += "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800 text-green-700 dark:text-green-300";
              } else if (opt === selectedOption) {
                btnClass += "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800 text-red-700 dark:text-red-300";
              } else {
                btnClass += "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50";
              }
            } else {
              btnClass += "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300";
            }

            return (
              <button 
                key={i}
                disabled={showResult}
                onClick={() => handleOptionSelect(opt)}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {showResult && opt === q.answer && <CheckCircle2 size={18} className="text-green-500" />}
                  {showResult && opt === selectedOption && opt !== q.answer && <XCircle size={18} className="text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300"><span className="font-bold">Explanation:</span> {q.explanation}</p>
            </div>
            
            {activeGame === 'daily' && (
              <div className="text-center mb-6">
                {selectedOption === q.answer ? (
                  <p className="text-green-600 dark:text-green-400 font-bold text-lg">Awesome! You earned +5 points.</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Tough luck! Try again tomorrow.</p>
                )}
              </div>
            )}
            
            {activeGame === 'trivia' && (
               <div className="flex justify-between items-center px-2 mb-6 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Streak: <span className="font-bold text-blue-600 dark:text-blue-400">{correctCount}</span></span>
                  <span className="text-gray-600 dark:text-gray-400">Attempted: <span className="font-bold text-gray-900 dark:text-gray-100">{attemptedCount}</span></span>
               </div>
            )}

            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (activeGame === 'daily' ? 'Finish' : 'Next Question')}
              {!loading && activeGame !== 'daily' && <ArrowRight size={18} />}
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Trophy size={24} /> Play & Earn</h2>
        <p className="text-blue-100 text-sm mb-4">Complete daily challenges and trivia games to earn points and climb the community leaderboard.</p>
        <div className="flex gap-4">
           <div className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium">Your Points: {user.points || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Daily Quiz Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-start gap-4 relative overflow-hidden">
          {dailyCompleted && (
            <div className="absolute inset-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full font-bold text-green-600 dark:text-green-400 shadow-sm flex items-center gap-2">
                 <CheckCircle2 size={18} /> Completed Today
              </div>
            </div>
          )}
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl text-orange-600 dark:text-orange-400">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Hard Quiz</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Answer 1 tough question to earn 5 points.</p>
          </div>
          <button 
            onClick={startDailyQuiz}
            disabled={dailyCompleted || loading}
            className="mt-2 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
          >
            Play Daily Quiz (+5 pts)
          </button>
        </div>

        {/* Trivia Game Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
            <Gamepad2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Guess the Answer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Answer trivia questions. 20 correct = 2 pts. Just attempting 20 = 1 pt.</p>
          </div>
          <button 
            onClick={startTrivia}
            disabled={loading}
            className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Play Trivia Game
          </button>
        </div>
      </div>
    </div>
  );
}

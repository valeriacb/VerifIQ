import React, { useState } from 'react';
import { Trophy, XCircle, CheckCircle, Lightbulb, Newspaper,BadgeEuro,HeartPulse,ShieldCheck,Users, Star} from 'lucide-react';
import {newsCategories} from "./data.js";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentNews, setCurrentNews] = useState(0);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [roundPoints, setRoundPoints] = useState<number | null>(null);
  const [showBonusQuestion, setShowBonusQuestion] = useState(false);
  const [selectedBonusAnswers, setSelectedBonusAnswers] = useState<string[]>([]);
  const [bonusQuestion, setBonusQuestion] = useState<{ question: string; options: string[]; correctAnswers: string[] } | null>(null);

  const icons:string[] = [Newspaper, HeartPulse, Users,BadgeEuro,ShieldCheck, Star ];


  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-500 to-yellow-600 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4 bg-white border-2 border-red-500 rounded-xl px-4 py-2 shadow-lg text-red-500 font-bold text-lg">
        Coins : {points}
      </div>
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Alege Domeniul</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(newsCategories).map(([key, category], index) => {
  const IconComponent = icons[index % icons.length]; // Selectarea icoanei ciclic
  
  return (
    <button
      key={key}
      onClick={() => setSelectedCategory(key)}
      className="bg-white border-2 border-red-500 rounded-xl p-6 text-center hover:bg-red-50 transition-colors"
    >
      <IconComponent className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
      <p className="text-gray-600 text-sm">{category.description}</p>
    </button>
  );
})}
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = newsCategories[selectedCategory as keyof typeof newsCategories];
  const currentItem = currentCategory.items[currentNews];

  const handleGuess = (guess: boolean) => {
    const isCorrect = guess === currentItem.isTrue;
    setAnswered(isCorrect);
    setShowExplanation(true);
  
    if (isCorrect) {
      const earnedPoints = 1;
      const earnedScore = 1;
      setScore(prevScore => prevScore + earnedScore);
      setRoundPoints(earnedPoints);
      setPoints(prevPoints => prevPoints + earnedPoints);
  
      if (!currentItem.isTrue && currentItem.bonusQuestion) {
        // Show bonus question for false articles
        setBonusQuestion({
          question: currentItem.bonusQuestion.question,
          options: currentItem.bonusQuestion.options,
          correctAnswers: currentItem.correctAnswers,
        });
        setShowBonusQuestion(true);
        return;  // Prevent moving to the next article immediately
      }
    }
  
    // Move to the next article even if the guess was incorrect
    setTimeout(() => {
      if (currentNews < currentCategory.items.length - 1) {
        setCurrentNews(currentNews + 1);
        setAnswered(null);
        setShowExplanation(false);
        setShowHints(false);
      } else {
        setGameOver(true);
      }
    }, 5000);  // Always move to the next question after 5 seconds
  
    setTimeout(() => {
      setRoundPoints(null);
    }, 1000);
  };
  
  
  const submitBonusQuestion = () => {
    if (!bonusQuestion) return;
  
    // Count correct selections from the selected answers
    const correctSelections = selectedBonusAnswers.filter(answer =>
      bonusQuestion.correctAnswers.includes(answer)
    ).length;
  
    let earnedBonus = 0;
    if (correctSelections === bonusQuestion.correctAnswers.length) {
      earnedBonus = 2;  // Full bonus points
    } else if (correctSelections > 0) {
      earnedBonus = 1;  // Partial bonus points
    }
  
    // Calculate total points for this round (regular + bonus)
    const totalRoundPoints = 1 + earnedBonus;
    setRoundPoints(totalRoundPoints);
  
    setPoints(prevPoints => prevPoints + totalRoundPoints);
    setScore(prevScore => prevScore + totalRoundPoints);
  
    setBonusQuestion(null);
    setShowBonusQuestion(false);
    setSelectedBonusAnswers([]);
  
    // Clear animation after showing earned points
    setTimeout(() => {
      setRoundPoints(null);
    }, 1000);
  
    // Add a delay of 5 seconds AFTER the bonus question is answered for false articles
    setTimeout(() => {
      if (currentNews < currentCategory.items.length - 1) {
        setCurrentNews(currentNews + 1);
        setAnswered(null);
        setShowExplanation(false);
        setShowHints(false);
      } else {
        setGameOver(true);
      }
    }, 5000);  // 5-second delay after bonus question
  };   
  
  const resetGame = () => {
    setSelectedCategory(null);
    setCurrentNews(0);
    setScore(0);
    setPoints(points);
    setAnswered(null);
    setShowExplanation(false);
    setGameOver(false);
    setShowHints(false);
    setShowBonusQuestion(false);
    setSelectedBonusAnswers([]);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-500 to-yellow-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold mb-4">Joc Terminat!</h2>
          <p className="text-xl mb-4">Scorul tău final: {score}/{currentCategory.items.length}</p>
          <p className="text-xl mb-4">Coins totale: {points}</p>
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Joacă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-yellow-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={resetGame} className="text-red-500 hover:text-red-600 font-semibold">
              ← Schimbă categoria
            </button>
            <h1 className="text-2xl font-bold">{currentCategory.name}</h1>
          </div>
          <div className="relative">
            <div className="text-red-500 font-bold text-lg">Scor: {score}</div>
            {roundPoints !== null && (
    <span className="absolute -top-2 -right-2 text-green-500 font-bold text-xl animate-bounce transition-opacity duration-1000 ease-in-out">
      +{roundPoints}
    </span> 
  )}
          <div className="text-red-500 font-bold text-lg">Coins: {points}</div>
          </div>
        </div>

        <div className="space-y-6">
          <img
            src={currentItem.image}
            alt="News illustration"
            className="w-full h-64 object-cover rounded-lg"
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{currentItem.title}</h2>
            <p className="text-gray-600 leading-relaxed">{currentItem.description}</p>
          </div>

          {!showExplanation && (
            <>
              <div className="flex gap-4">
                <button
                  onClick={() => handleGuess(true)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Adevărat
                </button>
                <button
                  onClick={() => handleGuess(false)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Fals
                </button>
              </div>

              {currentItem.hints && currentItem.hints.length > 0 && (
                <>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors mx-auto"
                  >
                    <Lightbulb className="w-8 h-8" />
                    <span>{showHints ? 'Ascunde indiciile' : 'Arată indiciile'}</span>
                  </button>

                  {showHints && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Indicii:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {currentItem.hints.map((hint, index) => (
                          <li key={index} className="text-gray-700">{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {showBonusQuestion && bonusQuestion && (
            <div className="bg-red-50 p-4 rounded-lg shadow-lg mt-4">
              <h3 className="font-semibold mb-2">{bonusQuestion.question}</h3>
              <div className="grid gap-2">
                {bonusQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-2 bg-white p-2 rounded-md shadow cursor-pointer">
                    <input
                      type="checkbox"
                      value={option}
                      checked={selectedBonusAnswers.includes(option)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedBonusAnswers(prev =>
                          prev.includes(value) ? prev.filter(ans => ans !== value) : [...prev, value]
                        );
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
              <button
                onClick={submitBonusQuestion}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Trimite răspunsurile
              </button>
            </div>
          )}

          {showExplanation && (
            <div className={`p-4 rounded-lg ${answered ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                {answered ? (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                ) : (
                  <XCircle className="text-red-500 w-6 h-6" />
                )}
                <span className="font-semibold">
                  {answered ? 'Corect!' : 'Greșit!'}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{currentItem.explanation}</p>
            </div>
          )}

          <div className="flex items-center gap-2 w-full">
            <span className="text-gray-700 font-semibold">
              {currentNews + 1}/{currentCategory.items.length}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 relative">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentNews + 1) / currentCategory.items.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
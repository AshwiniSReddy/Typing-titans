

'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingTestScreenProps {
  username: string;
  onTestComplete: (wpm: number, accuracy: number) => void;
}

export function TypingTestScreen({ username, onTestComplete }: TypingTestScreenProps) {
  const [time, setTime] = useState(60);
  const [wordsPerMin, setWordsPerMin] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [inputText, setInputText] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const correctCharactersRef = useRef(0);
  const totalCharactersRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [hasTestEnded, setHasTestEnded] = useState(false);

  const sampleText = "Every keystroke pushes you closer to your goal. Fingers dance across the keys, creating words, and words become sentences. Speed and accuracy are essential as your rhythm builds. The challenge? A race to type faster and more precisely, whether aiming for 50 WPM or the world record of 216 WPM.";
  const words = useMemo(() => sampleText.split(' '), [sampleText]);

  const getHighlightedText = useCallback(() => {
    const typedWords = inputText.split(' ');

    return words.map((word, index) => {
      const isCurrentWord = index === currentWordIndex;
      const isTypedWord = index < currentWordIndex;
      const typedWord = typedWords[index] || '';
      const isCorrectWord = typedWord === word;

      let className = '';
      if (isCurrentWord) {
        className = 'bg-yellow-200';
      } else if (isTypedWord) {
        className = isCorrectWord ? 'text-green-600' : 'text-red-600';
      }

      return (
        <span key={index} className={className}>
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      );
    });
  }, [words, currentWordIndex, inputText]);

  const calculateMetrics = useCallback(() => {
    if (startTimeRef.current) {
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      if (elapsedSeconds > 0) {
        const calculatedWPM = Math.round((correctCharactersRef.current / 5) / (elapsedSeconds / 60));
        setWordsPerMin(calculatedWPM);
      }
    }

    if (totalCharactersRef.current > 0) {
      const calculatedAccuracy = Math.round((correctCharactersRef.current / totalCharactersRef.current) * 100);
      setAccuracy(calculatedAccuracy);
    } else {
      setAccuracy(100);
    }
  }, []);

  const endTest = useCallback(() => {
    if (hasTestEnded) return;
    setHasTestEnded(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const elapsedSeconds = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
    const finalWPM = correctCharactersRef.current > 0 ? Math.round((correctCharactersRef.current / 5) / (elapsedSeconds / 60)) : 0;
    const finalAccuracy = totalCharactersRef.current > 0 ? Math.round((correctCharactersRef.current / totalCharactersRef.current) * 100) : 100;

    setWordsPerMin(finalWPM);
    setAccuracy(finalAccuracy);

    setTimeout(() => {
      onTestComplete(finalWPM, finalAccuracy);
    }, 0);
  }, [hasTestEnded, onTestComplete]);

  useEffect(() => {
    if (currentWordIndex === words.length - 1 && !hasTestEnded) {
      endTest();
    }
  }, [currentWordIndex, words.length, hasTestEnded, endTest]);

  useEffect(() => {
    if (time === 0 && !hasTestEnded) {
      endTest();
    }
  }, [time, hasTestEnded, endTest]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInputText = e.target.value;
    setInputText(newInputText);
  
    if (!isTestActive) {
      setIsTestActive(true);
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            endTest();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  
    const typedWords = newInputText.trim().split(' ');
    const newCurrentWordIndex = Math.min(typedWords.length - 1, words.length - 1);
    setCurrentWordIndex(newCurrentWordIndex);
  
    let correctCount = 0;
    let totalCount = 0;
  
    for (let i = 0; i < typedWords.length; i++) {
      const typedWord = typedWords[i];
      const targetWord = words[i] || '';
  
      totalCount += typedWord.length;
  
      for (let j = 0; j < Math.min(typedWord.length, targetWord.length); j++) {
        if (typedWord[j] === targetWord[j]) {
          correctCount++;
        }
      }
  
      if (i < typedWords.length - 1) {
        totalCount++;
      }
    }
  
    correctCharactersRef.current = correctCount;
    totalCharactersRef.current = totalCount;
  
    // Call calculateMetrics here for dynamic updates
    calculateMetrics();
  
    if (newCurrentWordIndex === words.length - 1) {
      endTest();
    }
  }, [words, isTestActive, endTest, calculateMetrics]);
  

  useEffect(() => {
    if (isTestActive) {
      calculateMetrics();
    }
  }, [isTestActive, calculateMetrics]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <motion.div 
            className="bg-white p-4 rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="text-3xl font-bold text-teal-600">{time}</div>
            <div className="text-sm text-gray-600">seconds</div>
          </motion.div>
          <motion.div 
            className="bg-white p-4 rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold text-teal-600">{wordsPerMin}</div>
            <div className="text-sm text-gray-600">words/min</div>
          </motion.div>
          <motion.div 
            className="bg-white p-4 rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-bold text-teal-600">{accuracy}</div>
            <div className="text-sm text-gray-600">% accuracy</div>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-lg text-gray-800 mb-4 leading-relaxed">
            {getHighlightedText()}
          </p>
        </motion.div>

        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <textarea
            className="w-full h-32 p-4 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Start typing..."
          />
        </motion.div>
      </div>
    </div>
  );
}

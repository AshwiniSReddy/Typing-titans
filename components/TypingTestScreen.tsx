// 'use client'

// import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
// import { motion } from 'framer-motion'

// interface TypingTestScreenProps {
//   username: string;
//   onTestComplete: (wpm: number, accuracy: number) => void;
// }

// export function TypingTestScreen({ username, onTestComplete }: TypingTestScreenProps) {
//   const [time, setTime] = useState(60)
//   const [wordsPerMin, setWordsPerMin] = useState(0)
//   const [accuracy, setAccuracy] = useState(100)
//   const [inputText, setInputText] = useState('')
//   const [isTestActive, setIsTestActive] = useState(false)
//   const [currentWordIndex, setCurrentWordIndex] = useState(0)
//   const [correctCharacters, setCorrectCharacters] = useState(0)
//   const [totalCharacters, setTotalCharacters] = useState(0)
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)
//   const startTimeRef = useRef<number | null>(null)

//   const sampleText = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow. Two driven jocks help fax my big quiz."
//   const words = useMemo(() => sampleText.split(' '), [sampleText])

//   const getHighlightedText = useCallback(() => {
//     const typedWords = inputText.split(' ')
    
//     return words.map((word, index) => {
//       const isCurrentWord = index === currentWordIndex
//       const isTypedWord = index < currentWordIndex
//       const typedWord = typedWords[index] || ''
//       const isCorrectWord = typedWord === word

//       let className = ''
//       if (isCurrentWord) {
//         className = 'bg-yellow-200'
//       } else if (isTypedWord) {
//         className = isCorrectWord ? 'text-green-600' : 'text-red-600'
//       }

//       return (
//         <span key={index} className={className}>
//           {word}
//           {index < words.length - 1 ? ' ' : ''}
//         </span>
//       )
//     })
//   }, [words, currentWordIndex, inputText])

//   const calculateMetrics = useCallback(() => {
//     if (startTimeRef.current) {
//       const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000
//       if (elapsedSeconds > 0) {
//         const calculatedWPM = Math.round((totalCharacters / 5) / (elapsedSeconds / 60))
//         setWordsPerMin(calculatedWPM)
//       }
//     }

//     if (totalCharacters > 0) {
//       const calculatedAccuracy = Math.round((correctCharacters / totalCharacters) * 100)
//       setAccuracy(calculatedAccuracy)
//     } else {
//       setAccuracy(100)
//     }
//   }, [totalCharacters, correctCharacters])

//   const endTest = useCallback(() => {
//     setIsTestActive(false)
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current)
//     }
//     calculateMetrics()
//     onTestComplete(wordsPerMin, accuracy)
//   }, [calculateMetrics, onTestComplete, wordsPerMin, accuracy])

//   // useEffect(() => {
//   //   const timer = setTimeout(() => {
//   //     setIsTestActive(true)
//   //     startTimeRef.current = Date.now()
//   //     intervalRef.current = setInterval(() => {
//   //       setTime((prevTime) => {
//   //         if (prevTime <= 1) {
//   //           clearInterval(intervalRef.current as NodeJS.Timeout)  // Stop interval
//   //           endTest()
//   //           return 0
//   //         }
//   //         return prevTime - 1
//   //       })
//   //       calculateMetrics()
//   //     }, 1000)
//   //   }, 0)

//   //   return () => {
//   //     clearTimeout(timer)
//   //     if (intervalRef.current) {
//   //       clearInterval(intervalRef.current)
//   //     }
//   //   }
//   // }, [calculateMetrics, endTest])


//   useEffect(() => {
//     if (isTestActive) {
//       const timer = setTimeout(() => {
//         startTimeRef.current = Date.now();
//         intervalRef.current = setInterval(() => {
//           setTime((prevTime) => {
//             if (prevTime <= 1) {
//               clearInterval(intervalRef.current as NodeJS.Timeout);  // Stop interval
//               endTest();
//               return 0;
//             }
//             return prevTime - 1;
//           });
//           calculateMetrics();
//         }, 1000);
//       }, 0);
  
//       return () => {
//         clearTimeout(timer);
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//         }
//       };
//     }
//   }, [isTestActive, calculateMetrics, endTest]);
  

//   // const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//   //   if (isTestActive) {
//   //     const newInputText = e.target.value;
//   //     setInputText(newInputText);
  
//   //     const typedWords = newInputText.trim().split(' ');
//   //     const newCurrentWordIndex = Math.min(typedWords.length - 1, words.length - 1);
//   //     setCurrentWordIndex(newCurrentWordIndex);
  
//   //     let correct = 0;
//   //     let total = 0;
  
//   //     // Compare each word up to the current word
//   //     for (let i = 0; i <= newCurrentWordIndex; i++) {
//   //       const typedWord = typedWords[i] || '';
//   //       const targetWord = words[i];
  
//   //       // Total characters in the word (including space if not the last word)
//   //       total += targetWord.length;
  
//   //       // Count correct characters in the word
//   //       for (let j = 0; j < targetWord.length; j++) {
//   //         if (typedWord[j] === targetWord[j]) {
//   //           correct++;
//   //         }
//   //       }
  
//   //       // Include space as correct if typedWord is complete and matches
//   //       if (typedWord === targetWord && i < words.length - 1) {
//   //         total++; // Add space character to total
//   //         correct++; // Add space character to correct if matched
//   //       }
//   //     }
  
//   //     setCorrectCharacters(correct);
//   //     setTotalCharacters(total);
  
//   //     // If all words are typed, end the test
//   //     if (newCurrentWordIndex === words.length - 1) {
//   //       setCorrectCharacters(total);
//   //       setTotalCharacters(total);
//   //       setAccuracy(100); // Optional: You can calculate the accuracy here as well
//   //       endTest();
//   //     }
//   //   }
//   // }, [isTestActive, words, endTest]);
  
//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     // Start the timer on the first input
//     if (!isTestActive) {
//       setIsTestActive(true);
//       startTimeRef.current = Date.now();
//       intervalRef.current = setInterval(() => {
//         setTime((prevTime) => {
//           if (prevTime <= 1) {
//             clearInterval(intervalRef.current as NodeJS.Timeout);  // Stop interval
//             endTest();
//             return 0;
//           }
//           return prevTime - 1;
//         });
//         calculateMetrics();
//       }, 1000);
//     }
  
//     const newInputText = e.target.value;
//     setInputText(newInputText);
  
//     const typedWords = newInputText.trim().split(' ');
//     const newCurrentWordIndex = Math.min(typedWords.length - 1, words.length - 1);
//     setCurrentWordIndex(newCurrentWordIndex);
  
//     let correct = 0;
//     let total = 0;
  
//     // Compare each word up to the current word
//     for (let i = 0; i <= newCurrentWordIndex; i++) {
//       const typedWord = typedWords[i] || '';
//       const targetWord = words[i];
  
//       // Total characters in the word (including space if not the last word)
//       total += targetWord.length;
  
//       // Count correct characters in the word
//       for (let j = 0; j < targetWord.length; j++) {
//         if (typedWord[j] === targetWord[j]) {
//           correct++;
//         }
//       }
  
//       // Include space as correct if typedWord is complete and matches
//       if (typedWord === targetWord && i < words.length - 1) {
//         total++; // Add space character to total
//         correct++; // Add space character to correct if matched
//       }
//     }
  
//     setCorrectCharacters(correct);
//     setTotalCharacters(total);
  
//     // If all words are typed, end the test
//     if (newCurrentWordIndex === words.length - 1) {
//       setCorrectCharacters(total);
//       setTotalCharacters(total);
//       setAccuracy(100); // Optional: You can calculate the accuracy here as well
//       endTest();
//     }
//   }, [isTestActive, words, calculateMetrics, endTest]);
  

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="grid grid-cols-3 gap-8 mb-8">
//           <motion.div 
//             className="bg-white p-4 rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-md"
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//           >
//             <div className="text-3xl font-bold text-teal-600">{time}</div>
//             <div className="text-sm text-gray-600">seconds</div>
//           </motion.div>
//           <motion.div 
//             className="bg-white p-4 rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-md"
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.1 }}
//           >
//             <div className="text-3xl font-bold text-teal-600">{wordsPerMin}</div>
//             <div className="text-sm text-gray-600">words/min</div>
//           </motion.div>
//           <motion.div 
//             className="bg-white p-4 rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-md"
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             <div className="text-3xl font-bold text-teal-600">{accuracy}</div>
//             <div className="text-sm text-gray-600">% accuracy</div>
//           </motion.div>
//         </div>

//         <motion.div 
//           className="bg-white p-6 rounded-lg shadow-md mb-6"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//         >
//           <p className="text-lg text-gray-800 mb-4 leading-relaxed">
//             {getHighlightedText()}
//           </p>
//         </motion.div>

//         <motion.div 
//           className="mb-6"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <textarea
//             className="w-full h-32 p-4 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
//             value={inputText}
//             onChange={handleInputChange}
//             placeholder="Start typing..."
            
//           />
//         </motion.div>
//       </div>
//     </div>
//   )
// }

'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
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
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

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
        const calculatedWPM = Math.round((totalCharacters / 5) / (elapsedSeconds / 60));
        setWordsPerMin(calculatedWPM);
      }
    }

    // Calculate accuracy based on total characters and correct characters
    if (totalCharacters > 0) {
      const calculatedAccuracy = Math.round((correctCharacters / totalCharacters) * 100);
      setAccuracy(calculatedAccuracy);
    } else {
      setAccuracy(100); // If no characters typed yet
    }
  }, [totalCharacters, correctCharacters]);

  const endTest = useCallback(() => {
    setIsTestActive(false);
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    
    // Calculate metrics before calling onTestComplete
    const calculatedWPM = Math.round((totalCharacters / 5) / ((Date.now() - startTimeRef.current!) / 1000 / 60));
    const calculatedAccuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 100;
    
    // Pass calculated metrics directly to onTestComplete
    onTestComplete(calculatedWPM, calculatedAccuracy);
}, [totalCharacters, correctCharacters, onTestComplete]);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInputText = e.target.value;
    setInputText(newInputText);

    // Start the timer on the first input
    if (!isTestActive) {
        setIsTestActive(true);
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current as NodeJS.Timeout); // Stop interval
                    endTest();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }

    // Split input into words and determine current word index
    const typedWords = newInputText.trim().split(' ');
    const newCurrentWordIndex = Math.min(typedWords.length - 1, words.length - 1);
    setCurrentWordIndex(newCurrentWordIndex);

    let correctCount = correctCharacters; // Start with current correct characters
    let totalCount = totalCharacters; // Start with current total characters

    // Compare each word up to the current word
    for (let i = 0; i <= newCurrentWordIndex; i++) {
        const typedWord = typedWords[i] || '';
        const targetWord = words[i];

        // Count total characters including spaces
        totalCount += targetWord.length;

        // Count correct characters in the word
        for (let j = 0; j < targetWord.length; j++) {
            if (typedWord[j] === targetWord[j]) {
                correctCount++;
            }
        }

        // Include space as correct if typedWord is complete and matches
        if (typedWord === targetWord && i < words.length - 1) {
            totalCount++; // Add space character to total
            correctCount++; // Add space character to correct if matched
        }
    }

    setCorrectCharacters(correctCount);
    setTotalCharacters(totalCount);

    // If all words are typed, end the test
    if (newCurrentWordIndex === words.length - 1) {
        endTest();
    }

    calculateMetrics(); // Recalculate metrics after each input change
}, [isTestActive, words, calculateMetrics, endTest]);


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
